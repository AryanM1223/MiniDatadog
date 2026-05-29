/* ── Log level color palette (terminal-accurate) ── */
const LEVEL_CONFIG = {
  info:  { fg: "#58a6ff", bg: "rgba(88,166,255,0.10)",  badge: "#1a3a5c", label: "INFO " },
  warn:  { fg: "#d29922", bg: "rgba(210,153,34,0.10)",  badge: "#3d2f00", label: "WARN " },
  error: { fg: "#f85149", bg: "rgba(248,81,73,0.10)",   badge: "#3d1a19", label: "ERROR" },
  debug: { fg: "#3fb950", bg: "rgba(63,185,80,0.08)",   badge: "#0d3320", label: "DEBUG" },
};

const DEFAULT_CONFIG = { fg: "#8b949e", bg: "rgba(139,148,158,0.06)", badge: "#1c2028", label: "TRACE" };

/* Format timestamp as compact terminal style: HH:MM:SS.mmm */
const formatTimestamp = (ts) => {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  const ms = String(d.getMilliseconds()).padStart(3, "0");
  return `${hh}:${mm}:${ss}.${ms}`;
};

const formatDate = (ts) => {
  const d = new Date(ts);
  return d.toLocaleDateString("en-CA"); // YYYY-MM-DD
};

const LogItem = ({ log, index }) => {
  const level = (log.level || "info").toLowerCase();
  const cfg = LEVEL_CONFIG[level] || DEFAULT_CONFIG;

  const isEven = index % 2 === 0;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        padding: "3px 16px",
        background: isEven ? "transparent" : "rgba(255,255,255,0.018)",
        transition: "background 0.1s ease",
        gap: "0",
        borderLeft: `2px solid ${cfg.fg}22`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = `${cfg.bg}`;
        e.currentTarget.style.borderLeftColor = cfg.fg;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = isEven ? "transparent" : "rgba(255,255,255,0.018)";
        e.currentTarget.style.borderLeftColor = `${cfg.fg}22`;
      }}
    >
      {/* Line number */}
      <span
        style={{
          minWidth: "40px",
          color: "rgba(255,255,255,0.14)",
          fontSize: "11px",
          userSelect: "none",
          paddingRight: "12px",
          marginTop: "1px",
          textAlign: "right",
        }}
      >
        {index + 1}
      </span>

      {/* Timestamp */}
      <span
        style={{
          color: "rgba(255,255,255,0.28)",
          minWidth: "90px",
          fontSize: "11.5px",
          paddingRight: "12px",
          marginTop: "1px",
          flexShrink: 0,
        }}
      >
        {formatTimestamp(log.timestamp)}
      </span>

      {/* Date (dimmer) */}
      <span
        style={{
          color: "rgba(255,255,255,0.15)",
          minWidth: "88px",
          fontSize: "11px",
          paddingRight: "14px",
          marginTop: "2px",
          flexShrink: 0,
        }}
      >
        {formatDate(log.timestamp)}
      </span>

      {/* Level badge */}
      <span
        style={{
          minWidth: "50px",
          fontSize: "10.5px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          color: cfg.fg,
          background: cfg.badge,
          border: `1px solid ${cfg.fg}40`,
          borderRadius: "3px",
          padding: "0px 5px",
          marginRight: "14px",
          marginTop: "2px",
          alignSelf: "flex-start",
          flexShrink: 0,
          textAlign: "center",
        }}
      >
        {cfg.label}
      </span>

      {/* Service tag */}
      {log.service && (
        <span
          style={{
            color: "rgba(188,140,255,0.75)",
            fontSize: "11.5px",
            minWidth: "100px",
            paddingRight: "14px",
            marginTop: "1px",
            flexShrink: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          [{log.service}]
        </span>
      )}

      {/* Message */}
      <span
        style={{
          color: cfg.fg === "#f85149"
            ? "#ffb3ae"
            : cfg.fg === "#d29922"
            ? "#f0c060"
            : "#c9d1d9",
          fontSize: "12.5px",
          wordBreak: "break-word",
          flex: 1,
        }}
      >
        {log.message || log._value}
      </span>
    </div>
  );
};

export default LogItem;
