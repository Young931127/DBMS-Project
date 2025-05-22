const mysqlConnectionPool = require('../dbConnection');
/**
 * @param {express.Request} req
 * @param {express.Response} res
 */

exports.getNormalTasks = async (req, res) => {
    let mysql;
    try {
        mysql = await mysqlConnectionPool.getConnection();
        const [normalTask] = await mysql.query(
            `SELECT * 
            FROM tasks
            WHERE isTop = false` 
        );
        res.status(200).json({
            success: true,
            data: normalTask,
        });
    } catch (error) {
        console.error('Error fetching normal tasks:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch normal tasks',
        });
    } finally {
        if (mysql) mysql.release(); // 確保釋放連線
    }
};


/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.getTopTasks = async (req, res) => {
    let mysql;
    try {
        mysql = await mysqlConnectionPool.getConnection();
        const [topTask] = await mysql.query(
            `SELECT * 
            FROM tasks
            WHERE isTop = true`
        );
        res.status(200).json({
            success: true,
            data: topTask,
        });
    } catch (error) {
        console.error('Error fetching top tasks:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch top tasks',
        });
    } finally {
        if (mysql) mysql.release(); // 確保釋放連線
    }
};

exports.submitTask = async (req, res) => {
    let mysql;
    try {
        mysql = await mysqlConnectionPool.getConnection();

        const userID = req.user.sub; // 從請求中獲取 userID
        const {taskName, taskDescription, deadline, reward, isTop} = req.body;
        const createdAt = new Date();
        const status = 'pending';
        // 檢查必填欄位
        if (!taskName || !taskDescription) {
            return res.status(400).json({
                success: false,
                message: 'Task name and description are required',
            });
        }
        const [pointRows] = await mysql.query(
            `SELECT point FROM Users WHERE user_id = ?`,
            [userID]
        );
        const currentPoints = pointRows[0]?.point ?? 20;
        const deduction = isTop ? 10 : 5;
        if(currentPoints < deduction) {
             return res.status(400).json({
                success: false,
                message: 'Insufficient points to submit task',})
        }
        // 插入任務
        const [result] = await mysql.query(
            `INSERT INTO tasks (userID, taskName, status, created_at, description, deadline, reward, isTop) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [ userID, taskName, status, createdAt, taskDescription, deadline, reward, isTop]
        );
        const newPoints = currentPoints - deduction;
        await mysql.query(
            `UPDATE Users SET point = ? WHERE user_id = ?`,
             [newPoints, userID]
        );
        const [txResult] = await mysql.query(
            `INSERT INTO point_transactions
               (user_id, change_amount, reason)
             VALUES (?, ?, ?)`,
            [
              userID,
              -deduction,
              isTop
                ? 'publish TOP task deduction'
                : 'publish normal task deduction'
            ]
          );
          const transactionId = txResult.insertId;
        res.status(201).json({
            success: true,
            data: {
                id: result.insertId,
                taskName,
                taskDescription,
                isTop,
            },
        });

    } catch (error) {
        console.error('Error submitting task:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit task',
        });
    } finally {
        if (mysql) mysql.release(); // 確保釋放連線
    }
}

exports.acceptTask = async (req, res) => {
    let mysql;
    try {
        mysql = await mysqlConnectionPool.getConnection();
        const {taskID} = req.body;
        const {accepterID} = req.user.sub;
        // 更新任務狀態為已接受
        const [result] = await mysql.query(
            `UPDATE tasks 
            SET status = 'accepted', accepterID = ?
            WHERE taskID = ?`,
            [accepterID, taskID]
        );
        res.status(200).json({
            success: true,
            message: 'Task accepted successfully',
        });
    } catch (error) {
        console.error('Error accepting task:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to accept task',
        });
    } finally {
        if (mysql) mysql.release(); // 確保釋放連線
    }
}

exports.completeTask = async (req, res) => {
    let mysql;
    try {
        mysql = await mysqlConnectionPool.getConnection();
        const {taskID} = req.body;

        
    // 先查出這筆任務的 isTop 和接案者 accepterID
      const [[taskRow]] = await mysql.query(
        `SELECT isTop, accepterID, reward 
           FROM tasks 
          WHERE taskID = ?`,
        [taskID]
      );
      if (!taskRow) {
        return res.status(404).json({
          success: false,
          message: 'Task not found',
        });
      }
    const isTop      = taskRow.isTop;
    const accepterID = taskRow.accepterID;
    const reward     = taskRow.reward;
    const bonus = isTop ? 10 : 5;
        //更新任務狀態為已完成
      
        res.status(200).json({
            success: true,
            message: 'Task completed successfully',
        });
        //更新使用者的 point（加上 bonus）
        await mysql.query(
            `UPDATE Users 
                SET point = point + ? 
              WHERE user_id = ?`,
            [bonus + reward, accepterID]
          );
    //記錄這次分數變動在 point_transactions 表格
    const [txResult] = await mysql.query(
        `INSERT INTO point_transactions 
           (user_id, change_amount, reason)
         VALUES (?, ?, ?)`,
        [
          accepterID,
          bonus + reward,
          isTop 
            ? 'mission complete (top)' 
            : 'mission complete (normal)'
        ]
      );
      await mysql.query(
        `UPDATE tasks 
            SET status = 'completed' 
          WHERE taskID = ?`,
        [taskID]
      );
    } catch (error) {
        console.error('Error completing task:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to complete task',
        });
    } finally {
        if (mysql) mysql.release(); // 確保釋放連線
    }
}

exports.searchTask = async (req, res) => {
    let mysql;
    try {
        mysql = await mysqlConnectionPool.getConnection();
        const {query} = req.query;
        const [tasks] = await mysql.query(
            `SELECT * 
            FROM tasks
            WHERE taskName LIKE ? OR taskDescription LIKE ?
            AND status = 'pending'`,
            [`%${query}%`, `%${query}%`]
        );
        res.status(200).json({
            success: true,
            data: tasks,
        });
    } catch (error) {
        console.error('Error searching tasks:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search tasks',
        });
    } finally {
        if (mysql) mysql.release(); // 確保釋放連線
    }
}
exports.getPoint = async (req, res) => {
    let conn;
    try {
        conn = await mysqlConnectionPool.getConnection();
        const { userId } = req.body;
        // 檢查是否有傳入 userId
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'Missing userId in request body',
            });
        }
        // 查詢 Users 表中的點數
        const [rows] = await conn.query(
            'SELECT point FROM Users WHERE user_id = ?',
            [userId]
        );
        // 若查無此使用者，預設回傳 20 點
        const currentPoints = rows.length > 0 ? rows[0].point : 20;
        // 回傳結果
        return res.status(200).json({
            success: true,
            data: {
                userId,
                point: currentPoints,
            },
        });
    } catch (error) {
        console.error('Error fetching user point:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch user point',
        });
    } finally {
        if (conn) conn.release();
    }
};

exports.rateSubmitter = async (req, res) => {
    const taskId = +req.params.taskId;
    const { score, comment = '' } = req.body;
    // req.user.id 經 JWT middleware 自動掛載，這裡是「接收者」(accepter) 的 user_id
    const accepterId    = req.user.sub;
  
    let conn;
    try {
      conn = await mysqlPool.getConnection();
      await conn.beginTransaction();
  
      // 1. 確認任務存在並撈出 reporter_id
      const [[{ reporter_id }]] = await conn.query(
        `SELECT reporter_id
           FROM tasks
          WHERE id = ?`,
        [ taskId ]
      );
      if (!reporter_id) {
        await conn.rollback();
        return res.status(404).json({ success: false, message: '任務不存在' });
      }
  
      // 2. 寫入 reporter_ratings
      //    - rate_id AUTO_INCREMENT
      //    - reporter_id 從上面自動撈出
      //    - score, comment 從 req.body
      //    - rating_time 欄位定義預設 CURRENT_TIMESTAMP
      await conn.query(
        `INSERT INTO reporter_ratings
           (reporter_id, score, comment)
         VALUES (?, ?, ?)`,
        [ reporter_id, score, comment ]
      );
  
      // 3. 重新計算該 reporter 的平均分
      const [[{ avgScore }]] = await conn.query(
        `SELECT AVG(score) AS avgScore
           FROM reporter_ratings
          WHERE reporter_id = ?`,
        [ reporter_id ]
      );
  
      // 4. 把新的 avgScore 更新回 users.rate
      await conn.query(
        `UPDATE users
            SET rate = ?
          WHERE user_id = ?`,
        [ avgScore, reporter_id ]
      );
  
      await conn.commit();
      return res.json({ success: true, avgScore });
    } catch (err) {
      if (conn) await conn.rollback();
      console.error('rateReporter 錯誤：', err);
      return res.status(500).json({ success: false, message: '評分失敗' });
    } finally {
      if (conn) conn.release();
    }
  };
 
  exports.rateAccepter = async (req, res) => {
    const taskId     = +req.params.taskId;
    const { score, comment = '' } = req.body;
    const reporterId = req.user.id;      // 現在「誰在評分」──發佈者
  
    let conn;
    try {
      conn = await mysqlPool.getConnection();
      await conn.beginTransaction();
  
      // 1. 確認任務存在，並撈出真正執行者 (accepter) 的 user_id
      const [[{ accepter_id }]] = await conn.query(
        `SELECT accepter_id
           FROM tasks
          WHERE id = ?`,
        [ taskId ]
      );
      if (!accepter_id) {
        await conn.rollback();
        return res.status(404).json({ success: false, message: '任務不存在或尚未被接取' });
      }
  
      // 2. 寫入 accepter_ratings
      //    - rate_id 自增，不需手動傳
      //    - accepter_id 自動從 tasks 拿
      //    - score, comment 由前端傳入
      //    - rating_time 採欄位預設 CURRENT_TIMESTAMP
      await conn.query(
        `INSERT INTO accepter_ratings
           (accepter_id, score, comment)
         VALUES (?, ?, ?)`,
        [ accepter_id, score, comment ]
      );
  
      // 3. 重新計算這位執行者的平均分
      const [[{ avgScore }]] = await conn.query(
        `SELECT AVG(score) AS avgScore
           FROM accepter_ratings
          WHERE accepter_id = ?`,
        [ accepter_id ]
      );
  
      // 4. 更新 users 表裡的 rate 欄位
      await conn.query(
        `UPDATE users
            SET rate = ?
          WHERE user_id = ?`,
        [ avgScore, accepter_id ]
      );
  
      await conn.commit();
      return res.json({ success: true, avgScore });
    } catch (err) {
      if (conn) await conn.rollback();
      console.error('rateAccepter 錯誤：', err);
      return res.status(500).json({ success: false, message: '評分失敗' });
    } finally {
      if (conn) conn.release();
    }
  };


exports.deleteOvertimeTask = async (req, res) => {
    let mysql;
    mysql = await mysqlConnectionPool.getConnection();
    const currentDate = new Date();
    try{
        const [result] = await mysql.query(
            `DELETE FROM tasks 
            WHERE task_id = 
                SELECT task_id
                FROM tasks
                WHERE DATEDIFF(day, ?, deadline) < -2
                AND status = 'pending'`,
            [currentDate]
        );
        res.status(200).json({
            success: true,
            message: 'Overtime tasks deleted successfully',
        });
    }
    catch{
        res.status(500).json({
            success: false,
            message: 'Overtime tasks are not deleted successfully',
        });
    }finally {
        if (mysql) mysql.release(); // 確保釋放連線
    }
}

exports.getTaskDetails = async (req, res) => {
    let mysql;
    try {
        mysql = await mysqlConnectionPool.getConnection();
        const {taskID} = req.params;
        const [taskDetails] = await mysql.query(
            `SELECT * 
            FROM tasks
            WHERE taskID = ?`,
            [taskID]
        );
        res.status(200).json({
            success: true,
            data: taskDetails,
        });
    } catch (error) {
        console.error('Error fetching task details:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch task details',
        });
    } finally {
        if (mysql) mysql.release(); // 確保釋放連線
    }
}
// POST /violations
exports.violation = async (req, res) => {
    let mysql;
    try {
      // 1. 拿連線
      mysql = await mysqlConnectionPool.getConnection();
  
      // 2. 取出當前 user_id 和請求參數
      const currentUserId = req.user.id;
      const { reason = '' } = req.body;
  
      // 3. 查這個 user 之前有幾次違規
      const [[{ total }]] = await mysql.query(
        'SELECT COUNT(*) AS total FROM violation WHERE user_id = ?',
        [currentUserId]
      );
      const nextCount = total + 1;
  
      // 4. 插入新的一筆違規紀錄（violation_id 自增、create_time 由 CURRENT_TIMESTAMP 填入）
      await mysql.query(
        `INSERT INTO violation (user_id, count, reason)
         VALUES (?, ?, ?)`,
        [currentUserId, nextCount, reason]
      );
  
      // 5. 回傳成功
      res.status(200).json({
        success: true,
        message: 'Violation recorded',
        data: { user_id: currentUserId, count: nextCount, reason }
      });
  
    } catch (error) {
      console.error('Error recording violation:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to record violation'
      });
    } finally {
      // 6. 釋放連線
      if (mysql) mysql.release();
    }
  };
  