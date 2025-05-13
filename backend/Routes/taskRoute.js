const express = require("express");
const { getNormalTasks, getTopTasks } = require("../Controllers/taskController");

const router = express.Router();

router.get("/normal",getNormalTasks); //定義訪問【一般任務】的路由，將請求發給getNormalTask
router.get("/top",getTopTasks);//定義訪問【置頂任務】的路由，將請求發給getTopTask

module.exports = router;//導出路由