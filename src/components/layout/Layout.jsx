import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="p-6 ml-4">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default Layout;
