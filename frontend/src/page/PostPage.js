import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./PostPage.css";
import Swal from "sweetalert2";
import { submitTask } from "../api/taskApi";

function PostPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [region, setRegion] = useState([]);
  const [payDate, setPayDate] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [isUpgrade, setIsUpgrade] = useState(false);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userID = "113306089";
  const regionOption = [
    "線上協助",
    "山下校區",
    "自強一二三舍",
    "自強五六舍",
    "自強七八舍",
    "自強九舍",
    "自強九舍D區",
    "自強十舍",
    "莊敬一舍",
    "莊敬二舍",
    "莊敬三舍",
    "其他區域",
  ];
  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [rewardError, setRewardError] = useState(false);
  const [startDateError, setStartDateError] = useState(false);
  const [endDateError, setEndDateError] = useState(false);
  const [startTimeError, setStartTimeError] = useState(false);
  const [endTimeError, setEndTimeError] = useState(false);
  const [regionError, setRegionError] = useState(false);
  const [payDateError, setPayDateError] = useState(false);
  const [contactInfoError, setContactInfoError] = useState(false);

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
    let hasError = false;
    setTitleError(false);
    setDescriptionError(false);
    setRewardError(false);
    setStartDateError(false);
    setEndDateError(false);
    setStartTimeError(false);
    setEndTimeError(false);
    setRegionError(false);
    setPayDateError(false);
    setContactInfoError(false);

    if (!title) {
      setTitleError("請填寫任務標題");
      hasError = true;
    }

    if (!reward) {
      setRewardError("請填寫任務報酬");
      hasError = true;
    } else if (parseFloat(reward) <= 0) {
      setRewardError("任務報酬不可為0");
    }

    if (!description) {
      setDescriptionError("請填寫任務內容");
      hasError = true;
    }

    function isBeforeToday(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d < today;
    }
    if (startDate > endDate) {
      setStartDateError("任務開始日期不能晚於結束日期");
      hasError = true;
    } else if (startDate && isBeforeToday(startDate)) {
      setStartDateError("任務開始日期不能早於當前日期");
      hasError = true;
    }

    if (!startTime) {
      setStartTimeError("請填寫任務開始時間");
      hasError = true;
    } else if (endTime && startTime >= endTime) {
      setStartTimeError("任務開始時間不能晚於結束時間");
      hasError = true;
    }
    if (region.length === 0) {
      setRegionError("請至少勾選一個區域");
      hasError = true;
    }

    if (!payDate) {
      setPayDateError("請填寫支薪日");
      hasError = true;
    }
    if (!contactInfo) {
      setContactInfoError("請填寫聯絡資訊");
      hasError = true;
    }
    if (hasError) return;

    function formatTime(dateObj) {
      if (!dateObj) return "";
      const h = dateObj.getHours().toString().padStart(2, "0");
      const m = dateObj.getMinutes().toString().padStart(2, "0");
      return `${h}:${m}`;
    }
    // 送出表單資料
    const submitData = {
      userID,
      title,
      reward: Number(reward),
      description,
      startDate: startDate.toISOString().slice(0, 10), // 格式化為 YYYY-MM-DD
      endDate: endDate.toISOString().slice(0, 10),
      startTime: formatTime(startTime),
      endTime: formatTime(endTime),
      region: region.join(", "),
      payDate,
      contactInfo,
      isTop: isUpgrade ? 1 : 0,
    };
    try {
      console.log("submitData", submitData);
      await submitTask(submitData);
      console.log("submitData", submitData);
      Swal.fire({
        icon: "success",
        title: "任務發布成功",
        /*text: "請登入帳號",*/
        confirmButtonText: "返回主頁",
        width: "300px",
        position: "center",
        backdrop: false,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/HomePage"); // 跳轉到主頁
        }
      });
    } catch (error) {
      console.error("Error submitting task:", error);
      console.log("submitData", submitData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="post-page">
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
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              paddingBottom: "20px",
            }}
          >
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="任務標題(最多20個字)"
              maxLength={20}
              required
              className={titleError ? "error" : ""}
            />
          </div>
          <div className={`post-error-text ${titleError ? "" : "hidden"}`}>
            {titleError || "\u00A0" /* 空白保持高度 */}
          </div>
        </div>
        <div className="reward-group">
          <label className="reward-label">報酬</label>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              paddingBottom: "20px",
            }}
          >
            <input
              type="number"
              value={reward}
              onChange={(e) => setReward(e.target.value)}
              placeholder="請輸入報酬  例: 100元"
              required
              className={rewardError ? "error" : ""}
            />
          </div>
          <div className={`post-error-text ${rewardError ? "" : "hidden"}`}>
            {rewardError || "\u00A0" /* 空白保持高度 */}
          </div>
        </div>
        <div className="task-content-group">
          <label className="task-content-label">任務內容</label>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              paddingBottom: "20px",
            }}
          >
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="請輸入任務內容..."
              required
              className={descriptionError ? "error" : ""}
            />
          </div>
          <div
            className={`post-error-text ${descriptionError ? "" : "hidden"}`}
          >
            {descriptionError || "\u00A0" /* 空白保持高度 */}
          </div>
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
            <div
              className={`post-error-text ${startDateError ? "" : "hidden"}`}
            >
              {startDateError || "\u00A0" /* 空白保持高度 */}
            </div>
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
            <div className={`post-error-text ${endDateError ? "" : "hidden"}`}>
              {endDateError || "\u00A0" /* 空白保持高度 */}
            </div>
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
              portalId="datepicker-portal"
              placeholderText="開始時間"
              popperPlacement="bottom-end"
            />
            <div
              className={`post-error-text ${startTimeError ? "" : "hidden"}`}
            >
              {startTimeError || "\u00A0" /* 空白保持高度 */}
            </div>
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
              portalId="datepicker-portal"
              placeholderText="結束時間"
              popperPlacement="bottom-end"
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

          <div className={`post-error-text ${regionError ? "" : "hidden"}`}>
            {regionError || "\u00A0"}
          </div>
        </div>

        <div className="pay-day-group">
          <label className="pay-day-label">支薪日</label>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              paddingBottom: "20px",
            }}
          >
            <input
              type="text"
              value={payDate}
              onChange={(e) => setPayDate(e.target.value)}
              placeholder="請輸入支薪日 例:當日現領、月/日"
              required
              className={payDateError ? "error" : ""}
            />
          </div>
          <div className={`post-error-text ${payDateError ? "" : "hidden"}`}>
            {payDateError || "\u00A0" /* 空白保持高度 */}
          </div>
        </div>
        <div className="contact-info-group">
          <label className="contact-info-label">聯絡資訊</label>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              paddingBottom: "20px",
            }}
          >
            <input
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="請輸入行動電話"
              required
              className={contactInfoError ? "error" : ""}
            />
          </div>
          <div
            className={`post-error-text ${contactInfoError ? "" : "hidden"}`}
          >
            {contactInfoError || "\u00A0" /* 空白保持高度 */}
          </div>
        </div>
        <div className="upgrade-group">
          <label className="upgrade-label">升級任務</label>
          <h3 className="upgrade-text">
            花費10點積分即可將任務升級為緊急任務，任務將優先顯示於主頁。
          </h3>
          <div className="upgrade-checkbox">
            <input
              type="checkbox"
              checked={isUpgrade}
              onChange={() => setIsUpgrade(!isUpgrade)}
            />
            <p className="small-text">使用積分</p>
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
            <i
              className="bi bi-send-fill"
              style={{ marginRight: "6px", color: "#ffffff" }}
            ></i>
            發佈
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostPage;
