const express = require("express"); //引入express模組
const router = express.Router(); //創建路由物件
const { signup, login } = require("../Controllers/userController");
router.post("/signup", signup); //註冊路由
router.post("/login", login); //登入路由

module.exports = router;