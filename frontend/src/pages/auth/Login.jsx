import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

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
      style={{ backgroundImage: "url('/authentification.jpg')" }}
    >
      <div className="hidden lg:flex flex-col justify-center px-24 bg-gradient-to-r from-[#1b0a0f]/80 to-transparent">
        <h1 className="text-6xl font-semibold text-[#f5eaea] leading-tight">
          Welcome Back! Let's Get You Logged In.
        </h1>
        <p className="mt-8 text-lg text-[#e6c9c9] max-w-md">
          Stay on top of your tasks and focus on what matters. Log in to get
          started.
        </p>
      </div>

      <div className="flex items-center justify-center px-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm bg-[#f9f3f3] rounded-3xl px-12 py-14 shadow-[0_40px_100px_rgba(0,0,0,0.45)]"
        >
          <h2 className="text-3xl font-semibold text-[#2b0e15] mb-12">
            Sign in
          </h2>

          <div className="space-y-8">
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full bg-transparent border-b border-[#b07a83] py-2 text-[#2b0e15] placeholder-[#b07a83] focus:outline-none focus:border-[#2b0e15]"
            />

            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full bg-transparent border-b border-[#b07a83] py-2 text-[#2b0e15] placeholder-[#b07a83] focus:outline-none focus:border-[#2b0e15]"
            />
          </div>

          <button
            type="submit"
            className="mt-14 w-full rounded-full bg-[#2b0e15] py-3 text-[#f9f3f3] font-medium hover:bg-[#1f0a10] transition cursor-pointer"
          >
            Login
          </button>

          <p className="mt-8 text-center text-sm text-[#6e3a43]">
            Don't have an account?{" "}
            <span
              className="font-medium hover:underline cursor-pointer"
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
