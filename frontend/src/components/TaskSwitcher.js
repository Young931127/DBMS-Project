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

  const tasks = activeTab === "置頂任務" ? topTasks : normalTasks; //根據activeTab的值選擇要顯示的任務列表
  return (
    <div>
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
      <ul className="task-list">
        {tasks.map((task, index) => (
          <li
            key={index}
            className="task-item"
            onClick={() => handleTaskClick(task)} //點擊任務時觸發handleTaskClick函數
          >
            <h5 className="mb-1">{task.title}</h5>
            <p className="mb-1">{task.description}</p>
            <small>{task.date}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskSwitcher;
