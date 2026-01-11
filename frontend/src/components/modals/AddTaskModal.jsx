import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import useTasks from "../../hooks/useTasks";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

export const AddTaskModal = ({ trigger }) => {
  const { addUserTask, getUserTaskList } = useTasks();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Pending",
    priority: "Medium",
    tags: "",
    dueDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
        dueDate: form.dueDate,
        createdBy: user?._id,
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
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add task");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1b0a0f] p-8 rounded-xl w-full max-w-lg text-white shadow-lg space-y-6 overflow-y-auto max-h-[90vh]">
          <div className="flex justify-between items-start">
            <div>
              <Dialog.Title className="text-2xl font-bold">
                Add New Task
              </Dialog.Title>
              <Dialog.Description className="text-gray-400 text-sm mt-1">
                Complete the form below to create a new task
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-white cursor-pointer">
                <X size={24} />
              </button>
            </Dialog.Close>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-gray-300 text-sm mb-1 block">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-[#2b0e15] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0362fc]"
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm mb-1 block">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-[#2b0e15] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0362fc]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-300 text-sm mb-1 block">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-[#2b0e15] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0362fc]"
                >
                  <option value="Pending">Pending</option>
                  <option value="In-Progress">In-Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="text-gray-300 text-sm mb-1 block">
                  Priority
                </label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-[#2b0e15] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0362fc]"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-300 text-sm mb-1 block">Tags</label>
                <input
                  type="text"
                  name="tags"
                  placeholder="tag1, tag2"
                  value={form.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-[#2b0e15] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0362fc]"
                />
              </div>

              <div>
                <label className="text-gray-300 text-sm mb-1 block">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-[#2b0e15] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0362fc]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Dialog.Close className="px-5 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition cursor-pointer   ">
              Cancel
            </Dialog.Close>
            <button
              onClick={handleAddTask}
              className="px-5 py-2 bg-[#0362fc] rounded-lg hover:bg-blue-700 transition cursor-pointer"
            >
              Add Task
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
