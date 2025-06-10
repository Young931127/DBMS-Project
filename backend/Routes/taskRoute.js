const express = require("express");
const {
  getNormalTasks,
  getTopTasks,
  submitTask,
  searchTask,
  acceptTask,
  getTaskDetails,

  getPoint,
  completeTask,
  rateReporter,
  rateAccepter,
  deleteOvertimeTask,
  violation,
} = require("../Controllers/taskController");

const router = express.Router();
router.get("/normal", getNormalTasks); //定義訪問【一般任務】的路由，將請求發給getNormalTask
router.get("/top", getTopTasks); //定義訪問【置頂任務】的路由，將請求發給getTopTask
router.post("/submit", submitTask); 
router.get("/search", searchTask);
router.get("/:taskID", getTaskDetails);
router.post("/accept/:taskID", acceptTask); 
//router.get("/acceptedlist", getAcceptedTasks); 
//router.post("/complete/:taskID", completeTask);
//router.post("/point", getPoint);
//router.post("/rate/reporter/:taskId", rateReporter);
//router.post("/rate/accepter/:taskId", rateAccepter);
//router.delete("/overtime", deleteOvertimeTask);
//router.post("/violations", violation);
module.exports = router; 
