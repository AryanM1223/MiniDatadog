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
      {Object.entries(metricsByName).map(
        ([metricName, services]) => (
          <MetricChart
            key={metricName}
            title={metricName}
            services={services}
          />
        )
      )}
    </div>
  );
};

export default MetricsPanel;
