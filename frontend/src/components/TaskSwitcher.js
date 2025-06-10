import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TaskSwitcher.css";

const TaskSwitcher = ({ topTasks, normalTasks }) => {
  //定義狀態變數為activeTab，setActiveTab用來更新activeTab，activeTab預設為"緊急任務"
  const [activeTab, setActiveTab] = useState("緊急任務");
  const navigate = useNavigate();

  const handleSwitch = (tab) => {
    setActiveTab(tab); //更新activeTab為點擊的選項
  };
  //任務點擊處理
  const handleTaskClick = (task) => {
    navigate(`/tasks/${task.taskID}`);
  };

  function formatDate(startDate, endDate) {
    console.log("startDate in formatDate:", startDate, typeof startDate);
    if (!startDate) return "";

    const formattedStartDate = startDate.slice(0, 10);
    if (!endDate || startDate === endDate) {
      return formattedStartDate; // 只顯示日期
    }
    const formattedEndDate = endDate.slice(0, 10);
    return `${formattedStartDate} ~ ${formattedEndDate}`;
  }

  function parseDateString(dateStr) {
    // 將 "2025-05-23 14:00:00" 轉成 "2025-05-23T14:00:00"
    if (!dateStr) return null;
    if (dateStr.length === 10) {
      // 僅有日期
      return new Date(dateStr + "T00:00:00");
    }
    return new Date(dateStr.replace(" ", "T"));
  }

  function timeAgo(created_at) {
    if (!created_at) return "";
    const now = new Date();
    const created = parseDateString(created_at);
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "剛剛發布";
    if (diffMins < 60) return `${diffMins} 分鐘前`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} 小時前`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} 天前發布`;
  }

  const tasks = activeTab === "緊急任務" ? topTasks : normalTasks; //根據activeTab的值選擇要顯示的任務列表
  return (
    <div className="task-container">
      <div className="task-switcher">
        <button
          className={`task-btn ${activeTab === "緊急任務" ? "active" : ""}`}
          onClick={() => handleSwitch("緊急任務")}
        >
          緊急任務
        </button>
        <button
          className={`task-btn ${activeTab === "一般任務" ? "active" : ""}`}
          onClick={() => handleSwitch("一般任務")}
        >
          一般任務
        </button>
      </div>
      <div className="task-content">
        <ul className="task-list">
          {Array.isArray(tasks) && tasks.length > 0 ? (
            tasks.map((task) => (
              <li
                key={task.taskID}
                className="task-item"
                onClick={() => handleTaskClick(task)} //點擊任務時觸發handleTaskClick函數
              >
                <small className="task-time">{timeAgo(task.created_at)}</small>
                <div style={{ width: "80%" }}>
                  <h5 className="task-title">{task.title}</h5>
                </div>
                <div className="task-reward">報酬：{task.reward} 元</div>
                <div className="task-region">地點：{task.region}</div>
                <small className="task-date">
                  任務日期：{formatDate(task.startDate, task.endDate)}
                </small>
              </li>
            ))
          ) : (
            <p className="no-task">目前沒有任務</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TaskSwitcher;
