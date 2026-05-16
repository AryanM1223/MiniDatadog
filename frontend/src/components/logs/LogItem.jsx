const levelColors = {
  info: "border-blue-500",
  warn: "border-yellow-500",
  error: "border-red-500",
};

const levelStyles = {
  info: "text-blue-400",
  warn: "text-yellow-400",
  error: "text-red-400",
};

const LogItem = ({ log }) => {
  return (
    <div
      className={`
        border-l-4
        ${levelColors[log.level] || "border-zinc-500"}
        bg-zinc-900
        p-3
        rounded
      `}
    >
      <div className="flex justify-between mb-1">
        <span className={levelStyles[log.level]}>{log.level}</span>

        <span className="text-sm text-zinc-400">
          {new Date(log.timestamp).toLocaleString([], {
            dateStyle: "medium",
            timeStyle: "medium",
          })}
        </span>
      </div>

      <div className="text-white">{log.message || log._value}</div>

      <div className="text-sm text-zinc-400 mt-2">{log.service}</div>
    </div>
  );
};

export default LogItem;
