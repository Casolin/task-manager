import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [user, setUser] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = user;

    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }

    try {
      await login(user);
      toast.success("Logged in successfully");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    document.title = "Sign in · Taskify";
  }, []);

  return (
    <div
      className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-cover bg-center"
      style={{ backgroundImage: "url('/authentication.jpg')" }}
    >
      <div className="hidden lg:flex flex-col justify-center px-24 bg-gradient-to-r from-[#1b0a0f]/80 to-transparent">
        <h1 className="text-6xl font-bold text-white leading-tight">
          Welcome Back!
        </h1>
        <p className="mt-8 text-lg text-[#e6c9c9] max-w-md">
          Stay on top of your tasks and focus on what matters. Log in to get
          started.
        </p>
      </div>

      <div className="flex items-center justify-center px-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm bg-slate-900/90 backdrop-blur-sm rounded-3xl px-12 py-14 shadow-lg border border-blue-700"
        >
          <h2 className="text-3xl font-bold text-white mb-10 text-center">
            Sign in
          </h2>

          <div className="space-y-6">
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
          </div>

          <button
            type="submit"
            className="mt-12 w-full rounded-full bg-blue-600 py-3 text-white font-semibold hover:bg-blue-500 transition"
          >
            Login
          </button>

          <p className="mt-6 text-center text-sm text-blue-200">
            Don't have an account?{" "}
            <span
              className="font-semibold hover:underline cursor-pointer text-blue-400"
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};
