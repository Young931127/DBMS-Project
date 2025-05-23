const db = require('./dbConnection'); // Import the database connection module
//建Tables
const createUsersTable = 
`CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    point INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'unbanned'
);`
;

// --- 建立 Tasks 表格 ---
// 儲存使用者所新增的任務資料，並關聯到 Users 表
const createTasksTable =
`CREATE TABLE IF NOT EXISTS tasks (
    Task_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    task_name VARCHAR(255) NOT NULL,
    description TEXT,
    deadline DATETIME NOT NULL,
    reward INT DEFAULT 0,   -- 這裡的 reward 是任務的獎勵金額 可能最後會改成文字？
    is_top BOOLEAN DEFAULT FALSE,
    status ENUM("pending", "completed") DEFAULT "pending",
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);`
const createPoint_transactionTable =
`CREATE TABLE IF NOT EXISTS point_transactions (
   user_id INT NOT NULL,
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
    count          INT            NOT NULL DEFAULT 0,-- 這裡的 count 是違規次數預設為 0
    reason         VARCHAR(255),
    create_time    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);`
const creatRateTable =
`CREATE TABLE IF NOT EXISTS rate (
  rate_id     INT AUTO_INCREMENT PRIMARY KEY,               -- 評分紀錄編號，自動遞增
  accepter_id INT            NOT NULL,                      -- 被評分者 (Users.user_id)
  poster_id   INT            NOT NULL,                      -- 評分者   (Users.user_id)
  score       TINYINT        NOT NULL,                      -- 評分分數 1~5 分
  comment     VARCHAR(255),                                 -- 評分留言或評論
  rate_time   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 評分時間
  UNIQUE KEY uniq_rate (accepter_id, poster_id),            -- 同一對象只能評分一次
  FOREIGN KEY (accepter_id) REFERENCES users(user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,                                      -- 同步刪除/更新使用者時，處理評分紀錄
  FOREIGN KEY (poster_id)   REFERENCES users(user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
 const creatUserAccepterRatingTable =
`CREATE TABLE IF NOT EXISTS accepter_ratings (
  rate_id    INT            AUTO_INCREMENT PRIMARY KEY,
  accepter_id  INT            NOT NULL,                       -- 接單者的 user_id
  score         TINYINT       NOT NULL,                       -- 評分分數 (1~5)
  comment      VARCHAR(255),                                 -- 評語
  rating_time  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (accepter_id) REFERENCES users(user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; 
`
const createReporterRatingTable=
`CREATE TABLE IF NOT EXISTS reporter_ratings (
  rate_id    INT            AUTO_INCREMENT PRIMARY KEY,
  reporter_id  INT            NOT NULL,                       -- 發布者的 user_id
  score         TINYINT       NOT NULL,                       -- 評分分數 (1~5)
  comment      VARCHAR(255),                                 -- 評語
  rating_time  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reporter_id) REFERENCES users(user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`

;

//資料庫操作邏輯 這裡是舊的
/**db.query(createUsersTable, (err, result) => {
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
db.query(createUsersTable, (err,result) => {
  if (err) {
    console.error('Error creating users table:', err);
    return;
  }
  console.log('Users table created or already exists.');

  db.query(createTasksTable, (err,result) => {
    if (err) {
      console.error('Error creating tasks table:', err);
      return;
    }
    console.log('Tasks table created or already exists.');

    db.query(createPoint_transactionTable , (err,result) => {
      if (err) {
        console.error('Error creating point_transactions table:', err);
        return;
      }
      console.log('Point_transactions table created or already exists.');

      db.query(createViolationTable, (err,result) => {
        if (err) {
          console.error('Error creating violation table:', err);
          return;
        }
        console.log('Violation table created or already exists.');

        db.query(creatRateTable, (err,result) => {
          if (err) {
            console.error('Error creating rate table:', err);
            return;
          }
          console.log('Rate table created or already exists.');

          db.query(creatUserAccepterRatingTable, (err,result) => {
            if (err) {
              console.error('Error creating accepter_ratings table:', err);
              return;
            }
            console.log('Accepter_ratings table created or already exists.');

            db.query(createReporterRatingTable, (err,result) => {
              if (err) {
                console.error('Error creating reporter_ratings table:', err);
                return;
              }
              console.log('Reporter_ratings table created or already exists.');

              // 全部建完，關閉連線
              db.end(() => {
                console.log('Database connection closed.');
              });
            });
          });
        });
      });
    });
  });
}); */

async function init() {
  try {
    for (const sql of [
      createUsersTable,
      createTasksTable,
      createPoint_transactionTable,
      createViolationTable,
      creatRateTable,
      creatUserAccepterRatingTable,
      createReporterRatingTable
    ]) {
      await db.promise().query(sql);
      console.log('Executed:', sql.split('\n')[0]);
    }
  } catch (err) {
    console.error('Error creating tables:', err);
  } finally {
    db.end();
  }
}

init();