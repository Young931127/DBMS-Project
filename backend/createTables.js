const db = require('./dbConnection');

// --- 建立 users 表格 ---
// 儲存所有使用者的基本資訊
const createUsersTable = 
`CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,       -- 使用者唯一識別碼
    username VARCHAR(255) NOT NULL UNIQUE,        -- 使用者帳號名稱，必須唯一
    password VARCHAR(255) NOT NULL,               -- 使用者密碼
    email VARCHAR(255) NOT NULL UNIQUE,           -- 使用者電子郵件，必須唯一
    point INT DEFAULT 0,                          -- 使用者累積積分，預設為 0
    status VARCHAR(50) DEFAULT 'unbanned'         -- 帳號狀態，預設為 'unbanned'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

// --- 建立 tasks 表格 ---
// 儲存使用者所建立的任務資訊，並透過 user_id 關聯到 users 表
const createTasksTable =
`CREATE TABLE IF NOT EXISTS tasks (
    Task_id INT AUTO_INCREMENT PRIMARY KEY,        -- 任務唯一識別碼
    user_id INT NOT NULL,                          -- 任務擁有者對應的 users.user_id
    task_name VARCHAR(255) NOT NULL,               -- 任務標題或名稱
    description TEXT,                              -- 任務詳細描述文字
    deadline DATETIME NOT NULL,                    -- 任務截止時間
    reward INT DEFAULT 0,                          -- 完成任務後可獲得的獎勵（積分或金錢），預設為 0
    is_top BOOLEAN DEFAULT FALSE,                  -- 任務是否置頂，TRUE=置頂
    status ENUM("pending", "completed") DEFAULT "pending",  -- 任務狀態：pending=待完成, completed=已完成
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 任務建立時間，預設為當前時間
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

// --- 建立 point_transactions 表格 ---
// 紀錄使用者的積分變動歷程
const createPointTransactionTable =
`CREATE TABLE IF NOT EXISTS point_transactions (
   transaction_id INT AUTO_INCREMENT PRIMARY KEY,  -- 交易紀錄編號
   user_id INT NOT NULL,                           -- 與 users.user_id 關聯
   change_amount INT NOT NULL,                     -- 積分變動值，可為正或負
   reason VARCHAR(255),                            -- 積分變動原因說明
   create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 變動時間
   FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

// --- 建立 violation 表格 ---
// 紀錄使用者違規次數與違規原因
const createViolationTable =
`CREATE TABLE IF NOT EXISTS violation (
    violation_id INT AUTO_INCREMENT PRIMARY KEY,   -- 違規紀錄編號
    user_id INT NOT NULL,                          -- 與 users.user_id 關聯
    count INT NOT NULL DEFAULT 1,                  -- 違規次數累計，預設為 1
    reason VARCHAR(255),                           -- 違規原因說明
    create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 紀錄時間
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

// --- 建立 rate 表格 ---
// 提供使用者之間的互評功能，並限制同一對象只能評分一次
const createRateTable =
`CREATE TABLE IF NOT EXISTS rate (
  rate_id INT AUTO_INCREMENT PRIMARY KEY,         -- 評分紀錄編號
  accepter_id INT NOT NULL,                       -- 被評分者對應的 users.user_id
  poster_id INT NOT NULL,                         -- 評分者對應的 users.user_id
  score TINYINT NOT NULL,                         -- 評分分數（1~5）
  comment VARCHAR(255),                           -- 評分留言或評論
  rate_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 評分時間
  UNIQUE KEY uniq_rate (accepter_id, poster_id),  -- 同一人對同一人只能評一次
  FOREIGN KEY (accepter_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE, 
  FOREIGN KEY (poster_id)   REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE   
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

// --- 資料庫操作邏輯 ---
// 1. 先建立 users 表
// 2. 再建立 tasks 表
// 3. 然後依序建立 point_transactions、violation、rate 表
// 4. 全部建立完畢後關閉資料庫連線

db.query(createUsersTable, (err) => {
    if (err) {
        console.error('Error creating users table:', err);
        return;
    }
    console.log('Users table created or already exists.');

    db.query(createTasksTable, (err) => {
        if (err) {
            console.error('Error creating tasks table:', err);
            return;
        }
        console.log('Tasks table created or already exists.');

        db.query(createPointTransactionTable, (err) => {
            if (err) {
                console.error('Error creating point_transactions table:', err);
                return;
            }
            console.log('Point transactions table created.');

            db.query(createViolationTable, (err) => {
                if (err) {
                    console.error('Error creating violation table:', err);
                    return;
                }
                console.log('Violation table created.');

                db.query(createRateTable, (err) => {
                    if (err) {
                        console.error('Error creating rate table:', err);
                        return;
                    }
                    console.log('Rate table created.');

                    // 全部表格建立完畢，關閉資料庫連線
                    db.end(() => console.log('Database connection closed.'));
                });
            });
        });
    });
});