import React, { useEffect, useState } from "react";
import { HiBell, HiSearch, HiUserCircle } from "react-icons/hi";

import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const Header = () => {

  const [userData, setUserData] = useState(null);

  useEffect(() => {

    const fetchUser = async () => {

      try {

        // ✅ Get login user from localStorage
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (!storedUser?.loginEmail) return;

        // ✅ Fetch latest data from Firestore team collection
        const q = query(
          collection(db, "team"),
          where("loginEmail", "==", storedUser.loginEmail)
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          setUserData(snapshot.docs[0].data());
        }

      } catch (err) {
        console.error("User fetch error:", err);
      }

    };

    fetchUser();

  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 p-4 lg:px-6">
      
      <div className="flex items-center justify-between">

        {/* Search */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees, projects..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 ml-4">

          {/* Notification */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <HiBell size={22} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Info */}
          <div className="flex items-center gap-3">

            <div className="hidden md:block text-right">
              <p className="font-medium">
                {userData?.name || userData?.loginEmail?.split("@")[0] || "User"}
              </p>
              <p className="text-sm text-gray-500">
                {userData?.loginEmail || ""}
              </p>
            </div>

            <HiUserCircle size={32} className="text-gray-600" />

          </div>

        </div>

      </div>
    </header>
  );
};

export default Header;
