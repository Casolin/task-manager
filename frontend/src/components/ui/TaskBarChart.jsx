import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

export const TaskBarChart = ({ stats }) => {
  if (!stats) return null;

  const data = [
    { name: "Low", value: stats.lowTaskPriority },
    { name: "Medium", value: stats.mediumTaskPriority },
    { name: "High", value: stats.highTaskPriority },
  ];

  return (
    <div className="w-full h-[400px] rounded-3xl p-6 shadow-xl flex items-center justify-center bg-slate-900 border border-slate-800">
      <BarChart
        width={600}
        height={350}
        data={data}
        margin={{ top: 20, right: 30, bottom: 20 }}
      >
        <XAxis dataKey="name" stroke="#cbd5f5" tick={{ fontSize: 16 }} />
        <YAxis stroke="#cbd5f5" tick={{ fontSize: 14 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#020617",
            border: "1px solid #1e293b",
            borderRadius: "8px",
            color: "#fff",
          }}
          itemStyle={{ color: "#e5e7eb" }}
          formatter={(value) => [`${value} tasks`, "Tasks"]}
        />
        <Bar dataKey="value" barSize={90} radius={[12, 12, 0, 0]}>
          {data.map((_, index) => (
            <Cell key={index} fill={`url(#grad${index})`} />
          ))}
        </Bar>
        <defs>
          <linearGradient id="grad0" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
          <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>
      </BarChart>
    </div>
  );
};
