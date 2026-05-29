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

/* ── Palette: vibrant but professional ─────────────────────────── */
const SERIES_COLORS = [
  "#58a6ff",  // blue
  "#3fb950",  // green
  "#f85149",  // red
  "#d29922",  // amber
  "#bc8cff",  // purple
  "#39c5cf",  // cyan
  "#ff8c42",  // orange
  "#e88fc7",  // pink
];

/* ── Custom Tooltip ─────────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      style={{
        background: "#161e28",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "8px",
        padding: "10px 14px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        fontFamily: "var(--font-mono)",
        fontSize: "12px",
        minWidth: "160px",
      }}
    >
      <div
        style={{
          color: "rgba(255,255,255,0.40)",
          fontSize: "10.5px",
          marginBottom: "8px",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        ⏱ {label}
      </div>
      {payload.map((entry) => (
        <div
          key={entry.dataKey}
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
            alignItems: "center",
            marginBottom: "4px",
          }}
        >
          <span style={{ color: entry.stroke, display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: entry.stroke,
                display: "inline-block",
                boxShadow: `0 0 6px ${entry.stroke}`,
              }}
            />
            {entry.dataKey}
          </span>
          <span style={{ color: "#e6edf3", fontWeight: 600 }}>
            {typeof entry.value === "number" ? entry.value.toFixed(2) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ── Custom Legend ──────────────────────────────────────────────── */
const CustomLegend = ({ payload }) => {
  if (!payload || !payload.length) return null;
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        justifyContent: "flex-end",
        padding: "4px 8px 0",
        fontFamily: "var(--font-mono)",
        fontSize: "11px",
      }}
    >
      {payload.map((entry) => (
        <span
          key={entry.value}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "rgba(255,255,255,0.55)",
          }}
        >
          <span
            style={{
              width: "20px",
              height: "2px",
              background: entry.color,
              display: "inline-block",
              borderRadius: "1px",
              boxShadow: `0 0 4px ${entry.color}`,
            }}
          />
          {entry.value}
        </span>
      ))}
    </div>
  );
};

/* ── Main Chart Component ───────────────────────────────────────── */
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
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "10px",
        padding: "20px 20px 12px",
        boxShadow: "0 2px 20px rgba(0,0,0,0.35)",
        transition: "box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(88,166,255,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 20px rgba(0,0,0,0.35)";
      }}
    >
      {/* Card header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--text-primary)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            {title.replaceAll("_", " ")}
          </h2>
          <span
            style={{
              fontSize: "11px",
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {serviceNames.length} service{serviceNames.length !== 1 ? "s" : ""} · per-minute avg
          </span>
        </div>
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "var(--accent-green)",
            boxShadow: "var(--glow-green)",
            animation: "pulse 2s ease-in-out infinite",
          }}
        />
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>

          <CartesianGrid
            stroke="rgba(255,255,255,0.04)"
            strokeDasharray="4 4"
            vertical={false}
          />

          <XAxis
            dataKey="time"
            tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10, fontFamily: "var(--font-mono)" }}
            axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10, fontFamily: "var(--font-mono)" }}
            axisLine={false}
            tickLine={false}
            width={44}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 }} />

          <Legend content={<CustomLegend />} />

          {serviceNames.map((service, index) => (
            <Line
              key={service}
              type="monotone"
              dataKey={service}
              dot={false}
              strokeWidth={2}
              stroke={SERIES_COLORS[index % SERIES_COLORS.length]}
              activeDot={{
                r: 4,
                strokeWidth: 0,
                fill: SERIES_COLORS[index % SERIES_COLORS.length],
                style: { filter: `drop-shadow(0 0 6px ${SERIES_COLORS[index % SERIES_COLORS.length]})` },
              }}
            />
          ))}

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricChart;
