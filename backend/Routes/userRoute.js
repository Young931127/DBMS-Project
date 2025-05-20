const express = require('express'); //引入express模組
const router = express.Router();//創建路由物件
const {signup, login} = require('../Controllers/userController'); //引入userController模組

router.post('/signup', signup); //註冊路由，發送請求給userController的signup函數
router.post('/login', login); //登入路由，發送請求給userController的login函數

module.exports = router; //導出路由