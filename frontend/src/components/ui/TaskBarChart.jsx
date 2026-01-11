import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

export const TaskBarChart = ({ stats }) => {
  if (!stats) return null;

  const data = [
    { name: "Pending", value: stats.pending },
    { name: "In Progress", value: stats.inProgress },
    { name: "Completed", value: stats.completed },
  ];

  const COLORS = ["#f59e0b", "#3b82f6", "#16a34a"];

  return (
    <div
      className="w-full h-[500px] rounded-3xl p-6 shadow-2xl flex items-center justify-center"
      style={{ backgroundColor: "#1b0a0f" }}
    >
      <BarChart
        width={650}
        height={400}
        data={data}
        margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
      >
        <XAxis dataKey="name" stroke="#fff" tick={{ fontSize: 16 }} />
        <YAxis stroke="#fff" tick={{ fontSize: 14 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#2b1219",
            borderRadius: "6px",
            color: "white",
          }}
          itemStyle={{ color: "#fff" }}
          formatter={(value) => [`${value} tasks`, "Tasks"]}
        />
        <Bar dataKey="value" barSize={60} radius={[12, 12, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={`url(#grad${index})`} />
          ))}
        </Bar>
        <defs>
          <linearGradient id="grad0" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
            <stop offset="100%" stopColor="#b45309" stopOpacity={1} />
          </linearGradient>
          <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
            <stop offset="100%" stopColor="#1e40af" stopOpacity={1} />
          </linearGradient>
          <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#16a34a" stopOpacity={1} />
            <stop offset="100%" stopColor="#166534" stopOpacity={1} />
          </linearGradient>
        </defs>
      </BarChart>
    </div>
  );
};
