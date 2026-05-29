import MetricsPanel from "../components/charts/MetricsPanel";
import LogsContainer from "../components/logs/LogContainer";
import { useLogs } from "../hooks/useLogs";
import { useMetrics } from "../hooks/useMetrics";

const Dashboard = () => {
  const { logs, loading, error, paused, setPaused } = useLogs();
  const { metricByName } = useMetrics();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg-base)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "16px",
          fontFamily: "var(--font-mono)",
          color: "var(--accent-green)",
        }}
      >
        <div style={{ fontSize: "13px", letterSpacing: "0.08em" }}>
          <span className="loading-blink">▋</span>&nbsp; Connecting to observability pipeline...
        </div>
        <style>{`
          @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
          .loading-blink { animation: blink 1s step-end infinite; }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg-base)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-mono)",
          color: "var(--accent-red)",
        }}
      >
        ✗ {error}
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>

      {/* ── Top Navigation Bar ─────────────────────────────────── */}
      <header
        style={{
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border-subtle)",
          padding: "0 24px",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Left: Logo + title */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Icon */}
          <div
            style={{
              width: "32px",
              height: "32px",
              background: "linear-gradient(135deg, #58a6ff 0%, #bc8cff 100%)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              flexShrink: 0,
            }}
          >
            📊
          </div>
          <div>
            <h1
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "var(--text-primary)",
                letterSpacing: "0.01em",
                lineHeight: 1.2,
              }}
            >
              Mini Datadog
            </h1>
            <span
              style={{
                fontSize: "11px",
                color: "var(--text-muted)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Observability Dashboard
            </span>
          </div>
        </div>

        {/* Right: Live status + pause */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Live / Paused badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "5px 12px",
              borderRadius: "20px",
              background: paused
                ? "rgba(248,81,73,0.10)"
                : "rgba(63,185,80,0.10)",
              border: `1px solid ${paused ? "rgba(248,81,73,0.25)" : "rgba(63,185,80,0.25)"}`,
              fontSize: "12px",
              fontWeight: 500,
              color: paused ? "var(--accent-red)" : "var(--accent-green)",
              letterSpacing: "0.04em",
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: paused ? "var(--accent-red)" : "var(--accent-green)",
                display: "inline-block",
                boxShadow: paused
                  ? "var(--glow-red)"
                  : "var(--glow-green)",
                animation: paused ? "none" : "pulse 2s ease-in-out infinite",
              }}
            />
            {paused ? "PAUSED" : "LIVE"}
          </div>

          {/* Pause / Resume button */}
          <button
            id="pause-resume-btn"
            onClick={() => setPaused((prev) => !prev)}
            style={{
              padding: "7px 16px",
              borderRadius: "6px",
              border: "1px solid var(--border-muted)",
              background: paused
                ? "linear-gradient(135deg, rgba(63,185,80,0.15) 0%, rgba(63,185,80,0.08) 100%)"
                : "linear-gradient(135deg, rgba(248,81,73,0.15) 0%, rgba(248,81,73,0.08) 100%)",
              color: paused ? "var(--accent-green)" : "var(--accent-red)",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              transition: "all 0.2s ease",
              fontFamily: "var(--font-ui)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.8"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            {paused ? "▶ Resume" : "⏸ Pause"}
          </button>

          {/* Log count badge */}
          <div
            style={{
              padding: "5px 12px",
              borderRadius: "6px",
              background: "var(--bg-raised)",
              border: "1px solid var(--border-subtle)",
              fontSize: "12px",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {logs.length.toLocaleString()} logs
          </div>
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(0.85); }
          }
        `}</style>
      </header>

      {/* ── Main content ───────────────────────────────────────── */}
      <main style={{ flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column", gap: "28px" }}>

        {/* ── Logs Section ───────────────────────────────────── */}
        <section>
          <SectionHeader
            icon="⬡"
            title="Live Log Stream"
            subtitle={`${logs.length} entries · sorted newest first`}
            accentColor="var(--accent-cyan)"
          />
          <LogsContainer logs={logs} />
        </section>

        {/* ── Metrics Section ────────────────────────────────── */}
        <section>
          <SectionHeader
            icon="◈"
            title="Metrics"
            subtitle="Time-series aggregated by service"
            accentColor="var(--accent-purple)"
          />
          <MetricsPanel metricsByName={metricByName} />
        </section>

      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid var(--border-subtle)",
          padding: "10px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "11px",
          color: "var(--text-muted)",
          background: "var(--bg-surface)",
          letterSpacing: "0.04em",
        }}
      >
        <span>MINI DATADOG · OBSERVABILITY PLATFORM</span>
        <span style={{ fontFamily: "var(--font-mono)" }}>
          {new Date().toLocaleDateString("en-US", { dateStyle: "medium" })}
        </span>
      </footer>
    </div>
  );
};

/* ── Section header sub-component ─────────────────────────────── */
const SectionHeader = ({ icon, title, subtitle, accentColor }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "12px",
      paddingBottom: "12px",
      borderBottom: "1px solid var(--border-subtle)",
    }}
  >
    <span style={{ fontSize: "18px", color: accentColor, lineHeight: 1 }}>{icon}</span>
    <div>
      <div
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "var(--text-primary)",
          letterSpacing: "0.02em",
          textTransform: "uppercase",
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "1px" }}>
        {subtitle}
      </div>
    </div>
  </div>
);

export default Dashboard;
