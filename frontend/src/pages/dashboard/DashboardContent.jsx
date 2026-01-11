import { useEffect } from "react";
import useTasks from "../../hooks/useTasks";
import { TaskPieChart } from "../../components/ui/TaskPieChart";
import { TaskBarChart } from "../../components/ui/TaskBarChart";

export const DashboardContent = () => {
  const { taskState, getUserTaskStats } = useTasks();

  useEffect(() => {
    (async () => {
      await getUserTaskStats();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalTasks = taskState?.total || 0;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-white">Activity Insights</h2>
      {totalTasks !== 0 ? (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <TaskPieChart stats={taskState} />
          </div>
          <div className="flex-1">
            <TaskBarChart stats={taskState} />
          </div>
        </div>
      ) : (
        <p className="text-gray-400">
          Your dashboard is waiting! Add some tasks to see your progress.
        </p>
      )}
    </div>
  );
};
