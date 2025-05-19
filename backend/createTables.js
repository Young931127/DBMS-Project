const db = require('./dbConnection'); // Import the database connection module
const db2 = require ('./dbConnection');
//建Tables
const createUsersTable = 
`CREATE TABLE IF NOT EXISTS Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    point INT DEFAULT 20,
    rate INT DEFAULT 0,
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
 const creatUserAccepterRatingTable =
`CREATE TABLE IF NOT EXISTS accepter_ratings (
  rating_id    INT            AUTO_INCREMENT PRIMARY KEY,
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
  rating_id    INT            AUTO_INCREMENT PRIMARY KEY,
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

//新增的db2 
db2.connect(err => {
    if (err) {
      console.error('db2 connect error:', err);
      return;
    }
    console.log('db2 connected');
  
    // 1. point_transactions
    db2.query(createPoint_transactionTable, err => {
      if (err) console.error('Error creating point_transactions:', err);
      else     console.log('point_transactions ready');
  
      // 2. violation
      db2.query(createViolationTable, err => {
        if (err) console.error('Error creating violation:', err);
        else     console.log('violation ready');
  
        // 3. rate
        db2.query(creatRateTable, err => {
          if (err) console.error('Error creating rate:', err);
          else     console.log('rate ready');
  
          // 4. accepter_ratings
          db2.query(creatUserAccepterRatingTable, err => {
            if (err) console.error('Error creating accepter_ratings:', err);
            else     console.log('accepter_ratings ready');
  
            // 5. reporter_ratings
            db2.query(createReporterRatingTable, err => {
              if (err) console.error('Error creating reporter_ratings:', err);
              else     console.log('reporter_ratings ready');
  
              // 全部都跑完才關連線
              db2.end(() => console.log('db2 connection closed'));
            });
  
          });
  
        });
  
      });
  
    });
  });


