import React, { useState } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./PostPage.css";
import { submitTask } from "../api/taskApi";

function PostPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  /*const [selectedRegions, setSelectedRegions] = useState([]);*/
  const [region, setRegion] = useState([]);
  const [payDate, setPayDate] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [isUpgrade, setIsUpgrade] = useState(false);
  const [rewardPoints, setRewardPoints] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const userID = "113306089"
  const regionOption = [
    "自強五六舍",
    "自強七八舍",
    "自強九舍",
    "自強九舍D區",
    "自強十舍",
    "莊敬一舍",
    "莊敬二舍",
    "莊敬三舍",
  ];
  // 區域勾選
  const handleRegionChange = (region) => {
    setRegion((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region]
    );
  };

  // 表單送出
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (parseFloat(reward) <= 0 || parseFloat(rewardPoints) <= 0) {
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
    if (region.length === 0) {
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
    // 送出表單資料
    const submitData = {
      userID,
      title,
      reward:Number(reward),
      description,
      startDate: startDate.toISOString().slice(0, 10), // 格式化為 YYYY-MM-DD
      endDate: endDate.toISOString().slice(0, 10),
      startTime:startTime.toISOString().slice(11, 16), // 格式化為 HH:mm
      endTime:endTime.toISOString().slice(11, 16),
      region:region.join(", "), 
      payDate,
      contactInfo,
      isTop:isUpgrade?1:0,
    };
    try {
      await submitTask(submitData);
      console.log("submitData", submitData);
      alert("任務發布成功！");
    } catch (error) {
      console.error("Error submitting task:", error);
      console.log("submitData", submitData);
      alert("任務發布失敗，請稍後再試！");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="post-container">
      <header className="header-container">
        <div className="header-content">
          
          
          <Link to="/HomePage" className="back-link">
            <i class="bi bi-arrow-left-circle-fill"></i>
          </Link>
          <h1 className="header-title">發佈任務</h1>
        </div>
      </header>

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
            value={reward}
            onChange={(e) => setReward(e.target.value)}
            placeholder="請輸入報酬  例: 現金100元、手搖飲一杯"
            required
            min={0}
          />
        </div>
        <div className="task-content-group">
          <label className="task-content-label">任務內容</label>
          <textarea
            className="task-content-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="請輸入任務內容..."
            required
          />
        </div>

        <div className="date-group">
          <label className="date-label">任務日期</label>
          <div className="date-picker-container">
            <DatePicker
              className="start-date-picker"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy/MM/dd"
              placeholderText="請選擇日期"
              portalId="datepicker-portal"
              popperPlacement="bottom-start"
            />
            <span>-</span>
            <DatePicker
              className="end-date-picker"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="yyyy/MM/dd"
              placeholderText="請選擇日期"
              portalId="datepicker-portal"
              popperPlacement="bottom-end"
            />
          </div>
        </div>
        <div className="time-group">
          <label className="time-label">任務時間</label>
          <div className="date-picker-container">
            <DatePicker
              className="start-time-picker"
              selected={startTime}
              onChange={(date) => setStartTime(date)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="開始"
              dateFormat="HH:mm"
              placeholderText="開始時間"
            />
            <span>-</span>
            <DatePicker
              className="end-time-picker"
              selected={endTime}
              onChange={(date) => setEndTime(date)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="結束"
              dateFormat="HH:mm"
              placeholderText="結束時間"
            />
          </div>
        </div>
        <div className="region-group">
          <label className="region-label">區域</label>
          <div className="region-checkboxes">
            {regionOption.map((item, idx) => (
              <div className="checkbox-item" key={item}>
                <input
                  type="checkbox"
                  id={`region${idx + 1}`}
                  value={item}
                  checked={region.includes(item)}
                  onChange={() => handleRegionChange(item)}
                />
                <label htmlFor={`region${idx + 1}`} className="ms-1">
                  {item}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="pay-day-group">
          <label className="pay-day-label">支薪日</label>
          <input
            className="pay-day-input"
            type="text"
            value={payDate}
            onChange={(e) => setPayDate(e.target.value)}
            placeholder="請輸入支薪日 例:當日現領、月/日"
            required
          />
        </div>
        <div className="contact-info-group">
          <label className="contact-info-label">聯絡資訊</label>
          <input
            type="text"
            className="contact-info-input"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            placeholder="請輸入聯絡資訊 例:行動電話、LINE ID"
            required
          />
        </div>
        <div className="upgrade-group">
          <label className="upgrade-label">升級任務</label>
          <h3 className="upgrade-text">
            花費5點積分即可將任務升級為置頂任務，任務將優先顯示於主頁。
          </h3>
          <div className="upgrade-checkbox">
            <input
              type="checkbox"
              checked={isUpgrade}
              onChange={() => setIsUpgrade(!isUpgrade)}
            />
            <p className="small-text">使用積分，剩餘X點</p>
          </div>
        </div>
      </div>
      <div className="footer-container">
        <div className="footer-content">
          <button
            className="submit-btn"
            type="submit"
            disabled={isSubmitting}
            
            onClick={handleSubmit}
          >
            <i className="bi bi-send-fill" style={{ marginRight: "6px", color: "#ffffff" }}></i>
            發佈
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostPage;
