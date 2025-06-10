const mysqlConnectionPool = require("../dbConnection");

const jwt = require("jsonwebtoken");

async function signup(req, res) {
  const { username, user_id, password, phoneNum } = req.body;
  const mysql = await mysqlConnectionPool.getConnection();
  try {
    const [rows] = await mysql.query(
      `
            SELECT COUNT(user_id) AS count
            FROM users
            WHERE user_id=?
            `,
      [user_id]
    );
    if (rows[0].count > 0) {
      return res.status(400).json({ error: "用戶已註冊" });
    }
    if (!/^\d{10}$/.test(phoneNum)) {
      return res.status(400).json({
        error: "Phone number must be exactly 10 digits and only numbers.",
      });
    } else {
      await mysql.query(
        `
    INSERT INTO users ( username, user_id, password, phoneNum, point, status)
    VALUES (?, ?, ?, ?, ?, ?)`,
        [username, user_id, password, phoneNum, 20, "unbanned"]
      );
      res.status(201).json({ status: "created" });
    }
  } catch (err) {
    console.error("註冊錯誤：", err);
    // return error
    return res.status(400).json({
      error: err.message || "error!",
    });
  }
}

async function login(req, res) {
  const { user_id, password } = req.body;
  const mysql = await mysqlConnectionPool.getConnection();
  try {
    const result = await mysql.query(
      `
        SELECT user_id, username, password       
        FROM users
        WHERE user_id=? AND password=?
        `,
      [user_id, password]
    );

    const user = result[0][0];
    if (!user) {
      // 查無此帳號密碼
      return res
        .status(403)
        .json({ code: "VALIDATION_ERROR", message: "帳號或密碼錯誤" });
    }
    const token = jwt.sign(
      { sub: user.user_id, name: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .json({ token, user: { id: user.user_id, name: user.username } });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
}

async function getUserPoints(req, res) {
  const { userID } = req.user.sub;
  const mysql = await mysqlConnectionPool.getConnection();
  try {
    const [points] = mysql.query(
      `
            SELECT point
            FROM users
            WHERE user_id=?
            `,
      [userID]
    );
    res.status(200).json({ points: points });
  } catch (err) {
    res.status(404).json({ error: "User not Found" });
  }
}

module.exports = {
  signup,
  login,
};
