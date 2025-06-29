import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar for desktop and mobile drawer */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Hamburger button for mobile */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded bg-white shadow sm:hidden"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <main
        className={`flex-1 h-screen overflow-y-auto p-2 sm:p-8 relative transition-filter duration-200 ${sidebarOpen ? 'sm:filter-none filter blur-sm pointer-events-none select-none' : ''}`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout; 