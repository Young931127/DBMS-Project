// src/page/TaskDetailsPage.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchTaskDetails } from "../api/taskApi";
import { applyForTask } from "../api/taskApi";
import Swal from "sweetalert2";
import "./TaskDetailPage.css";

function TaskDetailPage() {
  const { taskID } = useParams();
  const nav = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleApplyClick = async () => {
    try {
      await applyForTask(taskID);
      Swal.fire({
        icon: "success",
        title: "任務已接受",
        confirmButtonText: "確認",
        width: "300px",
        position: "center",
        backdrop: false,
      }).then((result) => {
        if (result.isConfirmed) {
          nav("/HomePage"); 
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "申請失敗",
        confirmButtonText: "確認",
        width: "300px",
        position: "center",
        backdrop: false,
      });
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchTaskDetails(taskID)
      .then((res) => {
        setTask({
          ...res.data,
          submitterName: res.submitterName, // 把 submitterName 存進 task
        });
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [taskID]);

  if (loading) return <p style={{ padding: 16 }}>載入中TaskDetailPage</p>;
  if (error) return <p style={{ padding: 16 }}>讀取失敗：{error.message}</p>;
  if (!task) return <p style={{ padding: 16 }}>找不到此任務</p>;

  return (
    <div className="detail-page">
      <div className="header-container">
        <div className="header-content">
          <Link to="/HomePage" className="back-link">
            <i class="bi bi-house-door-fill" style={{ color: "#24366e" }}></i>
          </Link>
          <div className="detail-header-title">任務說明</div>
        </div>
      </div>

      <div className="taskdetail-content">
        {/* 任務標題 */}
        <div className="section-title">
          <label className="taskdetail-title">{task.title}</label>
        </div>
        {/* 任務發布者 */}
        <div className="section">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <i
              class="bi bi-person"
              style={{ color: "#555", fontSize: "20px" }}
            ></i>
            <label className="section-label">任務發布者</label>
          </div>
          <div style={{ fontSize: "14px", marginLeft: "28px" }}>
            {task.submitterName}
          </div>
        </div>

        {/* 任務報酬 */}
        <div className="section">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <i
              class="bi bi-coin"
              style={{ color: "#555", fontSize: "20px" }}
            ></i>
            <label className="section-label">任務待遇</label>
          </div>
          <div style={{ fontSize: "14px", marginLeft: "28px" }}>
            新台幣${task.reward}
          </div>
        </div>

        {/* 任務內容 */}
        <div className="section">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <i
              class="bi bi-clipboard-check"
              style={{ color: "#555", fontSize: "20px" }}
            ></i>
            <label className="section-label">任務內容</label>
          </div>
          <div style={{ fontSize: "14px", marginLeft: "28px" }}>
            {task.description}
          </div>
        </div>

        {/* 地點 */}
        <div className="section">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <i
              class="bi bi-pin-map"
              style={{ color: "#555", fontSize: "20px" }}
            ></i>
            <label className="section-label">地點</label>
          </div>
          <div style={{ fontSize: "14px", marginLeft: "28px" }}>
            {task.region}
          </div>
        </div>

        {/* 任務日期 */}
        <div className="section">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <i
              class="bi bi-calendar2-check"
              style={{ color: "#555", fontSize: "20px" }}
            ></i>
            <label className="section-label">任務日期</label>
          </div>
          <div style={{ fontSize: "14px", marginLeft: "28px" }}>
            {task.startDate.slice(0, 10)} ~ {task.endDate.slice(0, 10)}
          </div>
        </div>

        {/* 任務時間 */}
        <div className="section">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <i
              class="bi bi-clock"
              style={{ color: "#555", fontSize: "20px" }}
            ></i>
            <label className="section-label">任務時間</label>
          </div>
          <div style={{ fontSize: "14px", marginLeft: "28px" }}>
            {task.startTime.slice(0, 5)} ~ {task.endTime.slice(0, 5)}
          </div>
        </div>

        {/* 聯絡方式 */}
        <div className="section">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <i
              class="bi bi-telephone"
              style={{ color: "#555", fontSize: "20px" }}
            ></i>
            <label className="section-label">聯絡方式</label>
          </div>
          <div style={{ fontSize: "14px", marginLeft: "28px" }}>
            {task.contactInfo}
          </div>
        </div>
      </div>
      <div className="footer-container">
        <div className="footer-content">
          <button className="apply-btn" onClick={handleApplyClick}>
            <i
              className="bi bi-check-circle"
              style={{ marginRight: "6px", color: "#ffffff" }}
            ></i>
            申請任務
          </button>
        </div>
      </div>
    </div>
  );
}
export default TaskDetailPage;
