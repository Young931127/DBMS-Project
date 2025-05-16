const mysqlConnectionPool = require('../dbConnection');
const jwt = require('jsonwebtoken');
/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function signup(req, res) {
    const { username, user_id, password, phoneNum } = req.body;
    const mysql = await mysqlConnectionPool.getConnection();
    try {
        await mysql.query(
            `
    INSERT INTO users ( username, user_id, password, phoneNum, point, status)
    VALUES (?, ?, ?, ?, ?, ?)`,
            [username, user_id, password, phoneNum, 0, "unbanned"],
        );
        // return succcessfully created
        res.status(201).json({ status: "created" });
    } catch (err) {
        // return error
        return res.status(400).json({
            error: "User account has been used!"
        });
    }
}
//app.post("/user/signup", signup);

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function login(req, res) {
    const { user_id, password } = req.body;
    const mysql = await mysqlConnectionPool.getConnection();
    try {
        const result = await mysql.query(
            `
        SELECT user_id, password       
        FROM users
        WHERE user_id=? AND password=?
        `, [user_id, password]
        );

        const user = result[0][0];
        const token = jwt.sign(
            { sub: user.user_id, name: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
          );

          res.status(200).json({token: token});
    } catch (err) {
        res.status(403).json({ error: err.toString() })
    }
}
//app.post("/user/login", login);

module.exports = {
    signup,
    login
};