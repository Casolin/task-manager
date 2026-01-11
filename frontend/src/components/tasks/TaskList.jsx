import { useEffect, useState } from "react";
import useTasks from "../../hooks/useTasks";
import { TaskCard } from "./TaskCard";
import { Plus, RefreshCw } from "lucide-react";
import { AddTaskModal } from "../modals/AddTaskModal";
import useAuth from "../../hooks/useAuth";

export const TaskList = () => {
  const { tasks, getUserTaskList } = useTasks();
  const { user } = useAuth();
  const [filter, setFilter] = useState("All");

  console.log(user);

  useEffect(() => {
    getUserTaskList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredTasks =
    filter === "All" ? tasks : tasks.filter((task) => task.status === filter);

  return (
    <div className="min-h-screen bg-[#12070b] text-white px-6 py-6 container">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold">My Tasks</h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#1b0a0f] text-white border border-[#2b0e15] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0362fc]"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="In-Progress">In-Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <AddTaskModal
              trigger={
                <button className="bg-[#0362fc] text-white p-2 rounded-full hover:bg-blue-700 transition cursor-pointer">
                  <Plus size={20} />
                </button>
              }
            />

            <button
              onClick={getUserTaskList}
              className="bg-[#0362fc] text-white p-2 rounded-full hover:bg-blue-700 transition cursor-pointer"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.length !== 0 ? (
          filteredTasks.map((task) => <TaskCard key={task._id} task={task} />)
        ) : (
          <p className="text-gray-400">No Tasks</p>
        )}
      </div>
    </div>
  );
};
