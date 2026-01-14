import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import useTasks from "../../hooks/useTasks";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { getUsers } from "../../api/users";

export const ManageTaskModal = ({ task, open, setOpen }) => {
  const { user } = useAuth();
  const { editUserTask, deleteUserTask, getUserTaskList } = useTasks();

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
      getUsers().then((res) => setUsers(res.data));
    }
  }, [open, user]);

  useEffect(() => {
    if (task && open) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "Pending",
        priority: task.priority || "Medium",
        tags: task.tags?.join(",") || "",
        dueDate: task.dueDate?.split("T")[0] || "",
        assignedUsers: task.assignedUsers || [],
      });
    }
  }, [task, open]);

  const toggleUser = (userId) => {
    setForm((prev) => ({
      ...prev,
      assignedUsers: prev.assignedUsers.includes(userId)
        ? prev.assignedUsers.filter((id) => id !== userId)
        : [...prev.assignedUsers, userId],
    }));
  };

  const handleSave = async () => {
    try {
      await editUserTask(task._id, {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()),
      });
      getUserTaskList();
      toast.success("Task updated!");
      setOpen(false);
    } catch {
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUserTask(task._id);
      getUserTaskList();
      toast.success("Task deleted!");
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
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 p-8 rounded-xl w-full max-w-lg text-white space-y-6 max-h-[90vh] overflow-y-auto border border-slate-800">
          <div className="flex justify-between">
            <Dialog.Title className="text-xl font-semibold">
              Edit Task
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-slate-400 hover:text-white">
                <X size={22} />
              </button>
            </Dialog.Close>
          </div>

          <input
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            className="w-full px-4 py-2 bg-slate-800 rounded"
          />

          {user?.role === "admin" && (
            <div>
              <p className="text-sm text-slate-400 mb-2">Assigned Users</p>
              <div className="grid grid-cols-2 gap-2">
                {users.map((u) => (
                  <label
                    key={u._id}
                    className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={form.assignedUsers.includes(u._id)}
                      onChange={() => toggleUser(u._id)}
                    />
                    {u.username}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={handleDelete}
              className="px-5 py-2 bg-red-600 rounded"
            >
              Delete
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-green-600 rounded"
            >
              Save
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
