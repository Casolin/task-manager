import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import useTasks from "../../hooks/useTasks";
import { toast } from "react-toastify";

export const ManageTaskModal = ({ task, open, setOpen }) => {
  const { editUserTask, deleteUserTask, getUserTaskList } = useTasks();

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Pending",
    priority: "Medium",
    tags: "",
    dueDate: "",
  });

  useEffect(() => {
    if (task && open) {
      const populateForm = () => {
        setForm({
          title: task.title || "",
          description: task.description || "",
          status: task.status || "Pending",
          priority: task.priority || "Medium",
          tags: task.tags?.join(",") || "",
          dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
        });
      };
      populateForm();
    }
  }, [task, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
        dueDate: form.dueDate,
      });
      getUserTaskList();
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

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-slate-400 text-sm mb-1 block">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-sm mb-1 block">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  placeholder="tag1, tag2"
                  autoComplete="off"
                  value={form.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={handleDeleteTask}
              className="px-5 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition cursor-pointer"
            >
              Delete Task
            </button>
            <Dialog.Close className="px-5 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition cursor-pointer">
              Cancel
            </Dialog.Close>
            <button
              onClick={handleSaveTask}
              className="px-5 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
