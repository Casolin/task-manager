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
      style={{ backgroundImage: "url('/authentification.jpg')" }}
    >
      <div className="hidden lg:flex flex-col justify-center px-24 bg-gradient-to-r from-[#1b0a0f]/80 to-transparent">
        <h1 className="text-6xl font-semibold text-[#f5eaea] leading-tight">
          Get started
        </h1>
        <p className="mt-8 text-lg text-[#e6c9c9] max-w-md">
          Create your account and start your journey in a space crafted for calm
          focus and clarity.
        </p>
      </div>

      <div className="flex items-center justify-center px-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm bg-[#f9f3f3] rounded-3xl px-12 py-14 shadow-[0_40px_100px_rgba(0,0,0,0.45)]"
        >
          <h2 className="text-3xl font-semibold text-[#2b0e15] mb-12">
            Create account
          </h2>

          <div className="space-y-8">
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full bg-transparent border-b border-[#b07a83] py-2 text-[#2b0e15] placeholder-[#b07a83] focus:outline-none focus:border-[#2b0e15]"
            />

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

            <input
              type="password"
              name="confirmpassword"
              value={user.confirmpassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="w-full bg-transparent border-b border-[#b07a83] py-2 text-[#2b0e15] placeholder-[#b07a83] focus:outline-none focus:border-[#2b0e15]"
            />
          </div>

          <button
            type="submit"
            className="mt-14 w-full rounded-full bg-[#2b0e15] py-3 text-[#f9f3f3] font-medium hover:bg-[#1f0a10] transition cursor-pointer"
          >
            Register
          </button>

          <p className="mt-8 text-center text-sm text-[#6e3a43]">
            Already have an account?{" "}
            <span
              className="font-medium hover:underline cursor-pointer"
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
