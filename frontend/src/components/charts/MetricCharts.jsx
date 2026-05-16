import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const MetricChart = ({ title, data }) => {
  const formattedData = data.map((item) => ({
    time: new Date(item.timestamp).toLocaleTimeString(),

    value: item.value,
  }));

  return (
    <div
      className="
      bg-zinc-900
      p-4
      rounded-xl
    "
    >
      <h2
        className="
        text-white
        text-lg
        mb-4
      "
      >
        {title}
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid stroke="#333" />

          <XAxis dataKey="time" />

          <YAxis />

          <Tooltip />

          <Line type="monotone" dataKey="value" stroke="#3b82f6" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricChart;
