import MetricChart from "../charts/MetricCharts";

const MetricsPanel = ({ metricsByName }) => {
  const entries = Object.entries(metricsByName);

  if (entries.length === 0) {
    return (
      <div
        style={{
          padding: "48px 24px",
          textAlign: "center",
          color: "var(--text-muted)",
          fontFamily: "var(--font-mono)",
          fontSize: "13px",
          background: "var(--bg-card)",
          borderRadius: "10px",
          border: "1px solid var(--border-subtle)",
        }}
      >
        ◌ No metric data received yet...
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(480px, 1fr))",
        gap: "16px",
      }}
    >
      {entries.map(([metricName, services]) => (
        <MetricChart
          key={metricName}
          title={metricName}
          services={services}
        />
      ))}
    </div>
  );
};

export default MetricsPanel;
