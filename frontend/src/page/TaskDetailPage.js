// src/page/TaskDetailsPage.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTaskDetails } from "../api/taskApi";
import "./TaskDetailPage.css";
import Swal from "sweetalert2";
import { applyForTask } from "../api/taskApi";

import {
  ArrowLeft,
  Share2,
  Building2,
  DollarSign,
  FileText,
  Heart,
  MessageCircle,
  CheckCircle,
} from "lucide-react";

function TaskDetailPage() {
  const { taskID } = useParams();
  const nav = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleApplyClick = async () => {
    try {
      const result = Swal.fire({
        icon: "question",
        title: "確認要接受此任務？",
        showCancelButton: true,
        confirmButtonText: "是",
        cancelButtonText: "否",
        width: "300px",
        position: "center",
        backdrop: false,
      });

      if (result.isConfirmed) {
        try {
          await applyForTask(taskID);
          Swal.fire({
            icon: "success",
            title: "應徵成功",
            confirmButtonText: "返回主頁",
            width: "300px",
            position: "center",
            backdrop: false,
          });
          nav("/HomePage"); // 跳轉到主頁
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "應徵失敗",
            text: "請稍後再試",
            confirmButtonText: "確定",
            width: "300px",
            position: "center",
            backdrop: false,
          });
        }
      } else {
      }
    } catch (error) {
      alert("應徵失敗，請稍後再試");
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchTaskDetails(taskID)
      .then((res) => setTask(res.data))
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
          <button className="icon-btn back" onClick={() => nav(-1)}>
            <ArrowLeft size={24} />
          </button>
          <div className="title">任務說明</div>
          <button className="icon-btn share" onClick={() => {}}>
            <Share2 size={24} />
          </button>
        </div>
      </div>

      <div className="taskdetail-content">
        <div className="section-title">
          <label className="taskdetail-title">{task.title}</label>
        </div>
        <div className="section">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <i
              class="bi bi-person"
              style={{ color: "#555", fontSize: "30px" }}
            ></i>
            <label className="section-label">任務發布者</label>
          </div>

          <div className="value">{task.userID}</div>
        </div>

        {/* 任務待遇 */}
        <div className="section">
          <div className="section-icon">
            <DollarSign size={20} />
          </div>
          <div className="section-body">
            <div className="label">任務待遇</div>
            <div className="value">單次 ${task.reward}</div>
          </div>
        </div>

        {/* 任務內容 */}
        <div className="section">
          <div className="section-icon">
            <FileText size={20} />
          </div>
          <div className="section-body">
            <div className="label">任務內容</div>
            <div className="value">{task.description}</div>
          </div>
        </div>

        <div className="section">
          <div className="section-icon">
            <FileText size={20} />
          </div>
          <div className="section-body">
            <div className="label">地點</div>
            <div className="value">{task.region}</div>
          </div>
        </div>

        {/* 結束日期 */}
        <div className="section">
          <div className="section-icon">
            <FileText size={20} />
          </div>
          <div className="section-body">
            <div className="label">任務日期</div>
            <div className="date">{task.endDate}</div>
            <div className="time">{task.endTime}</div>
          </div>
        </div>

        {/* 聯絡方式 */}
        <div className="section">
          <div className="section-icon">
            <FileText size={20} />
          </div>
          <div className="section-body">
            <div className="label">聯絡方式</div>
            <div className="value">{task.contactInfo}</div>
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
