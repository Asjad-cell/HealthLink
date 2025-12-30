import { useState } from "react";
import Navbar from "@components/dashboard/Navbar";
import Sidebar from "@components/dashboard/Sidebar";
import { Outlet } from "react-router-dom";
import { Toaster } from "@components/ui/Sonner";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      {/* Content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - full height */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Toaster 
            position="bottom-right"
            richColors
            closeButton
            expand={false}
            duration={4000}
          />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
