import React, { useState } from "react";

import "./PostPage.css";
import { Link } from "react-router-dom";

const regions = [
  "自強五、六舍",
  "自強七、八舍",
  "自強九舍",
  "自強九舍D區",
  "自強十舍",
  "莊敬一舍",
  "莊敬二舍",
  "莊敬三舍",
];

function PostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rewardNTD, setRewardNTD] = useState("");
  const [rewardPoints, setRewardPoints] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 區域勾選
  const handleRegionChange = (region) => {
    setSelectedRegions((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region]
    );
  };

  // 表單送出
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (parseFloat(rewardNTD) <= 0 || parseFloat(rewardPoints) <= 0) {
      alert("金額與積分皆須大於 0！");
      return;
    }
    if (!startDate || !startTime) {
      alert("請填寫任務開始日期與時間！");
      return;
    }
    if (!endDate || !endTime) {
      alert("請填寫任務結束日期與時間！");
      return;
    }
    if (selectedRegions.length === 0) {
      alert("請至少勾選一個區域！");
      return;
    }

    const now = new Date();
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    if (startDateTime < now) {
      alert("任務開始時間早於當前時間，請重新選擇！");
      return;
    }
    if (endDateTime <= startDateTime) {
      alert("任務結束時間必須晚於任務開始時間！");
      return;
    }

    setIsSubmitting(true);
    // 這裡可以送出表單資料到後端
    alert("表單已提交！");
    setIsSubmitting(false);
  };

  return (
    <div className="post-page">
      <div className="header-container">
        <h1 className="post-header">發布任務</h1>
      </div>
      <div className="post-content">
        <div className="task-title">
          <label className="task-title-label">任務標題</label>
          <input
            type="text"
            className="task-title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="請輸入本次任務的標題"
            required
          />
        </div>
        <div className="form-group mb-3">
          <label className="form-label fw-bold">報酬</label>
          <span>新台幣</span>
          <input
            type="number"
            className="form-control mx-2"
            value={rewardNTD}
            onChange={(e) => setRewardNTD(e.target.value)}
            placeholder="金額"
            min="0"
            style={{ width: "120px" }}
            required
          />
          <span>元</span>
        </div>
        <div className="form-group mb-3">
          <label className="form-label fw-bold">任務內容</label>
          <textarea
            className="task-content-box"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="請輸入本次任務的內容"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">任務開始日期</label>
          <div className="date-time-group d-flex">
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              style={{ maxWidth: "160px" }}
            />
            <input
              type="time"
              className="form-control ms-2"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              style={{ maxWidth: "120px" }}
            />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label fw-bold">任務結束日期</label>
          <div className="date-time-group d-flex">
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              style={{ maxWidth: "160px" }}
            />
            <input
              type="time"
              className="form-control ms-2"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              style={{ maxWidth: "120px" }}
            />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label fw-bold">區域</label>
          <div className="checkbox-container d-flex flex-wrap">
            {regions.map((region, idx) => (
              <div className="checkbox-item me-3 mb-2" key={region}>
                <input
                  type="checkbox"
                  id={`region${idx + 1}`}
                  value={region}
                  checked={selectedRegions.includes(region)}
                  onChange={() => handleRegionChange(region)}
                />
                <label htmlFor={`region${idx + 1}`} className="ms-1">
                  {region}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="d-flex justify-content-end mt-4">
          <button
            className="btn btn-primary"
            type="submit"
            disabled={isSubmitting}
          >
            送出
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostPage;
