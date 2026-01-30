import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";



import { useNavigate } from "react-router-dom";
import { 
  HiMail, 
  HiLockClosed, 
  HiEye, 
  HiEyeOff, 
  HiUser, 
  HiFingerPrint,
  HiArrowRight,
  HiShieldCheck,
  HiOfficeBuilding

} from "react-icons/hi";

import logo from "../../assets/logo.png";


const EmployeeLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [particles, setParticles] = useState([]);

  // Create floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
    }));
    setParticles(newParticles);
  }, []);

  

  const handleLogin = async (e) => {
  e?.preventDefault();

  if (!email || !password) {
    setError("Please enter both email and password");
    return;
  }

  setError("");
  setLoading(true);

  try {
    // 🔥 Query Firestore team collection
    const q = query(
      collection(db, "team"),
      where("loginEmail", "==", email),
      where("password", "==", password)
    );

    const snapshot = await getDocs(q);
if (!snapshot.empty) {
  const userData = snapshot.docs[0].data();

  console.log("Login Success:", userData.loginEmail);

  // ✅ Save multiple keys (covers most ProtectedRoute checks)
  localStorage.setItem("user", JSON.stringify(userData));
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("token", "employee_logged");

  console.log("Navigating to home...");

  navigate("/");
}

else {
      setError("Invalid email or password");
    }

  } catch (err) {
    console.error(err);
    setError("Login failed");
  }

  setLoading(false);
};

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 overflow-hidden relative">
      
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-blue-400 opacity-20"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
      <div className="absolute top-3/4 left-3/4 w-48 h-48 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500" />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
          
          {/* Card Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full backdrop-blur-sm mb-4">
  <img
    src={logo}
    alt="Company Logo"
    className="w-20 h-20 object-contain"

  />
</div>

            <h1 className="text-3xl font-bold text-white mb-2">
              Innomatrics Tech
            </h1>
            <p className="text-blue-100 text-opacity-90">
              Secure Employee Portal
            </p>
          </div>

          {/* Card Body */}
          <div className="p-8">
            {/* Welcome Message */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">
                Sign in to continue your work journey
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className={`mb-6 p-4 rounded-xl border ${isAnimating ? 'animate-shake' : ''} ${
                error.includes("Invalid") 
                  ? "bg-red-50 border-red-200 text-red-700" 
                  : "bg-yellow-50 border-yellow-200 text-yellow-700"
              }`}>
                <div className="flex items-center gap-3">
                  <HiShieldCheck className="text-xl" />
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div className="group">
                <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                  <HiMail className="text-blue-500" />
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiUser className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    placeholder="employee@company.com"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-gray-50/50"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                  <HiLockClosed className="text-blue-500" />
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiFingerPrint className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-gray-50/50"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <HiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <HiEye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">8+ characters required</span>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full py-4 px-6 rounded-xl font-semibold text-white
                  flex items-center justify-center gap-3
                  transition-all duration-300 transform
                  ${loading 
                    ? 'bg-gradient-to-r from-blue-400 to-indigo-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.02] active:scale-[0.98]'
                  }
                  shadow-lg hover:shadow-xl
                  ${isAnimating ? 'animate-pulse' : ''}
                `}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to Dashboard</span>
                    <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

           

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our Terms of Service
              </p>
              <p className="text-xs text-gray-400 mt-2">
                © 2026 EmpFlow • Innomartics Tech
              </p>
            </div>
          </div>
        </div>

        {/* Demo Credentials Hint */}
      
      </div>

      {/* Add custom animation for shake */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default EmployeeLogin;