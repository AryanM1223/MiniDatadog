import MetricChart from "../charts/MetricCharts";

const MetricsPanel = ({ metricsByName }) => {
  return (
    <div
      className="
      grid
      grid-cols-1
      lg:grid-cols-2
      gap-4
      p-4
    "
    >
      {Object.entries(metricsByName).map(([name, data]) => (
        <MetricChart key={name} title={name} data={data} />
      ))}
    </div>
  );
};

export default MetricsPanel;
