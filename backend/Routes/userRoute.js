const express = require('express');
const router = express.Router();
const { signup, login, getUserPoints } = require('../Controllers/userController');
const { authenticateToken } = require('../Middleware/auth');

// 註冊與登入
router.post('/signup', signup);
router.post('/login', login);

// 以下需登入驗證
router.get('/point', authenticateToken, getUserPoints);

module.exports = router;