import { createContext, useState, useEffect } from "react";
import { registerUser, loginUser, getProfile, updatePfpApi } from "../api/auth";

const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getProfile();
        setUser(response.data);
      } catch (error) {
        console.error("Failed to load user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const register = async (userData) => {
    return registerUser(userData);
  };

  const login = async (credentials) => {
    const response = await loginUser(credentials);
    localStorage.setItem("token", response.data.token);
    setUser(response.data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const updatePfp = async (base64File) => {
    if (!base64File) return;

    try {
      const response = await updatePfpApi(base64File);
      setUser((prev) => ({ ...prev, pfp: response.data.pfp }));
    } catch (err) {
      console.error(
        "Failed to update profile picture:",
        err.response?.data?.message
      );
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
        register,
        login,
        logout,
        updatePfp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
