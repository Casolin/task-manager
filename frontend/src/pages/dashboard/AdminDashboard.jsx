import { useContext, useState } from "react";
import UserContext from "../../context/UserContext";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { DeleteUserModal } from "../../components/modals/DeleteUserModal";

export const AdminDashboard = () => {
  const { user: loggedInUser } = useAuth();
  const { users, deleteUser, loading } = useContext(UserContext);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    try {
      await deleteUser(selectedUser._id);
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error(err.message || "Failed to delete user");
    } finally {
      setSelectedUser(null);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-slate-950 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <div className="text-right text-slate-300">
          <p className="text-sm">Logged in as:</p>
          <p className="font-semibold text-white">{loggedInUser.username}</p>
          <p className="text-xs capitalize">{loggedInUser.role}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-slate-400">Loading users...</p>
        ) : (
          users.map((u) => (
            <div
              key={u._id}
              className={`p-4 rounded-lg shadow-lg transition
                  ${
                    u._id === loggedInUser._id
                      ? "bg-blue-900"
                      : "bg-slate-800 hover:bg-slate-700"
                  }
                `}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="font-semibold text-lg text-white">
                    {u.username}
                  </h2>
                  <p className="text-sm text-slate-400">{u.email}</p>
                  <span
                    className={`inline-block mt-1 text-xs px-2 py-1 rounded-full ${
                      u.role === "admin"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-600 text-slate-200"
                    }`}
                  >
                    {u.role}
                  </span>
                </div>
                {loggedInUser.role === "admin" &&
                  loggedInUser._id !== u._id && (
                    <button
                      onClick={() => handleDeleteClick(u)}
                      className="ml-2 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white transition cursor-pointer"
                    >
                      Delete
                    </button>
                  )}
              </div>
            </div>
          ))
        )}
      </div>

      {selectedUser && (
        <DeleteUserModal
          open={modalOpen}
          setOpen={setModalOpen}
          onConfirm={handleConfirmDelete}
          userName={selectedUser.username}
        />
      )}
    </div>
  );
};
