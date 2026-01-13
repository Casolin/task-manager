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

  return (
    <div className="w-full h-[400px] rounded-3xl p-6 shadow-xl bg-slate-900 border border-slate-800">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="80%"
            outerRadius="100%"
            stroke="#1e1e1e"
            strokeWidth={3}
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={["#f59e0b", "#3b82f6", "#22c55e"][index % 3]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              border: "1px solid #1e293b",
              borderRadius: "8px",
            }}
            itemStyle={{ color: "#e5e7eb" }}
            formatter={(value) => [`${value} tasks`, "Tasks"]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{
              color: "#e5e7eb",
              fontWeight: 500,
              fontSize: "13px",
            }}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
