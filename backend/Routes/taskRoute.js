const express = require("express");
const { getNormalTasks, getTopTasks, submitTask, acceptTask } = require("../Controllers/taskController");

const router = express.Router();

router.get("/normal",getNormalTasks); //定義訪問【一般任務】的路由，將請求發給getNormalTask
router.get("/top",getTopTasks);//定義訪問【置頂任務】的路由，將請求發給getTopTask
router.post("/submit",submitTask);//定義訪問【提交任務】的路由，將請求發給submitTask
router.post("/accept",acceptTask);//定義訪問【接受任務】的路由，將請求發給acceptTask

module.exports = router;//導出路由