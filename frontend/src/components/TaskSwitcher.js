import React, { useState } from "react";
import "./TaskSwitcher.css";

const TaskSwitcher = ({ topTasks, normalTasks }) => {
  //定義狀態變數為activeTab，setActiveTab用來更新activeTab，activeTab預設為"置頂任務"
  const [activeTab, setActiveTab] = useState("置頂任務");

  const handleSwitch = (tab) => {
    setActiveTab(tab); //更新activeTab為點擊的選項
  };
  //任務點擊處理
  const handleTaskClick = (task) => {
    alert(`click : ${task.title}`);
  };

  function formatDate(startDate, endDate) {
    if (!startDate) return "";
    if (!endDate ||startDate === endDate) {
      return startDate.slice(0, 10); // 只顯示日期
    };
    return `${startDate.slice(0, 10)} ~ ${endDate.slice(0, 10)}`;
  }

  function timeAgo(created_at) {
    if (!created_at) return "";
    const now = new Date();
    const created = new Date(created_at);
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "剛剛發布";
    if (diffMins < 60) return `${diffMins} 分鐘前`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} 小時前`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} 天前發布`;
  }

  const tasks = activeTab === "置頂任務" ? topTasks : normalTasks; //根據activeTab的值選擇要顯示的任務列表
  return (
    <div className="task-container">
      <div className="task-switcher">
        <button
          className={`task-btn ${activeTab === "置頂任務" ? "active" : ""}`}
          onClick={() => handleSwitch("置頂任務")}
        >
          置頂任務
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
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <li
                key={task.taskID}
                className="task-item"
                onClick={() => handleTaskClick(task)} //點擊任務時觸發handleTaskClick函數
              >
                <small className="task-time">{timeAgo(task.created_at)}</small>
                <h5 className="task-title">{task.title}</h5>
                <div className="task-reward">報酬：{task.reward} 元</div>
                <div className="task-region">地點：{task.region}</div>
                <small className ="task-date">任務日期：{formatDate(task.startDate, task.endDate)}</small>
              </li>
            ))
          ) : (
            <p>目前沒有任務</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TaskSwitcher;
