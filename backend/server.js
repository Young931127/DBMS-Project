const express = require('express');
const cors = require('cors');
const taskRoute = require("./Routes/taskRoute");

const app = express();
const db = require('./dbConnection');
const mysqlConnectionPool = require('./dbConnection.js');

//中間件
app.use(cors()); //允許跨域請求
app.use(express.json());//解析JSON請求體

//掛載Routes
app.use("/api/tasks", taskRoute);
//啟動SERVER
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});