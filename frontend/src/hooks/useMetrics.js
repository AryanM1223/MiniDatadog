import { useEffect, useState } from "react"
import { api } from "../services/api";
import { socket } from "../services/socket";


export const useMetrics = (raw) =>{

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [metricByName, setMetricByName] = useState({});
    
    const normaliseMetric = (metric) => {
        return {
            timestamp: metric.timestamp || metric._time,
            value: metric.value ?? metric._value,
            name: metric.name,
            service: metric.service,
            unit: metric.unit,
            environment: metric.environment,
            tags: metric.tags || {},
        }
    }
    
    const groupMetricsByName = (metrics) =>{
        const grouped = {};
    
        metrics.forEach((metric) =>{
            const name = metric.name;
            const service = metric.service;

            if(!grouped[name]){
                grouped[name] = {};
            }
    
            if(!grouped[name][service]){
                grouped[name][service] = [];
            }
    
            grouped[name][service].push(metric);
        })
        return grouped;
    }

    useEffect(() =>{
        const fetchMetrics = async () =>{
            try {
                const res = await api.get('/metrics');
                console.log("metric")
                console.log(res.data);

                const normalized = res.data.data.map(normaliseMetric);

                normalized.sort(
                  (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
                );
                
                const grouped = groupMetricsByName(normalized);
                // console.log(grouped)

                setMetricByName(grouped);
            } catch (error) {
                console.error("Error fetching metrics:", error);
                setError("Error fetching metrics:", error.message);
            }finally{
                setLoading(false);
            }
        };

        fetchMetrics();

        socket.on("new-metric", (metric) => {
          const normalized = normaliseMetric(metric);

          setMetricsByName((prev) => {
            const metricName = normalized.name;
            const service = normalized.service;

            const metricGroup = prev[metricName] || [];

            const existing = metricGroup[service] || [];

            const updated = [...existing, normalized];

            updated.sort(
              (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
            );

            return {
              ...prev,

              [metricName]: {
                ...metricGroup,

                [service]: updated.slice(0,100)
              }

            };
          });
        });

        return () =>{
            socket.off("new-metric");
        }
    },[]);

    return { metricByName, loading, error };
}

