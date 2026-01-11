import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const TaskPieChart = ({ stats }) => {
  if (!stats) return null;

  const data = [
    { name: "Pending", value: stats.pending },
    { name: "In Progress", value: stats.inProgress },
    { name: "Completed", value: stats.completed },
  ];

  const total = stats.total;

  return (
    <div
      className="w-full h-[500px] rounded-3xl p-6 shadow-2xl"
      style={{ backgroundColor: "#1b0a0f" }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={90}
            outerRadius={140}
            stroke="#1b0a0f"
            strokeWidth={3}
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={["#f59e0b", "#3b82f6", "#16a34a"][index % 3]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: "#2b1219", borderRadius: "6px" }}
            itemStyle={{ color: "#fff" }}
            formatter={(value) => [`${value} tasks`, "Tasks"]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ color: "#fff", fontWeight: "bold" }}
            iconType="circle"
            formatter={(value, entry) => {
              const { payload } = entry;
              const percent = ((payload.value / total) * 100).toFixed(0);
              return `${value} (${percent}%)`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
