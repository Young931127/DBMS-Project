const db = require('./dbConnection'); // 引入資料庫連線模組，供後續執行 SQL 指令

// --- 建立 Users 表格 ---
// 儲存平台使用者的基本資訊：帳號、密碼、Email、積分與狀態
const createUsersTable = 
`CREATE TABLE IF NOT EXISTS Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,    -- 使用者唯一識別碼，自動遞增
    username VARCHAR(255) NOT NULL UNIQUE,     -- 使用者帳號名稱，必須唯一
    password VARCHAR(255) NOT NULL,            -- 使用者密碼（建議先加密後存放）
    email VARCHAR(255) NOT NULL UNIQUE,        -- 使用者電子郵件，必須唯一
    point INT DEFAULT 0,                       -- 使用者積分，初始預設為 0
    status VARCHAR(50) DEFAULT 'unbanned'      -- 帳號狀態，預設為 未禁用
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
;

// --- 建立 Tasks 表格 ---
// 儲存使用者所新增的任務資料，並關聯到 Users 表
const createTasksTable =
`CREATE TABLE IF NOT EXISTS tasks (
    Task_id INT AUTO_INCREMENT PRIMARY KEY,                  -- 任務唯一識別碼，自動遞增
    user_id INT NOT NULL,                                    -- 關聯到 Users.user_id，表示任務擁有者
    task_name VARCHAR(255) NOT NULL,                         -- 任務名稱
    description TEXT,                                        -- 任務的詳細描述
    deadline DATETIME NOT NULL,                              -- 任務截止時間
    reward INT DEFAULT 0,                                    -- 任務獎勵（例：積分或金額），預設 0
    is_top BOOLEAN DEFAULT FALSE,                           -- 是否置頂標記，預設 FALSE
    status ENUM("pending", "completed") DEFAULT "pending", -- 任務狀態，待完成或已完成
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,          -- 任務建立時間，預設當前時間
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE  -- 刪除使用者時，自動刪除此使用者的任務
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
;

// --- 建立 Point Transactions 表格 ---
// 紀錄使用者積分變動歷程，每次增減都會寫入此表
const createPoint_transactionTable =
`CREATE TABLE IF NOT EXISTS point_transactions (
   transaction_id   INT AUTO_INCREMENT PRIMARY KEY,         -- 積分交易紀錄編號，自動遞增
   change_amount    INT            NOT NULL,                -- 積分變動量，可正可負
   reason           VARCHAR(255),                           -- 積分變動原因
   create_time      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 變動時間
   FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE  -- 刪除使用者時，同步刪除此紀錄
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
;

// --- 建立 Violation 表格 ---
// 紀錄使用者違規次數與原因，便於後續處理罰則或警告
const createViolationTable =
`CREATE TABLE IF NOT EXISTS violation (
    violation_id   INT AUTO_INCREMENT PRIMARY KEY,           -- 違規紀錄編號，自動遞增
    user_id        INT            NOT NULL,                 -- 關聯到 Users.user_id，表示違規者
    count          INT            NOT NULL DEFAULT 1,       -- 累計違規次數，預設為 1
    reason         VARCHAR(255),                               -- 違規原因說明
    create_time    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 紀錄時間
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE  -- 刪除使用者時，同步刪除此違規紀錄
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
;

// --- 建立 Rate 表格 ---
// 提供使用者間互評功能，並限制每對使用者只能評分一次
const createRateTable =
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
;

// 資料庫操作流程：
// 1. 建立 Users 表
// 2. 建立 Tasks 表
// 3. 建立 Point Transactions 表
// 4. 建立 Violation 表
// 5. 建立 Rate 表
// 6. 全部完成後關閉資料庫連線

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

        db.query(createPoint_transactionTable, (err, result) => {
            if (err) {
                console.error('Error creating point_transactions table:', err);
                return;
            }
            console.log('Point_transactions table created or already exists.');

            db.query(createViolationTable, (err, result) => {
                if (err) {
                    console.error('Error creating violation table:', err);
                    return;
                }
                console.log('Violation table created or already exists.');

                db.query(createRateTable, (err, result) => {
                    if (err) {
                        console.error('Error creating rate table:', err);
                        return;
                    }
                    console.log('Rate table created or already exists.');

                    // 關閉連線
                    db.end(() => {
                        console.log('Database connection closed.');
                    });
                });
            });
        });
    });
});

