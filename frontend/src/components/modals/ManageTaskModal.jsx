import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Plus } from "lucide-react";
import useTasks from "../../hooks/useTasks";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { getUsers } from "../../api/users";

export const ManageTaskModal = ({ task, open, setOpen }) => {
  const { user } = useAuth();
  const { editUserTask, deleteUserTask, getUserTaskList, getUsersTaskList } =
    useTasks();

  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Pending",
    priority: "Medium",
    tags: "",
    dueDate: "",
    assignedUsers: [],
  });

  useEffect(() => {
    if (open && user?.role === "admin") {
      const fetchUsers = async () => {
        try {
          const res = await getUsers();
          setUsers(res.data);
        } catch (err) {
          toast.error(err.message || "Failed to load users");
        }
      };
      fetchUsers();
    }
  }, [open, user]);

  useEffect(() => {
    if (!task || !open) return;
    const editForm = () => {
      setForm({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "Pending",
        priority: task.priority || "Medium",
        tags: task.tags?.join(",") || "",
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
        assignedUsers: Array.isArray(task.assignedUsers)
          ? task.assignedUsers.map((u) => (typeof u === "string" ? u : u._id))
          : [],
      });
    };
    editForm();
  }, [task, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addUser = (userId) => {
    if (!form.assignedUsers.includes(userId)) {
      setForm((prev) => ({
        ...prev,
        assignedUsers: [...prev.assignedUsers, userId],
      }));
    }
  };

  const removeUser = (userId) => {
    setForm((prev) => ({
      ...prev,
      assignedUsers: prev.assignedUsers.filter((id) => id !== userId),
    }));
  };

  const handleSaveTask = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required!");
      return;
    }

    try {
      await editUserTask(task._id, {
        ...form,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
        assignedUsers:
          form.assignedUsers.length > 0 ? form.assignedUsers : [user?._id],
      });

      getUserTaskList();
      getUsersTaskList();
      toast.success("Task updated successfully!");
      setOpen(false);
    } catch {
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async () => {
    try {
      await deleteUserTask(task._id);
      getUserTaskList();
      getUsersTaskList();
      toast.success("Task deleted successfully!");
      setOpen(false);
    } catch {
      toast.error("Failed to delete task");
    }
  };

  if (!task) return null;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 p-8 rounded-xl w-full max-w-lg text-white shadow-xl space-y-6 overflow-y-auto max-h-[90vh] border border-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <Dialog.Title className="text-xl font-semibold">
                Edit Task
              </Dialog.Title>
              <Dialog.Description className="text-slate-400 text-sm mt-1">
                Modify your task details below
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button className="text-slate-400 hover:text-white cursor-pointer">
                <X size={22} />
              </button>
            </Dialog.Close>
          </div>

          {/* Task fields */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-slate-400 text-sm mb-1 block">
                Title *
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700"
              />
            </div>

            <div>
              <label className="text-slate-400 text-sm mb-1 block">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-sm mb-1 block">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700"
                >
                  <option value="Pending">Pending</option>
                  <option value="In-Progress">In-Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 text-sm mb-1 block">
                  Priority
                </label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            {/* Assign Users */}
            {user?.role === "admin" && (
              <div>
                <label className="text-slate-400 text-sm mb-2 block">
                  Assigned Users
                </label>

                {/* Assigned users list */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.assignedUsers.map((userId) => {
                    const u = users.find((usr) => usr._id === userId);
                    if (!u) return null;
                    return (
                      <div
                        key={userId}
                        className="flex items-center gap-1 bg-slate-700 px-2 py-1 rounded"
                      >
                        <span>{u.username}</span>
                        <X
                          size={14}
                          className="cursor-pointer text-red-400 hover:text-red-200"
                          onClick={() => removeUser(userId)}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Users to add */}
                <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto border border-slate-800 rounded-lg p-2">
                  {users.map((u) => (
                    <div
                      key={u._id}
                      className="flex justify-between items-center bg-slate-800 px-3 py-2 rounded cursor-pointer hover:bg-slate-700"
                    >
                      <span>{u.username}</span>
                      <Plus
                        size={16}
                        className="text-green-400 hover:text-green-200 cursor-pointer"
                        onClick={() => addUser(u._id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags & Due date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-sm mb-1 block">
                  Tags
                </label>
                <input
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700"
                />
              </div>

              <div>
                <label className="text-slate-400 text-sm mb-1 block">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={handleDeleteTask}
              className="px-5 py-2 bg-red-600 rounded-lg cursor-pointer"
            >
              Delete Task
            </button>
            <Dialog.Close className="px-5 py-2 bg-slate-700 rounded-lg cursor-pointer">
              Cancel
            </Dialog.Close>
            <button
              onClick={handleSaveTask}
              className="px-5 py-2 bg-green-600 rounded-lg cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
