import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 h-screen overflow-y-auto p-8 relative">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout; 