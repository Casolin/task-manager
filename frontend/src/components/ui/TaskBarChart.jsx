import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

export const TaskBarChart = ({ stats }) => {
  if (!stats) return null;

  const data = [
    { name: "Low", value: stats.lowTaskPriority },
    { name: "Medium", value: stats.mediumTaskPriority },
    { name: "High", value: stats.highTaskPriority },
  ];

  return (
    <div
      className="w-full h-[400px] rounded-3xl p-6 shadow-2xl flex items-center justify-center"
      style={{ backgroundColor: "#1b0a0f" }}
    >
      <BarChart
        width={600}
        height={350}
        data={data}
        margin={{ top: 20, right: 30, bottom: 20 }}
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
        <Bar dataKey="value" barSize={100} radius={[12, 12, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={`url(#grad${index})`} />
          ))}
        </Bar>
        <defs>
          <linearGradient id="grad0" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22C55E" stopOpacity={1} />
            <stop offset="100%" stopColor="#16A34A" stopOpacity={1} />
          </linearGradient>
          <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity={1} />
            <stop offset="100%" stopColor="#D97706" stopOpacity={1} />
          </linearGradient>
          <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E53E3E" stopOpacity={1} />
            <stop offset="100%" stopColor="#DC2626" stopOpacity={1} />
          </linearGradient>
        </defs>
      </BarChart>
    </div>
  );
};
