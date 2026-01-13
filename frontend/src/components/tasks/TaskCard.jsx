export const TaskCard = ({ task, onClick }) => {
  const maxVisible = 3;
  const assignedUsers = task.assignedUsers || [];

  const assignedUsersExcludingCreator = assignedUsers.filter(
    (user) => user?._id !== task.createdBy?._id
  );

  const extraUsers = Math.max(
    assignedUsersExcludingCreator.length - maxVisible,
    0
  );
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low":
        return "bg-green-500/15 text-green-400 border border-green-500/40";

      case "Medium":
        return "bg-blue-500/15 text-blue-400 border border-blue-500/40";

      case "High":
        return "bg-red-500/15 text-red-400 border border-red-500/40";

      default:
        return "bg-slate-800 text-slate-300 border border-slate-700";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/40";
      case "In-Progress":
        return "bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/40";
      case "Completed":
        return "bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/40";
      default:
        return "bg-slate-800 text-slate-300 border border-slate-700";
    }
  };

  const progress = task.status === "Completed" ? 100 : task.progress ?? 0;

  const progressBarColor =
    progress === 100 ? "bg-[#10c55e]" : "bg-[#22c55e]/70";

  const renderAvatar = (user) => {
    const src = user?.pfp
      ? user.pfp.startsWith("http") || user.pfp.startsWith("data:")
        ? user.pfp
        : `${import.meta.env.VITE_API_URL}${user.pfp}`
      : "/default-pfp.png";

    return (
      <img
        key={user?._id}
        src={src}
        alt={user?.username}
        className="w-8 h-8 rounded-full border-2 border-slate-900"
      />
    );
  };

  return (
    <div
      onClick={onClick}
      className="
        bg-slate-900
        border border-slate-800
        rounded-xl
        p-6
        shadow-lg
        hover:border-[#0362fc]/60
        hover:shadow-[#0362fc]/10
        transition
        cursor-pointer
      "
    >
      <div className="flex justify-between text-xs mb-3">
        <span
          className={`px-3 py-1 rounded-full ${getStatusColor(task.status)}`}
        >
          {task.status || "Pending"}
        </span>
        <span
          className={`px-3 py-1 rounded-full ${getPriorityColor(
            task.priority
          )}`}
        >
          {task.priority || "Medium"}
        </span>
      </div>

      <h2 className="font-semibold text-lg text-white mb-1">
        {task.title || "No Title"}
      </h2>

      <p className="text-sm text-slate-400 mb-4 line-clamp-2">
        {task.description || "No description"}
      </p>

      <div className="w-full bg-slate-800 rounded-full h-2 mb-4">
        <div
          className={`h-2 rounded-full ${progressBarColor}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between text-xs mb-4">
        <div>
          <p className="text-slate-500">Start</p>
          <p className="text-slate-300">{task.createdAt || "-"}</p>
        </div>
        <div>
          <p className="text-slate-500">Due</p>
          <p className="text-slate-300">{task.dueDate || "-"}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {task.createdBy && renderAvatar(task.createdBy)}
        {assignedUsersExcludingCreator.slice(0, maxVisible).map(renderAvatar)}
        {extraUsers > 0 && (
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold flex items-center justify-center text-slate-300">
            +{extraUsers}
          </div>
        )}
      </div>
    </div>
  );
};
