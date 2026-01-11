export const TaskCard = ({ task }) => {
  const maxVisible = 3;
  const assignedUsers = task.assignedUsers || [];
  const extraUsers = Math.max(assignedUsers.length - maxVisible, 0);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-600 text-white";
      case "Medium":
        return "bg-yellow-600 text-black";
      case "Low":
        return "bg-green-600 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-gray-600 text-white";
      case "In-Progress":
        return "bg-[#0362fc] text-white";
      case "Completed":
        return "bg-green-600 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const progress = task.progress || 0;
  const progressBarColor =
    progress === 100
      ? "bg-green-600"
      : progress > 50
      ? "bg-yellow-600"
      : "bg-red-600";

  const renderAvatar = (user) => {
    const src = user?.pfp
      ? user.pfp.startsWith("http") || user.pfp.startsWith("data:")
        ? user.pfp
        : `${import.meta.env.VITE_API_URL}${user.pfp}`
      : "/default-pfp.png";
    return (
      <img
        key={user?._id || user?.username}
        src={src}
        alt={user?.username || "User"}
        className="w-8 h-8 rounded-full border-2 border-[#1b0a0f]"
      />
    );
  };

  return (
    <div className="bg-[#1b0a0f] border border-[#2b0e15] rounded-xl p-6 shadow-lg">
      <div className="flex justify-between text-sm mb-3">
        <span
          className={`px-2 py-1 rounded-full ${getStatusColor(task.status)}`}
        >
          {task.status || "Pending"}
        </span>
        <span
          className={`px-2 py-1 rounded-full ${getPriorityColor(
            task.priority
          )}`}
        >
          {task.priority || "Medium"}
        </span>
      </div>

      <h2 className="font-semibold text-lg text-white mb-1">
        {task.title || "No Title"}
      </h2>
      <p className="text-sm text-gray-300 mb-4 line-clamp-2">
        {task.description || "No description"}
      </p>

      <div className="w-full bg-[#2b0e15] rounded-full h-2 mb-4">
        <div
          className={`h-2 rounded-full ${progressBarColor}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex justify-between text-sm mb-4">
        <div>
          <h3 className="text-gray-400 text-xs">Start Date</h3>
          <p className="text-gray-200">{task.createdAt || "-"}</p>
        </div>
        <div>
          <h3 className="text-gray-400 text-xs">Due Date</h3>
          <p className="text-gray-200">{task.dueDate || "-"}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {task.createdBy && renderAvatar(task.createdBy)}
        {assignedUsers.slice(0, maxVisible).map(renderAvatar)}
        {extraUsers > 0 && (
          <div className="w-8 h-8 rounded-full bg-[#2b0e15] text-xs font-semibold flex items-center justify-center border-2 border-[#1b0e0f] text-white">
            +{extraUsers}
          </div>
        )}
      </div>
    </div>
  );
};
