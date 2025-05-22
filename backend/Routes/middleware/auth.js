import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ message: 'Access token is missing or invalid' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // 將解碼後的使用者資訊附加到 req
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

