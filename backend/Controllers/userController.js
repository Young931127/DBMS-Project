const mysqlConnectionPool = require('../dbConnection');
<<<<<<< HEAD
import jwt from 'jsonwebtoken';
=======
const jwt = require('jsonwebtoken');
>>>>>>> 112306085-frontend
/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function signup(req, res) {
    const { username, user_id, password, phoneNum } = req.body;
    const mysql = await mysqlConnectionPool.getConnection();
    try {
        const check = await mysql.query(
            `
            SELECT COUNT(email)
            FROM \`User\`
            WHERE Email=?
            `, [email])
        if(check > 0){
            res.status(400).json({error: "Email has been used!"});
        }
        else{
            await mysql.query(
            `
    INSERT INTO users ( username, user_id, password, phoneNum, point, status)
    VALUES (?, ?, ?, ?, ?, ?)`,
            [username, user_id, password, phoneNum, 0, "unbanned"],
        );
        // return succcessfully created
        res.status(201).json({ status: "created" });
    }
        
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
app.post("/user/login", login);

async function getUserPoints(req, res){
    const {userID} = req.user.sub;
    const mysql = await mysqlConnectionPool.getConnection();
    try {
        const [points] = mysql.query(
            `
            SELECT point
            FROM \`User\`
            WHERE UserId=?
            `, [userID]
        )
    res.status(200).json({points: points});
    }
    catch (err) {
        res.status(404).json({ error: "User not Found" })
    }
}
//app.post("/user/login", login);

module.exports = {
    signup,
    login
};