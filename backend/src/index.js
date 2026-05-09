const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const logsRouter = require('./routes/logs');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  }
})

app.set('io', io);

io.on('connection', (socket) => {
  console.log("client connected:", socket.id)

  socket.on('disconnect', () => {
    console.log("client disconnected:", socket.id)
  })
})


app.use('/logs', logsRouter);

app.get("/", (req, res) => {
  res.send("Mini Datadog Backend Running");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>{
  console.log(`Server running on port ${PORT}`);
})
