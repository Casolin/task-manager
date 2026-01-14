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

        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 p-8 rounded-xl w-full max-w-lg text-white shadow-xl space-y-6 overflow-y-auto max-h-[90vh] border border-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <Dialog.Title className="text-xl font-semibold">
                Add New Task
              </Dialog.Title>
              <Dialog.Description className="text-slate-400 text-sm mt-1">
                Complete the form below to create a new task
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button className="text-slate-400 hover:text-white">
                <X size={22} />
              </button>
            </Dialog.Close>
          </div>

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

            {user?.role === "admin" && (
              <div>
                <label className="text-slate-400 text-sm mb-2 block">
                  Assign Users (click to select)
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-slate-800 rounded-lg p-2">
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-sm mb-1 block">
                  Tags
                </label>
                <input
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="tag1, tag2"
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

          <div className="flex justify-end gap-3 mt-6">
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
