import { useEffect, useRef } from "react";
import LogItem from "./LogItem";

const LogsContainer = ({ logs }) => {
    const topRef = useRef(null);

    useEffect(() =>{
        topRef.current?.scrollIntoView({ behavior: "smooth" });
    },[logs]);
  return (
      <div
      className="
      h-[80vh]
      overflow-y-auto
      space-y-3
      p-4
      bg-black
      "
      >
      <div ref={topRef} />
      {logs.map((log, index) => (
        <LogItem key={index} log={log} />
      ))}
    </div>
  );
};

export default LogsContainer;
