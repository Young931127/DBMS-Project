const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./dbConnection');
import mysqlConnectionPool from "./dbConnection.js";
app.use(Express.json());



app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});