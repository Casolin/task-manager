import { useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";

export const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-[#1b0a0f] transform
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:flex-shrink-0
        `}
      >
        <Sidebar />
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 bg-[#12070b] overflow-y-auto">
        <div className="md:hidden flex items-center p-4 bg-[#1b0a0f] border-b border-[#2b0e15]">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white p-2 rounded-md hover:bg-[#2b0e15]"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-white font-semibold ml-4">Dashboard</h1>
          <img src="" alt="" />
        </div>

        <div className="p-6 max-h-[90vh]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
