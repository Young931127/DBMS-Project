const express = require("express");
const { getNormalTasks, 
        getTopTasks,
        submitTask, 
        searchTask,
        acceptTask,
        getTaskDetails ,
        getPoint,
        completeTask,
        rateReporter,
        rateAccepter,
        deleteOvertimeTask,
        violation      
    } = require("../Controllers/taskController");

const router = express.Router();
router.get("/normal",getNormalTasks); //定義訪問【一般任務】的路由，將請求發給getNormalTask
router.get("/top",getTopTasks);//定義訪問【置頂任務】的路由，將請求發給getTopTask
router.get("/submit",submitTask);//定義訪問【提交任務】的路由，將請求發給submitTask
router.get("/search",searchTask);
/*router.post("/accept",acceptTask);//定義訪問【接受任務】的路由，將請求發給acceptTask
router.get("/details/:taskID",getTaskDetails);//定義訪問【任務詳情】的路由，將請求發給getTaskDetails
router.post("/complete", completeTask);//定義訪問【完成任務】的路由，將請求發給completeTask
router.post("/point", getPoint);//定義訪問【獲取積分】的路由，將請求發給getPoint
router.post("/rate/reporter/:taskId", rateReporter);//定義訪問【評價】的路由，將請求發給rateReporter
router.post("/rate/accepter/:taskId", rateAccepter);//定義訪問【評價】的路由，將請求發給rateAccepter
router.delete("/overtime", deleteOvertimeTask);//定義訪問【超時任務】的路由，將請求發給deleteOvertimeTask
router.post("/violations", violation);//定義訪問【違規】的路由，將請求發給violation*/

module.exports = router;//導出路由