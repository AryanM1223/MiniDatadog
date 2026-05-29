import { useEffect, useRef } from "react";
import LogItem from "./LogItem";

const LogsContainer = ({ logs }) => {
  const topRef = useRef(null);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div
      style={{
        background: "#020406",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 4px 32px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.03)",
      }}
    >
      {/* Terminal title bar */}
      <div
        style={{
          background: "#0a0c0f",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "8px 14px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {/* Traffic-light dots */}
        <span
          style={{
            width: "10px", height: "10px",
            borderRadius: "50%",
            background: "#ff5f57",
            display: "inline-block",
          }}
        />
        <span
          style={{
            width: "10px", height: "10px",
            borderRadius: "50%",
            background: "#febc2e",
            display: "inline-block",
          }}
        />
        <span
          style={{
            width: "10px", height: "10px",
            borderRadius: "50%",
            background: "#28c840",
            display: "inline-block",
          }}
        />
        <span
          style={{
            marginLeft: "12px",
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "rgba(255,255,255,0.30)",
            letterSpacing: "0.06em",
          }}
        >
          log-stream · tail -f
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            color: "rgba(255,255,255,0.20)",
          }}
        >
          {logs.length} lines
        </span>
      </div>

      {/* Log entries */}
      <div
        className="terminal-scroll"
        style={{
          height: "70vh",
          overflowY: "auto",
          padding: "6px 0",
          background: "#020406",
          fontFamily: "var(--font-mono)",
          fontSize: "12.5px",
          lineHeight: "1.7",
          position: "relative",
        }}
      >
        <div ref={topRef} />
        {logs.length === 0 ? (
          <div
            style={{
              padding: "48px 20px",
              textAlign: "center",
              color: "rgba(255,255,255,0.15)",
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
            }}
          >
            ▋ Waiting for log entries...
          </div>
        ) : (
          logs.map((log, index) => <LogItem key={index} log={log} index={index} />)
        )}
      </div>
    </div>
  );
};

export default LogsContainer;
