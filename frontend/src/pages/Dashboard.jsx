import MetricsPanel from "../components/charts/MetricsPanel";
import LogsContainer from "../components/logs/LogContainer";
import { useLogs } from "../hooks/useLogs";
import { useMetrics } from "../hooks/useMetrics";

const Dashboard = () => {
  const { logs, loading, error, paused, setPaused } = useLogs();
  const { metricByName } = useMetrics();

  if (loading) {
    return <div className="text-white p-10">Loading logs...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-10">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="p-4 border-b border-zinc-800">
        <h1 className="text-2xl font-bold">Mini Datadog</h1>
      </div>
      <button
        onClick={() => setPaused((prev) => !prev)}
        className="bg-zinc-800 px-4 py-2 rounded"
      >
        {paused ? "Resume" : "Pause"}
      </button>

      <LogsContainer logs={logs} />

      <MetricsPanel metricsByName={metricByName} />
    </div>
  );
};

export default Dashboard;
