import { Home, Clipboard, FileText, Users, LogOut } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { NavLink } from "react-router-dom";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import imageCompression from "browser-image-compression";

export const Sidebar = () => {
  const { user, logout, updatePfp } = useAuth();
  const fileInputRef = useRef(null);

  const handleLogout = () => {
    const audio = new Audio("/caseohban.mp3");
    audio.play().catch(() => {});
    logout();
    toast.info("Logged out!");
  };

  useEffect(() => {
    if (!user) return;
    const audio = new Audio("/caseoh.mp3");
    audio.play().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const navItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/dashboard" },
    { name: "Manage Tasks", icon: <Clipboard size={20} />, path: "/tasks" },
  ];

  if (user?.role === "admin") {
    navItems.push(
      { name: "All Tasks", icon: <FileText size={20} />, path: "/list" },
      { name: "Team Members", icon: <Users size={20} />, path: "/users" }
    );
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 500,
        useWebWorker: true,
      });

      const reader = new FileReader();
      reader.onloadend = async () => {
        await updatePfp(reader.result);
        toast.success("Profile picture updated!");
      };

      reader.readAsDataURL(compressedFile);
    } catch {
      toast.error("Failed to update profile picture");
    }
  };

  if (!user) return null;

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col justify-between border-r border-slate-800">
      <div className="p-6 text-center">
        <div
          onClick={handleAvatarClick}
          className="w-[92px] h-[92px] mx-auto mb-3 rounded-full overflow-hidden cursor-pointer
          border-2 border-slate-600 hover:ring-2 hover:ring-blue-500 transition"
        >
          <img
            src={user.pfp || "/default-avatar.png"}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {user.role === "admin" && (
          <span className="inline-block mb-2 text-xs font-semibold px-2 py-1 rounded-full bg-blue-600">
            Admin
          </span>
        )}

        <h2 className="font-semibold text-lg">{user.username}</h2>
        <p className="text-sm text-slate-400">{user.email}</p>
      </div>

      <ul className="flex-1 mt-4 space-y-1">
        {navItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 transition
                ${
                  isActive
                    ? "bg-slate-800 border-l-4 border-blue-500"
                    : "hover:bg-slate-800"
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <img
        src="/logo.png"
        alt="Logo"
        className="w-24 h-24 object-cover rounded-full mx-auto my-4 opacity-80"
      />

      <div className="border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-6 py-3 transition cursor-pointer
          hover:bg-red-600/20 hover:border-l-4 hover:border-red-500"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
