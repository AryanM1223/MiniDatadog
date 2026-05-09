import { useState, useEffect } from 'react'
import { socket } from './socket/socket'


function App() {
  const [logs, setLogs] = useState([])

  useEffect(() =>{
    socket.on("new-log", (log) =>{
      console.log(socket)
      setLogs((prevLogs) => [log, ...prevLogs])
    });

    return () =>{
      socket.off("new-log");
    };

  }, [])


  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Mini Datadog</h1>

      <div className="space-y-2">
        {logs.map((log, index) => (
          <div key={index} className="border border-zinc-700 p-3 rounded">
            <div>{log.level}</div>
            <div>{log.message}</div>
            <div>{log.service}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App
