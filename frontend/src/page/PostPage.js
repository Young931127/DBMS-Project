import React, { useState } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "./PostPage.css";

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
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState("");

  const [endTime, setEndTime] = useState("");
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

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
            placeholder="任務標題(最多20個字)"
            maxLength={20}
            required
          />
        </div>
        <div className="reward-group">
          <label className="reward-label">報酬</label>
          <input
            type="number"
            className="reward-input"
            value={rewardNTD}
            onChange={(e) => setRewardNTD(e.target.value)}
            placeholder="請輸入報酬  例: 現金100元、手搖飲一杯"
            required
            min={0}
          />
        </div>
        <div className="task-content-group">
          <label className="task-content-label">任務內容</label>
          <textarea
            className="task-content-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="請輸入任務內容..."
            required
          />
        </div>

        <div className="date-time-group">
          <label className="date-label">任務日期</label>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <input
              type="date"
              className="start-date-input"
              placeholder="開始日期"
            />
            <span>-</span>
            <input
              type="date"
              className="end-date-input"
              placeholder="結束日期"
            />
          </div>

          <label className="time-label">任務時間</label>
          <div style={{ display: "flex", flexDirection: "row" }}></div>
        </div>
        <div className="region-group">
          <label className="region-label">區域</label>
          <div className="region-checkboxes">
            {regions.map((region, idx) => (
              <div className="checkbox-item" key={region}>
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

        <div className="pay-day-group">
          <label className="pay-day-label">支薪日</label>
        </div>
        <div className="contact-info-group">
          <label className="contact-info-label">聯絡資訊</label>
          <input
            type="text"
            className="contact-info-input"
            placeholder="請輸入聯絡資訊 例:行動電話、LINE ID"
            required
          />
        </div>

        <button
          className="btn btn-primary"
          type="submit"
          disabled={isSubmitting}
        >
          送出
        </button>
      </div>
    </div>
  );
}

export default PostPage;
