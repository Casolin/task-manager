import { createContext, useState } from "react";
import { getUsers, deleteUser as deleteUserApi } from "../api/users";
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
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!user?.token) return;
    try {
      setLoading(true);
      await deleteUserApi(userId, user.token);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      const msg = err?.response?.data?.message;
      console.error(msg);
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
