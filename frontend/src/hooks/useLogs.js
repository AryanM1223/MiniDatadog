import { useEffect, useState } from "react"
import { api } from "../services/api";
import { socket } from "../services/socket";

export const useLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paused, setPaused] = useState(false);

    const normalizeLogs = (logs) =>{
        return {
            timestamp: logs.timestamp || logs._time,
            message: logs.message || logs._value,
            level: logs.level,
            service: logs.service,
            environment: logs.environment,
        };
    }

    useEffect(() =>{
        const fetchLogs = async ()=>{
            try {
                const res = await api.get('/logs');
                console.log(res.data);

                const normalized = res.data.data.map(normalizeLogs);
                normalized.sort(
                  (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
                );

                setLogs(normalized);

            } catch (error) {
                console.error("Error fetching logs:", error);
                setError("Error fetching logs:", error.message);

            }finally{
                setLoading(false);
            }
        };
        
        fetchLogs();

        socket.on("new-log", (newLog) =>{
            if(paused) return;

            setLogs((prev) => {
              const updated = [normalizeLogs(newLog), ...prev];

              updated.sort(
                (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
              );

              return updated.slice(0, 500);
            });
        });

        return () =>{
            socket.off("new-log");
        }
    },[]);

    return { logs, loading, error, paused, setPaused };

}