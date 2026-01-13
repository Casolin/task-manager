import { createContext, useState } from "react";
import { getUsers, deleteUser as deleteUserApi } from "../api/users";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth.js";

const UserContext = createContext(null);

export const UserContextProvider = ({ children }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await getUsers(user.token);
      setUsers(res.data);
    } catch (err) {
      toast.error(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!user) return;
    try {
      setLoading(true);
      await deleteUserApi(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      toast.error(err.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ users, loading, fetchUsers, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
