import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, confirmpassword } = user;

    if (!username || !email || !password || !confirmpassword) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmpassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const currentUser = { username, email, password };
      await register(currentUser);
      toast.success("Registered successfully");
      setUser({
        username: "",
        email: "",
        password: "",
        confirmpassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    document.title = "Create account · Taskify";
  }, []);

  return (
    <div
      className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-cover bg-center"
      style={{ backgroundImage: "url('/authentication.jpg')" }}
    >
      {/* Left welcome panel */}
      <div className="hidden lg:flex flex-col justify-center px-24 bg-gradient-to-r from-[#1b0a0f]/80 to-transparent">
        <h1 className="text-6xl font-bold text-white leading-tight">
          Get Started
        </h1>
        <p className="mt-6 text-lg text-blue-200 max-w-md">
          Create your account and start your journey in a space crafted for calm
          focus and clarity.
        </p>
      </div>

      {/* Register form */}
      <div className="flex items-center justify-center px-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm bg-slate-900/90 backdrop-blur-sm rounded-3xl px-12 py-14 shadow-lg border border-blue-700"
        >
          <h2 className="text-3xl font-bold text-white mb-10 text-center">
            Create Account
          </h2>

          <div className="space-y-6">
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
              placeholder="Username"
              autoComplete="off"
              className="w-full bg-transparent border-b border-blue-600 py-3 text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 transition"
            />

            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Email"
              autoComplete="off"
              className="w-full bg-transparent border-b border-blue-600 py-3 text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 transition"
            />

            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full bg-transparent border-b border-blue-600 py-3 text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 transition"
            />

            <input
              type="password"
              name="confirmpassword"
              value={user.confirmpassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full bg-transparent border-b border-blue-600 py-3 text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 transition"
            />
          </div>

          <button
            type="submit"
            className="mt-12 w-full rounded-full bg-blue-600 py-3 text-white font-semibold hover:bg-blue-500 transition cursor-pointer"
          >
            Register
          </button>

          <p className="mt-6 text-center text-sm text-blue-200">
            Already have an account?{" "}
            <span
              className="font-semibold hover:underline cursor-pointer text-blue-400"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};
