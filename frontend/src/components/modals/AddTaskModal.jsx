import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import useTasks from "../../hooks/useTasks";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { getUsers } from "../../api/users";

export const AddTaskModal = ({ trigger }) => {
  const { user } = useAuth();
  const { addUserTask, getUserTaskList } = useTasks();

  const [open, setOpen] = useState(false);
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
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        setUsers(res.data);
      } catch (err) {
        toast.error(err.message || "Failed to load users");
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleUser = (userId) => {
    setForm((prev) => ({
      ...prev,
      assignedUsers: prev.assignedUsers.includes(userId)
        ? prev.assignedUsers.filter((id) => id !== userId)
        : [...prev.assignedUsers, userId],
    }));
  };

  const handleAddTask = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required!");
      return;
    }

    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
        createdBy: user?._id,
        assignedUsers:
          form.assignedUsers.length > 0 ? form.assignedUsers : [user?._id],
      };

      await addUserTask(payload);
      getUserTaskList();
      toast.success("Task added successfully!");
      setOpen(false);
      setForm({
        title: "",
        description: "",
        status: "Pending",
        priority: "Medium",
        tags: "",
        dueDate: "",
        assignedUsers: [],
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add task");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 p-8 rounded-xl w-full max-w-lg text-white space-y-6 max-h-[90vh] overflow-y-auto border border-slate-800">
          <div className="flex justify-between">
            <Dialog.Title className="text-xl font-semibold">
              Add New Task
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-slate-400 hover:text-white">
                <X size={22} />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-4">
            <input
              name="title"
              placeholder="Title *"
              value={form.title}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700"
            />

            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700"
            />

            <div className="grid grid-cols-2 gap-4">
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>

              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700"
              />
            </div>

            {user?.role === "admin" && (
              <div>
                <p className="text-sm text-slate-400 mb-2">
                  Assign Users (click to select)
                </p>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {users.map((u) => (
                    <label
                      key={u._id}
                      className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded cursor-pointer hover:bg-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={form.assignedUsers.includes(u._id)}
                        onChange={() => toggleUser(u._id)}
                      />
                      <span>{u.username}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Dialog.Close className="px-5 py-2 bg-slate-700 rounded-lg">
              Cancel
            </Dialog.Close>
            <button
              onClick={handleAddTask}
              className="px-5 py-2 bg-blue-600 rounded-lg"
            >
              Add Task
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
