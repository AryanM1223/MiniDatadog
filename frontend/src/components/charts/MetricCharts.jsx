import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const MetricChart = ({ title, services }) => {
  const buildChartData = (services) => {
    const bucketMap = {};

    Object.entries(services).forEach(([serviceName, metrics]) => {
      metrics.forEach((metric) => {
        const date = new Date(metric.timestamp);
        console.log(metric);
        console.log(metric.timestamp);
        const bucket = `${date.getHours()}:${String(date.getMinutes()).padStart(
          2,
          "0",
        )}`;

        if (!bucketMap[bucket]) {
          bucketMap[bucket] = {
            time: bucket,
          };
        }

        if (!bucketMap[bucket][serviceName]) {
          bucketMap[bucket][serviceName] = {
            sum: 0,
            count: 0,
          };
        }

        bucketMap[bucket][serviceName].sum += metric.value;
        bucketMap[bucket][serviceName].count += 1;
      });
    });

    const result = Object.values(bucketMap);

    result.forEach((row) => {
      Object.keys(row).forEach((key) => {
        if (key !== "time" && typeof row[key] === "object") {
          row[key] = row[key].sum / row[key].count;
        }
      });
    });

    return result;
  };

  const chartData = buildChartData(services);

  const serviceNames = Object.keys(services);

  return (
    <div className="bg-zinc-900 p-4 rounded-xl">
      <h2 className="text-white text-lg mb-4 capitalize">
        {title.replaceAll("_", " ")}
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData}>
          <CartesianGrid stroke="#333" />

          <XAxis
            dataKey="time"
            // tickFormatter={(value) => new Date(value).toLocaleTimeString()}
          />

          <YAxis />

          <Tooltip
            labelFormatter={(value) => value}
          />

          <Legend />

          {serviceNames.map((service, index) => (
            <Line
              key={service}
              type="monotone"
              dataKey={service}
              dot={false}
              stroke={
                [
                  "#3b82f6",
                  "#22c55e",
                  "#ef4444",
                  "#eab308",
                  "#a855f7",
                  "#06b6d4",
                ][index % 6]
              }
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricChart;
