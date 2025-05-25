// src/page/TaskDetailsPage.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTaskDetails } from "../api/taskApi";
import "./TaskDetailPage.css";
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

function TaskDetailsPage() {
  const { taskID } = useParams();
  const nav = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchTaskDetails(taskID);
        setTask(res.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [taskID]);

  if (loading) return <p style={{ padding: 16 }}>載入中…</p>;
  if (error) return <p style={{ padding: 16 }}>讀取失敗：{error.message}</p>;
  if (!task) return <p style={{ padding: 16 }}>找不到此任務</p>;

  return (
    <div className="page">
      {/* header */}
      <div className="header">
        <button className="icon-btn back" onClick={() => nav(-1)}>
          <ArrowLeft size={24} />
        </button>
        <div className="title">任務說明</div>
        <button
          className="icon-btn share"
          onClick={() => {
         
          }}
        >
          <Share2 size={24} />
        </button>
      </div>

      {/* content */}
      <div className="content">
        <div className="time-ago">6 分鐘前</div>
        
        
        {/* 發布者*/}
        <div className="section">
          <div className="section-icon">
            <Building2 size={20} />
          </div>
          <div className="section-body">
            <div className="label">發布者</div>
            <div className="value">{task.userID}</div>
          </div>
        </div>
        
        {/* 任務標題 */}
        <div className="section">
          <div className="section-icon">
            <FileText size={20} />
          </div>
          <div className="section-body">
            <div className="label">任務標題</div>
            <div className="value">{task.title}</div>
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
      </div>

          {/* 報酬 */}
        <div className="section">
          <div className="section-icon">
            <DollarSign size={20} />
          </div>
          <div className="section-body">
            <div className="label">報酬</div>
            <div className="value">${task.reward}</div>
          </div>
        </div>

        {/* 地點 */}
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
            <div className="label">結束日期</div>
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

      <div className="actions">
        
        <button className="apply">
          <CheckCircle className="icon" size={20} />
          立即應徵
        </button>
      </div>
    </div>
  );
}
export default TaskDetailsPage;