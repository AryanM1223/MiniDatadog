const express = require('express');
const cors = require('cors');

const logsRouter = require('./routes/logs');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/logs', logsRouter);

app.get("/", (req, res) => {
  res.send("Mini Datadog Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
})
