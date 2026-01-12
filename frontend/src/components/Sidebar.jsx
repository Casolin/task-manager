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
      { name: "Team Members", icon: <Users size={20} />, path: "/team" }
    );
  }

  const handleAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 500,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result;

        try {
          await updatePfp(base64);
          toast.success("Profile picture updated!");
        } catch (err) {
          console.error(err);
          toast.error("Failed to update profile picture");
        }
      };

      reader.readAsDataURL(compressedFile);
    } catch (err) {
      console.error("Image compression failed:", err);
      toast.error("Failed to compress image");
    }
  };

  if (!user) return null;

  return (
    <div className="h-screen w-64 bg-[#1b0a0f] text-white flex flex-col justify-between">
      <div className="p-6 text-center">
        <div
          className="w-[92px] h-[92px] mx-auto mb-2 rounded-full overflow-hidden cursor-pointer border-2 border-gray-300 hover:ring-2 hover:ring-[#0362fc] transition-all duration-200"
          onClick={handleAvatarClick}
          title="Click to change profile picture"
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
          <div className="bg-[#0362fc] text-white text-xs font-semibold px-2 py-1 rounded-full mb-1 inline-block">
            Admin
          </div>
        )}

        <h2 className="font-semibold text-lg">{user.username}</h2>
        <p className="text-sm text-gray-300">{user.email}</p>
      </div>

      <ul className="flex-1 mt-6 space-y-2">
        {navItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 w-full px-6 py-3 transition 
                ${
                  isActive
                    ? "bg-[#2b0e15] border-l-4 border-[#0362fc]"
                    : "hover:bg-[#2b0e15]"
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
        className="w-30 h-30 object-cover rounded-full mx-auto mb-4"
      />

      <div className="px-0 py-4 border-t border-[#2b0e15]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-6 py-3 rounded-r-lg transition cursor-pointer
               hover:bg-[#611000] hover:border-l-4 hover:border-[#0362fc] text-white"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
