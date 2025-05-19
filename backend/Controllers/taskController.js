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
            WHERE isTop = 'false'` 
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
            WHERE isTop = 'true'`
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

        const {userID} = req.user.sub; // 從請求中獲取 userID
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
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        const {taskID, accepterID} = req.body;

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

        
    // ★ ① 先查出這筆任務的 is_top（BOOLEAN）和接案者 accepterID
      const [[taskRow]] = await mysql.query(
        `SELECT is_top, accepterID 
           FROM tasks 
          WHERE taskID = ?`,
        [taskID]
      );
      if (!taskRow) {
        return res.status(404).json({
          success: false,
          message: '找不到該任務',
        });
      }
      const isTop      = taskRow.is_top;
      const accepterID = taskRow.accepterID;
       // ★ ② 根據 isTop 決定本次要加的分數
      const bonus = isTop ? 10 : 5;
      // ③ 更新任務狀態為已完成
      await mysql.query(
        `UPDATE tasks 
            SET status = 'completed' 
          WHERE taskID = ?`,
        [taskID]
      );
        res.status(200).json({
            success: true,
            message: 'Task completed successfully',
        });
        // ★ ④ 更新使用者的 point（加上 bonus）
        await mysql.query(
            `UPDATE Users 
                SET point = point + ? 
              WHERE user_id = ?`,
            [bonus, accepterID]
          );
    // ★ ⑤ 記錄這次分數變動在 point_transactions 表格
    const [txResult] = await mysql.query(
        `INSERT INTO point_transactions 
           (user_id, change_amount, reason)
         VALUES (?, ?, ?)`,
        [
          accepterID,
          bonus,
          isTop 
            ? 'mission complete (top)' 
            : 'mission complete (normal)'
        ]
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
            WHERE taskName LIKE ? OR taskDescription LIKE ?`,
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
exports.Getpoint = async (req, res) => {
    let mysql
    try {
        mysql = await mysqlConnectionPool.getConnection();
        const userId = req.body.userId;
        const [rows] = await mysql.query(
            `SELECT point FROM Users WHERE user_id = ?`,
            [userId]
          );
          const currentPoints = rows[0]?.point || 20;

            
    }catch (error) {
        console.error('Error fetching user point:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user point',
        });
    }
}