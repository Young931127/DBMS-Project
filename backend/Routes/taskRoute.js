const express = require("express");
const {
    getNormalTasks,
    getTopTasks,
    submitTask,
    acceptTask,
    getTaskDetails,
    getPoint,
    completeTask,
    rateReporter,
    rateAccepter,
    deleteOvertimeTask,
    violation,
    searchTask
} = require("../Controllers/taskController");

const { authenticateToken } = require("../Middleware/auth"); // 使用 auth.js 驗證中介
const router = express.Router();

// 任務查詢
router.get("/normal", getNormalTasks);
router.get("/top", getTopTasks);
router.get("/details/:taskID", getTaskDetails);
router.get("/search", searchTask);

// 任務操作（需登入）
router.post("/submit", authenticateToken, submitTask);
router.post("/accept/:taskID", authenticateToken, acceptTask);
router.post("/complete", authenticateToken, completeTask);

// 評價功能
router.post("/rate/reporter/:taskId", authenticateToken, rateReporter);
router.post("/rate/accepter/:taskId", authenticateToken, rateAccepter);

// 其他功能
router.post("/point", authenticateToken, getPoint);
router.delete("/overtime", authenticateToken, deleteOvertimeTask);
router.post("/violations", authenticateToken, violation);

module.exports = router;