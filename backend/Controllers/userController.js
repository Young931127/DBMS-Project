const mysqlConnectionPool = require('../db/mysql');
/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function signup(req, res) {
    const { name, email, password } = req.body;
    const mysql = await mysqlConnectionPool.getConnection();
    try {
        await mysql.query(
            `
    INSERT INTO User ( username, password, email, point, status)
    VALUES (?, ?, ?, ?, ?)`,
            [name, email, password, 0, "unbanned"],
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
app.post("/user/signup", signup);

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function login(req, res) {
    const { email, password } = req.body;
    const mysql = await mysqlConnectionPool.getConnection();
    try {
        const result = await mysql.query(
            `
        SELECT UserId, Name
        FROM \`User\`
        WHERE Email=? AND Password=?
        `, [email, password]
        );
        const token = await new jose.SignJWT(
            { id: result[0]["UserId"] }
        )
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("2h")
            .sign(new TextEncoder().encode("secret"));
            res.status(200).json({
                id: result[0]["UserId"],
                token: token
            })
    } catch (err) {
        res.status(403).json({ error: err.toString() })
    }
}
app.post("/user/login", login);