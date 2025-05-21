const db = require('./dbConnection'); // Import the database connection module
//建Tables
const createUsersTable = 
`CREATE TABLE IF NOT EXISTS sers (
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