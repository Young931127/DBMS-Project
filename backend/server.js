const express = require("express");
const cors = require("cors");

const taskRoute = require("./Routes/taskRoute");
const userRoute = require("./Routes/userRoute");

const app = express();

//中間件

app.use(cors()); //允許跨域請求
app.use(express.json()); //解析JSON請求體

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


//
//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//
//
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//               佛祖保佑         永無BUG
