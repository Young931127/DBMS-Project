const mysql = require('mysql2/promise');
require('dotenv').config();

const connection = mysql.createPool({
    host: process.env.DB_HOST || ' LAPTOP-HKJ72776',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1183',
    database: process.env.DB_NAME || 'project_db',
    
});


module.exports = connection;