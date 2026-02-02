import React from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Dashboard from "./components/page/Dashboard";
import EmployeePage from "./components/page/EmployeePage";
import Attendance from "./components/page/Attendance";
import Reports from "./components/page/Reports";
import Messages from "./components/page/Messages";
import Settings from "./components/page/Settings";
import EmployeeLogin from "./components/page/EmployeeLogin";
import HolidayViewer from "./components/page/HolidayViewer";
import ApplyRequest from "./components/page/ApplyRequest";
import ProtectedRoute from "./ProtectedRoute";

const App = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<EmployeeLogin />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="employees" element={<EmployeePage />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="reports" element={<Reports />} />
        <Route path="calendar" element={<HolidayViewer />} />
        <Route path="request" element={<ApplyRequest />} />
        <Route path="message" element={<Messages />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default App;
