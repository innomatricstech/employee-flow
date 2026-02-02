import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot
} from "firebase/firestore";

const Attendance = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [todaySession, setTodaySession] = useState(null);
  const [history, setHistory] = useState([]);

  // 🔹 Safe time formatter
  const formatTime = (time) => {
    if (!time) return "-";

    const date =
      time instanceof Date
        ? time
        : time?.toDate?.()
        ? time.toDate()
        : new Date(time);

    if (isNaN(date)) return "-";

    return date.toLocaleString();
  };

  // 🔹 Fetch attendance
  useEffect(() => {
    if (!user?.loginEmail) return;

    const q = query(
      collection(db, "workSessions"),
      where("employeeEmail", "==", user.loginEmail),
      orderBy("loginTime", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // ✅ FULL HISTORY (ALL TIME)
      setHistory(list);

      // ✅ TODAY'S LATEST SESSION
      const today = new Date().toISOString().split("T")[0];

      const todayLatest = list.find(
        item => item.date === today
      );

      setTodaySession(todayLatest || null);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ================= HEADER ================= */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Attendance Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Track your attendance history and today’s session
          </p>
        </div>

        {/* ================= TODAY CARD ================= */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-5">
            <h2 className="text-xl font-semibold text-white">
              Today's Attendance
            </h2>
          </div>

          <div className="p-6">
            {todaySession ? (
              <div className="grid md:grid-cols-3 gap-6">

                <div className="bg-indigo-50 rounded-xl p-4">
                  <p className="text-sm text-indigo-500 font-medium">
                    Check In
                  </p>
                  <p className="text-lg font-bold text-gray-800 mt-1">
                    {formatTime(todaySession.loginTime)}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-sm text-blue-500 font-medium">
                    Check Out
                  </p>
                  <p className="text-lg font-bold text-gray-800 mt-1">
                    {formatTime(todaySession.logoutTime)}
                  </p>
                </div>

                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-sm text-green-500 font-medium">
                    Status
                  </p>
                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                      todaySession.logoutTime
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {todaySession.logoutTime ? "Checked Out" : "Checked In"}
                  </span>
                </div>

              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-400 text-lg">
                  No attendance marked today
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ================= HISTORY CARD ================= */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-5">
            <h2 className="text-xl font-semibold text-white">
              Attendance History (All Time)
            </h2>
          </div>

          <div className="p-6">
            {history.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-400 text-lg">
                  No history available
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Check In</th>
                      <th className="p-3 text-left">Check Out</th>
                      <th className="p-3 text-left">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {history.map((row, i) => (
                      <tr
                        key={row.id}
                        className={`border-b hover:bg-indigo-50 transition ${
                          i % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="p-3 font-medium text-gray-700">
                          {row.date}
                        </td>

                        <td className="p-3 text-gray-600">
                          {formatTime(row.loginTime)}
                        </td>

                        <td className="p-3 text-gray-600">
                          {formatTime(row.logoutTime)}
                        </td>

                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              row.logoutTime
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {row.logoutTime ? "Completed" : "Active"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Attendance;
