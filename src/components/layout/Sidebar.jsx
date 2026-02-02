import React, { useState, useEffect } from 'react'
import { 
  HiHome, 
  HiUsers, 
  HiClock, 
  HiChartBar, 
  HiCog, 
  HiLogout,
  HiMenu,
  HiX,
  HiChevronLeft,
  HiChevronRight,
  HiUserCircle,
  HiChat,
  HiCalendar,
  HiDocumentText
} from 'react-icons/hi'



import logo from "../../assets/logo.png"

import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../AuthContext";




const Sidebar = () => {

  const [isCollapsed, setIsCollapsed] = useState(false)


  const navigate = useNavigate()
  const location = useLocation()

const { logout } = useAuth();

const handleLogout = () => {
  const isWorking = localStorage.getItem("workSessionActive") === "true";

  if (isWorking) {
    alert("Please end your work session before logging out.");
    return;
  }

  // clear auth only
  localStorage.removeItem("user");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("loginTime");

  navigate("/login", { replace: true });
};


  // ✅ Route based menu
  const menuItems = [
    // { path: '/', label: 'Dashboard', icon: <HiHome /> },
    { path: '/employees', label: 'Employees', icon: <HiUsers /> },
    { path: '/attendance', label: 'Attendance', icon: <HiClock /> },
    { path: '/reports', label: 'Reports', icon: <HiChartBar /> },
    { path: '/calendar', label: 'Calendar', icon: <HiCalendar />},
     { path: '/request', label: 'Apply Request', icon: <HiDocumentText />},
    // { path: '/message', label: 'Messages', icon: <HiChat /> },
    // { path: '/settings', label: 'Settings', icon: <HiCog /> },
  ]
const handleMenuItemClick = (path) => {
  navigate(path)

  if (window.innerWidth < 1024) {
    setIsCollapsed(true)
  }
}


  return (
    <>
      {/* Mobile Toggle Button */}
    <button
  className="
    lg:hidden
    fixed top-0 left-0 z-[60]
    w-10 h-10
    flex items-center justify-center
    bg-white
    text-gray-700
    rounded-xl
    border border-gray-200
    shadow-sm
  "
  onClick={(e) => {
    e.stopPropagation()   // ⭐ Prevent click going to sidebar
    setIsCollapsed(!isCollapsed)
  }}
>
  {isCollapsed ? <HiMenu size={20} /> : <HiX size={20} />}
</button>



      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 min-h-screen z-40
        bg-white border-r border-gray-200
        transition-all duration-300 ease-in-out
        ${isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
        ${isCollapsed ? 'lg:w-20' : 'w-63'}
        shadow-lg
      `}>
        <div className="h-full flex flex-col">

          {/* Logo Section */}
          <div className="p-6 border-b border-gray-200">
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
              
              {!isCollapsed ? (
                <>
                  <div className="flex items-center gap-3">

                    {/* Logo */}
                    <div className="flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-md">
                      <img
                        src={logo}
                        alt="Company Logo"
                        className="w-10 h-10 object-contain"
                      />
                    </div>

                    {/* Company Name */}
                    <div>
                      <h1 className="text-2xl font-bold text-blue-600 tracking-wide">
                        Innomatrics
                      </h1>
                      <p className="text-xs text-gray-400">
                        Employee Management System
                      </p>
                    </div>

                  </div>

                  <button 
                    className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100"
                    onClick={() => setIsCollapsed(true)}
                  >
                    <HiChevronLeft size={20} />
                  </button>
                </>
              ) : (
                <button 
                  className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100"
                  onClick={() => setIsCollapsed(false)}
                >
                  <HiChevronRight size={20} />
                </button>
              )}

            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleMenuItemClick(item.path)}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-lg
                  transition-all duration-200
                  ${location.pathname === item.path
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                  }
                  ${isCollapsed ? 'justify-center' : 'justify-start'}
                `}
                title={isCollapsed ? item.label : ''}
              >
                <span className="text-xl">{item.icon}</span>

                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            ))}
          </nav>

          {/* Logout + User Info */}
          <div className="p-4 border-t border-gray-200 mt-auto">

            {/* Logout */}
            <button 
              onClick={handleLogout}
              className={`
                w-full flex items-center gap-3 p-3 rounded-lg
                text-red-600 hover:bg-red-50
                transition-all duration-200
                ${isCollapsed ? 'justify-center' : 'justify-start'}
              `}
            >
              <HiLogout size={24} />
              {!isCollapsed && <span className="font-medium">Logout</span>}
            </button>

            {/* User Info */}
            {/* {!isCollapsed && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">

                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <HiUserCircle className="text-blue-600 text-xl" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {userData?.email?.split("@")[0] || "User"}
                    </p>

                    <p className="text-xs text-gray-500 truncate">
                      {userData?.email || ""}
                    </p>
                  </div>

                </div>
              </div>
            )} */}

          </div>
        </div>
      </aside>

      {/* Desktop Spacer */}
      <div className={`
        hidden lg:block
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'}
      `} />

      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  )
}

export default Sidebar
