import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { 
  HiClock, 
  HiUser, 
  HiPlay, 
  HiPause, 
  HiStop, 
  HiCheckCircle, 
  HiArrowRight,
  HiCalendar,
  HiCog,
  HiRefresh,
  HiDocumentText,
  HiChartBar,
  HiEmojiHappy,
  HiLightningBolt,
 
  HiSun,
  HiMoon,
  HiBell
} from "react-icons/hi";

import { FaCoffee } from "react-icons/fa";

const EmployeeFlow = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  
  // States
  const [loginTime, setLoginTime] = useState("");
  const [logoutTime, setLogoutTime] = useState("");
  const [workStatus, setWorkStatus] = useState("idle"); // idle, working, break, lunch, completed
  const [breakStart, setBreakStart] = useState("");
  const [breakEnd, setBreakEnd] = useState("");
  const [lunchStart, setLunchStart] = useState("");
  const [lunchEnd, setLunchEnd] = useState("");
  const [totalHours, setTotalHours] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [todaysSession, setTodaysSession] = useState(null);
  const [workLog, setWorkLog] = useState("");
  const [notifications, setNotifications] = useState([]);

  const [isSessionActive, setIsSessionActive] = useState(true);

  // Timer effect
  useEffect(() => {
    let interval;
    if (workStatus === "working") {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [workStatus]);

 useEffect(() => {
  if (!user?.loginEmail || !isSessionActive) return;

  const today = new Date().toISOString().split('T')[0];

  const q = query(
    collection(db, "workSessions"),
    where("employeeEmail", "==", user.loginEmail),
    where("date", "==", today),
    orderBy("loginTime", "desc")
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      if (!snapshot.empty) {
        const session = snapshot.docs[0].data();

        setLoginTime(session.loginTime?.toDate?.() || null);
        setBreakStart(session.breakStart?.toDate?.() || null);
        setBreakEnd(session.breakEnd?.toDate?.() || null);
        setLunchStart(session.lunchStart?.toDate?.() || null);
        setLunchEnd(session.lunchEnd?.toDate?.() || null);
        setLogoutTime(session.logoutTime?.toDate?.() || null);
      }
    },
    (error) => {
      console.error("Snapshot error:", error);
    }
  );

  return () => unsubscribe();
}, [user, isSessionActive]);


 const formatTime = (time) => {
  if (!time) return "-";

  const dateObj = time instanceof Date ? time : new Date(time);

  if (isNaN(dateObj)) return "-";

  return dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });
};


  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  // Firestore functions
  const createSession = async (data) => {
    try {
      const docRef = await addDoc(collection(db, "workSessions"), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        date: new Date().toISOString().split('T')[0]
      });
      setSessionId(docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  };

  const updateSession = async (data) => {
    if (!sessionId) return;
    try {
      await updateDoc(doc(db, "workSessions", sessionId), {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating session:", error);
      throw error;
    }
  };

  // LOGIN
  const handleLogin = async () => {
    if (!user) {

      return;
    }

    setIsLoading(true);
    try {
      const loginTimestamp = new Date();
      setLoginTime(loginTimestamp);

      setWorkStatus("working");
      setTimer(0);

      await createSession({
        employeeId: user.employeeId,
        employeeName: user.name,
        employeeEmail: user.loginEmail,
        loginTime: loginTimestamp,
        status: "working"
      });

      addNotification("Session Started", "You have successfully logged in for work", "success");
    } catch (error) {
      console.error("Login error:", error);
    
    } finally {
      setIsLoading(false);
    }
  };

  // BREAK START
  const handleBreakStart = async () => {
    const breakStartTime = new Date();
    setBreakStart(breakStartTime);
    setWorkStatus("break");

    await updateSession({
      breakStart: breakStartTime,
      status: "break",
      workLog
    });

    addNotification("Break Started", "Take a short break and recharge", "info");
  };

  // BREAK END
  const handleBreakEnd = async () => {
    const breakEndTime = new Date();
    setBreakEnd(breakEndTime);

    setWorkStatus("working");

    await updateSession({
      breakEnd: breakEndTime,
      status: "working",
      breakDuration: calculateDuration(breakStart, breakEndTime),
      workLog
    });

    addNotification("Break Ended", "Welcome back to work!", "success");
  };

  // LUNCH START
  const handleLunchStart = async () => {
    const lunchStartTime = new Date();
    setLunchStart(lunchStartTime);
    setWorkStatus("lunch");

    await updateSession({
      lunchStart: lunchStartTime,
      status: "lunch",
      workLog
    });

    addNotification("Lunch Started", "Enjoy your meal!", "info");
  };

  // LUNCH END
  const handleLunchEnd = async () => {
    const lunchEndTime = new Date();
    setLunchEnd(lunchEndTime);
    setWorkStatus("working");

    await updateSession({
      lunchEnd: lunchEndTime,
      status: "working",
      lunchDuration: calculateDuration(lunchStart, lunchEndTime),
      workLog
    });

    addNotification("Lunch Ended", "Back to work!", "success");
  };

const handleLogout = async () => {
  if (!window.confirm("Are you sure you want to log out?")) return;

  setIsLoading(true);

  try {
    const logoutTimestamp = new Date();

    setLogoutTime(logoutTimestamp);
    setWorkStatus("completed");

    let totalWorkHours = "";

    if (loginTime) {
      const diffMs = logoutTimestamp - loginTime;

      const hrs = Math.floor(diffMs / 3600000);
      const mins = Math.floor((diffMs % 3600000) / 60000);

      totalWorkHours = `${hrs}:${mins.toString().padStart(2, "0")}`;
      setTotalHours(totalWorkHours);
    }

    await updateSession({
      logoutTime: logoutTimestamp,
      status: "completed",
      totalHours: totalWorkHours,
      workDuration: timer,
      workLog
    });

    setIsSessionActive(false);

    addNotification("Session Completed", "Logged out successfully", "success");

    setTimeout(() => {
      setSessionId(null);
      setLoginTime(null);
      setBreakStart(null);
      setBreakEnd(null);
      setLunchStart(null);
      setLunchEnd(null);
      setLogoutTime(null);
      setTotalHours("");
      setWorkStatus("idle");
      setTimer(0);
      setWorkLog("");
    }, 1000);

  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    setIsLoading(false);
  }
};

  // Helper functions
  const calculateDuration = (start, end) => {
    if (!start || !end) return 0;
    const startTime = new Date(start);
    const endTime = new Date(end);
    return Math.floor((endTime - startTime) / 1000);
  };

  const addNotification = (title, message, type) => {
    const id = Date.now();
    const newNotification = {
      id,
      title,
      message,
      type,
      time: new Date().toLocaleTimeString()
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const getStatusColor = () => {
    switch (workStatus) {
      case "working": return "from-green-500 to-emerald-600";
      case "break": return "from-yellow-500 to-orange-500";
      case "lunch": return "from-red-500 to-pink-600";
      case "completed": return "from-purple-500 to-indigo-600";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getStatusIcon = () => {
    switch (workStatus) {
      case "working": return <HiPlay className="text-xl" />;
      case "break": return <FaCoffee className="text-xl" />;
      case "lunch": return <HiSun className="text-xl" />;
      case "completed": return <HiCheckCircle className="text-xl" />;
      default: return <HiClock className="text-xl" />;
    }
  };

  const getStatusText = () => {
    switch (workStatus) {
      case "working": return "Working Actively";
      case "break": return "On Break";
      case "lunch": return "Lunch Time";
      case "completed": return "Session Complete";
      default: return "Ready to Start";
    }
  };

  const canPerformAction = (action) => {
    const validTransitions = {
      idle: ['login'],
      working: ['breakStart', 'lunchStart', 'logout'],
      break: ['breakEnd'],
      lunch: ['lunchEnd'],
      completed: []
    };
    return validTransitions[workStatus]?.includes(action) || false;
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <HiClock className="text-2xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent">
                  Work Session Tracker
                </h1>
                <p className="text-gray-600 mt-1">Track your daily work activities and productivity</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
                <div className="flex items-center gap-2">
                  <HiCalendar className="text-blue-600" />
                  <span className="font-medium">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - User Info & Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Control Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className={`bg-gradient-to-r ${getStatusColor()} p-6`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      {getStatusIcon()}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Current Status</h2>
                      <p className="text-white/90">{getStatusText()}</p>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{formatDuration(timer)}</div>
                        <div className="text-sm text-white/80">Active Time</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <button
                    onClick={handleLogin}
                    disabled={!canPerformAction('login') || isLoading}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all ${
                      canPerformAction('login')
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90 hover:scale-105'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <HiPlay className="text-2xl mb-2" />
                    <span className="font-medium">Login</span>
                    <span className="text-xs mt-1">Start Work</span>
                  </button>

                  <button
                    onClick={handleBreakStart}
                    disabled={!canPerformAction('breakStart') || isLoading}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all ${
                      canPerformAction('breakStart')
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:opacity-90 hover:scale-105'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <FaCoffee className="text-2xl mb-2" />
                    <span className="font-medium">Break Start</span>
                    <span className="text-xs mt-1">Take Rest</span>
                  </button>

                  <button
                    onClick={handleBreakEnd}
                    disabled={!canPerformAction('breakEnd') || isLoading}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all ${
                      canPerformAction('breakEnd')
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90 hover:scale-105'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <HiArrowRight className="text-2xl mb-2" />
                    <span className="font-medium">Break End</span>
                    <span className="text-xs mt-1">Resume Work</span>
                  </button>

                  <button
                    onClick={handleLunchStart}
                    disabled={!canPerformAction('lunchStart') || isLoading}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all ${
                      canPerformAction('lunchStart')
                        ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:opacity-90 hover:scale-105'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <HiSun className="text-2xl mb-2" />
                    <span className="font-medium">Lunch Start</span>
                    <span className="text-xs mt-1">Meal Time</span>
                  </button>

                  <button
                    onClick={handleLunchEnd}
                    disabled={!canPerformAction('lunchEnd') || isLoading}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all ${
                      canPerformAction('lunchEnd')
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90 hover:scale-105'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <HiArrowRight className="text-2xl mb-2" />
                    <span className="font-medium">Lunch End</span>
                    <span className="text-xs mt-1">Back to Work</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    disabled={!canPerformAction('logout') || isLoading}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all ${
                      canPerformAction('logout')
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:opacity-90 hover:scale-105'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <HiStop className="text-2xl mb-2" />
                    <span className="font-medium">Logout</span>
                    <span className="text-xs mt-1">End Session</span>
                  </button>
                </div>

                {isLoading && (
                  <div className="mt-6 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Work Log */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <HiDocumentText className="text-blue-600" />
                Daily Work Log
              </h3>
              <textarea
                value={workLog}
                onChange={(e) => setWorkLog(e.target.value)}
                placeholder="What are you working on today? Add notes about your tasks and progress..."
                className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                rows={4}
              />
              <p className="text-sm text-gray-500 mt-2">Your log will be saved automatically with each action</p>
            </div>
          </div>

          {/* Right Column - Info & Stats */}
          <div className="space-y-6">
            {/* User Info Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <HiUser className="text-blue-600" />
                Employee Profile
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{user?.name || "User"}</h4>
                    <p className="text-sm text-gray-600">{user?.employeeId || "ID: N/A"}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-blue-100">
                  <p className="text-sm text-gray-600 mb-2">Today's Session ID</p>
                  <p className="font-mono text-sm text-gray-800 bg-white px-3 py-2 rounded-lg">
                    {sessionId ? sessionId.substring(0, 8) + "..." : "No active session"}
                  </p>
                </div>
              </div>
            </div>

            {/* Time Summary */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <HiClock className="text-blue-600" />
                Time Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Login Time</span>
                  <span className="font-medium">{formatTime(loginTime)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Break</span>
                  <span className="font-medium">
                    {formatTime(breakStart)} → {formatTime(breakEnd)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Lunch</span>
                  <span className="font-medium">
                    {formatTime(lunchStart)} → {formatTime(lunchEnd)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Logout Time</span>
                  <span className="font-medium">{formatTime(logoutTime)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Total Hours</span>
                  <span className="text-xl font-bold text-green-600">{totalHours || "-"}</span>
                </div>
              </div>
            </div>

           
          </div>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="fixed bottom-4 right-4 space-y-2 z-50">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl shadow-lg border p-4 max-w-sm animate-slide-in-right ${
                  notification.type === 'success' ? 'border-green-200 bg-green-50' :
                  notification.type === 'info' ? 'border-blue-200 bg-blue-50' :
                  'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    notification.type === 'success' ? 'bg-green-100 text-green-600' :
                    notification.type === 'info' ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    <HiBell />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{notification.title}</h4>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                  </div>
                  <span className="text-xs text-gray-500">{notification.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        
      </div>
    </div>
  );
};

export default EmployeeFlow;