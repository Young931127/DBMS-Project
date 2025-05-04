const db = require('./dbConnection'); // Import the database connection module

//建Tables
const createUsersTable = 
`CREATE TABLE IF NOT EXISTS Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    point INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'unbanned'
);`
;
const createTasksTable =
`CREATE TABLE IF NOT EXISTS tasks (
    Task_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    task_name VARCHAR(255) NOT NULL,
    description TEXT,
    deadline DATETIME NOT NULL,
    reward INT DEFAULT 0,
    is_top BOOLEAN DEFAULT FALSE,
    status ENUM("pending", "completed") DEFAULT "pending",
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);`
const createPoint_transactionTable =
`CREATE TABLE IF NOT EXISTS point_transactions (
   transaction_id   INT AUTO_INCREMENT PRIMARY KEY,
   change_amount    INT            NOT NULL,
   reason           VARCHAR(255),
   create_time      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);`
const createViolationTable =
`CREATE TABLE IF NOT EXISTS violation (
    violation_id   INT AUTO_INCREMENT PRIMARY KEY,
    user_id        INT            NOT NULL, 
    count          INT            NOT NULL DEFAULT 1,
    reason         VARCHAR(255),
    create_time    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);`
const creatRateTable =
`CREATE TABLE IF NOT EXISTS rate (
  rate_id     INT AUTO_INCREMENT PRIMARY KEY,
  accepter_id INT            NOT NULL,
  poster_id   INT            NOT NULL,
  score       TINYINT        NOT NULL,
  comment     VARCHAR(255),
  rate_time   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_rate (accepter_id, poster_id),
  FOREIGN KEY (accepter_id) REFERENCES users(user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (poster_id)   REFERENCES users(user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
 const creatUserRatingSummaryTable =
`CREATE TABLE IF NOT EXISTS user_rating_summary (
  user_id                INT           PRIMARY KEY,                   -- 對應 users.user_id
  avg_rating_as_accepter DECIMAL(3,2)  NOT NULL DEFAULT 0.00,        -- 接單者平均分
  avg_rating_as_poster   DECIMAL(3,2)  NOT NULL DEFAULT 0.00,        -- 發布者平均分
  last_updated           TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP       -- 最後一次更新時間
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;   
`

;

//資料庫操作邏輯
db.query(createUsersTable, (err, result) => {
    if (err) {
        console.error('Error creating users table:', err);
        return;
    }
    console.log('Users table created or already exists.');

    db.query(createTasksTable, (err, result) => {
        if (err) {
            console.error('Error creating tasks table:', err);
            return;
        }
        console.log('Tasks table created or already exists.');

        //關閉連線
        db.end(() => {
            console.log('Database connection closed.');
        });
    });
});

