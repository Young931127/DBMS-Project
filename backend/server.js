const express = require("express");
const cors = require("cors");

const taskRoute = require("./Routes/taskRoute");
const userRoute = require("./Routes/userRoute");

const app = express();

app.use(cors()); //允許跨域請求
app.use(express.json());

app.use((req, res, next) => {
  console.log("收到請求：", req.method, req.originalUrl);
  next();
});

//掛載Routes
app.use("/api/tasks", taskRoute);
app.use("/api/users", userRoute);

//啟動SERVER
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
