import React, { useEffect, useState } from "react";
import "./DealingList.css";

const CURRENT_USER = "test";

function getAllTasks() {
  return JSON.parse(localStorage.getItem("tasks") || "[]");
}

function TaskList() {
  const [currentTime, setCurrentTime] = useState("");
  const [tab, setTab] = useState("dispatched");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  // 時鐘
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const pad = (n) => n.toString().padStart(2, "0");
      setCurrentTime(
        `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
          now.getDate()
        )} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(
          now.getSeconds()
        )}`
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // 任務初始化
  useEffect(() => {
    setTasks(getAllTasks());
  }, []);

  // 過濾任務
  useEffect(() => {
    let filtered = [];
    if (tab === "dispatched") {
      filtered = tasks.filter((task) => task.createdBy === CURRENT_USER);
    } else if (tab === "accepted") {
      filtered = tasks.filter((task) => task.acceptedBy === CURRENT_USER);
    }
    if (searchKeyword.trim() !== "") {
      const keyword = searchKeyword.trim().toLowerCase();
      filtered = filtered.filter((task) =>
        (task.title || "").toLowerCase().includes(keyword)
      );
    }
    setFilteredTasks(filtered);
  }, [tab, tasks, searchKeyword]);

  // 新增任務
  const handleAddTask = () => {
    window.location.href = "postpage.html";
  };

  // 刪除任務
  const handleDeleteTask = (title) => {
    if (window.confirm(`確定要刪除「${title}」這個任務嗎？`)) {
      let allTasks = getAllTasks();
      const idx = allTasks.findIndex((task) => task.title === title);
      if (idx > -1) {
        allTasks.splice(idx, 1);
        localStorage.setItem("tasks", JSON.stringify(allTasks));
        setTasks(allTasks);
      }
    }
  };

  return (
    <div className="tasklist-page">
      <div className="tasklist-header-container">
        <div className="tasklist-header-content">
          <div>
            <div className="tasklist-title">我的任務系統</div>
            <div className="tasklist-time-row">
              <span className="tasklist-time-label">現在時間：</span>
              <span className="tasklist-time">{currentTime}</span>
            </div>
            <div className="tasklist-user-row">
              <span className="tasklist-user-label">當前用戶：</span>
              <span className="tasklist-user-name">{CURRENT_USER}</span>
            </div>
          </div>
          <div style={{ flex: 1 }}></div>
        </div>
      </div>
      <div className="tasklist-main-content">
        <div className="tasklist-tabs-mine">
          <button
            className={`tab-btn-mine${tab === "dispatched" ? " active" : ""}`}
            onClick={() => setTab("dispatched")}
          >
            我派發的
          </button>
          <button
            className={`tab-btn-mine${tab === "accepted" ? " active" : ""}`}
            onClick={() => setTab("accepted")}
          >
            我承接的
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: "8px", alignItems: "center" }}>
          <button className="btn tasklist-add-btn" onClick={handleAddTask}>
            新增任務
          </button>
        </div>
        <div className="tasklist-searchbox">
          <input
            type="text"
            className="form-control"
            placeholder="搜尋任務標題..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <button
            className="btn"
            type="button"
            onClick={() => setSearchKeyword("")}
          >
            清除
          </button>
        </div>
        <div className="list-group mb-4 task-list-custom" id="task-list">
          {filteredTasks.length === 0 ? (
            <div className="list-group-item text-muted text-center">
              目前沒有任務。
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div className="list-group-item" key={task.title}>
                <div className="task-fields">
                  <div className="task-title">{task.title}</div>
                  <div className="task-content">{task.content}</div>
                  <div>
                    報酬：新台幣{task.rewardNTD}元 + 積分{task.rewardPoints}點
                  </div>
                  <div>
                    任務時間：{task.startDate} {task.startHour}:{task.startMinute} ~ {task.endDate} {task.endHour}:{task.endMinute}
                  </div>
                  <div>區域：{(task.regions || []).join("、")}</div>
                  <div>指派人：{task.createdBy || "-"}</div>
                  <div>承接人：{task.acceptedBy || "-"}</div>
                </div>
                <button
                  className="delete-task-btn"
                  onClick={() => handleDeleteTask(task.title)}
                >
                  刪除
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="tasklist-footer-container">
        <div className="tasklist-footer-content">
          {/* 可擴充頁腳 */}
        </div>
      </div>
    </div>
  );
}

export default TaskList;