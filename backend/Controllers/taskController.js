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
            WHERE isTop = 0` 
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
            WHERE isTop = 1`
        );
        //console.log('topTask:', topTask); 
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

        // 插入任務
        const [result] = await mysql.query(
            `INSERT INTO tasks (userID, taskName, status, created_at, description, deadline, reward, isTop) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [ userID, taskName, status, createdAt, taskDescription, deadline, reward, isTop]
        );

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

        // 更新任務狀態為已完成，並增加用戶點數
        const [result] = await mysql.query(
            `UPDATE tasks 
            SET status = 'completed'
            WHERE taskID = ?`,
            [taskID]
            `UPDATE User
            SET point = point + reward
            WHERE userID = (SELECT accepterID FROM tasks WHERE taskID = ?)`,
            [taskID]
        );
        res.status(200).json({
            success: true,
            message: 'Task completed successfully',
        });
        
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