import { useEffect } from "react";
import useTasks from "../../hooks/useTasks";
import { TaskPieChart } from "../../components/ui/TaskPieChart";
import { TaskBarChart } from "../../components/ui/TaskBarChart";
import useAuth from "../../hooks/useAuth";

export const DashboardContent = () => {
  const { taskState, getUserTaskStats } = useTasks();
  const { user } = useAuth();

  const userDashboardInfo = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  useEffect(() => {
    getUserTaskStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalTasks = taskState?.total || 0;
  const completedTasks = taskState?.completed || 0;
  const pendingTasks = taskState?.pending || 0;
  const inProgressTasks = taskState?.inProgress || 0;

  return (
    <div className="p-3 space-y-6">
      <div className="rounded-xl bg-slate-900 p-6 border border-slate-800">
        <h2 className="text-xl font-semibold text-white">
          Good Morning, {user.username}
        </h2>
        <p className="text-sm text-slate-400 mt-1">{userDashboardInfo}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="rounded-lg bg-slate-800 p-4">
            <p className="text-sm text-slate-400">Total Tasks</p>
            <p className="text-2xl font-bold text-white">{totalTasks}</p>
          </div>

          <div className="rounded-lg bg-emerald-500/10 p-4">
            <p className="text-sm text-emerald-400">Completed</p>
            <p className="text-2xl font-bold text-emerald-500">
              {completedTasks}
            </p>
          </div>

          <div className="rounded-lg bg-amber-500/10 p-4">
            <p className="text-sm text-amber-400">Pending</p>
            <p className="text-2xl font-bold text-amber-500">{pendingTasks}</p>
          </div>

          <div className="rounded-lg bg-blue-500/10 p-4">
            <p className="text-sm text-blue-400">In Progress</p>
            <p className="text-2xl font-bold text-blue-500">
              {inProgressTasks}
            </p>
          </div>
        </div>
      </div>

      {totalTasks !== 0 ? (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-4">
            <TaskPieChart stats={taskState} />
          </div>
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-4">
            <TaskBarChart stats={taskState} />
          </div>
        </div>
      ) : (
        <p className="text-slate-400">
          Your dashboard is waiting! Add some tasks to see your progress.
        </p>
      )}
    </div>
  );
};
