document.addEventListener("DOMContentLoaded", function () {
  // 初始化 flatpickr
  const startDatePicker = flatpickr("#start-date", { dateFormat: "Y-m-d" });
  const endDatePicker = flatpickr("#end-date", { dateFormat: "Y-m-d" });

  // 填入小時與分鐘選項
  function populateTimeOptions(hourId, minuteId) {
    const hourSelect = document.getElementById(hourId);
    const minuteSelect = document.getElementById(minuteId);

    // 小時 00-23
    for (let h = 0; h < 24; h++) {
      const option = document.createElement("option");
      option.value = option.text = h.toString().padStart(2, "0");
      hourSelect.appendChild(option);
    }

    // 分鐘 00-59
    for (let m = 0; m < 60; m++) {
      const option = document.createElement("option");
      option.value = option.text = m.toString().padStart(2, "0");
      minuteSelect.appendChild(option);
    }
  }

  populateTimeOptions("start-hour", "start-minute");
  populateTimeOptions("end-hour", "end-minute");

  // 預設任務開始時間為當前時間的 5 分鐘後
  function setDefaultStartTime() {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5); // 將時間向後推移 5 分鐘

    // 設置開始日期
    const formattedDate = now.toISOString().split("T")[0]; // 格式為 YYYY-MM-DD
    startDatePicker.setDate(formattedDate);
    document.getElementById("start-date").value = formattedDate;

    // 設置開始小時與分鐘
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    document.getElementById("start-hour").value = hours;
    document.getElementById("start-minute").value = minutes;
  }

  setDefaultStartTime(); // 設置默認開始時間

  // 檢查是否至少勾選一個區域
  function isRegionSelected() {
    const checkboxes = document.querySelectorAll(".checkbox-item input[type='checkbox']");
    return Array.from(checkboxes).some((checkbox) => checkbox.checked);
  }

  // 表單提交事件
  const form = document.getElementById("task-form");
  let isSubmitting = false; // 防止多次提交的標誌

  form.addEventListener("submit", function (e) {
    // 阻止默認提交行為
    e.preventDefault();

    // 如果表單已經在提交狀態，直接返回，防止多次提交
    if (isSubmitting) return;

    // 取得當前時間
    const currentDateTime = new Date();

    // 驗證任務開始時間和結束時間
    const startDate = document.getElementById("start-date").value;
    const startHour = document.getElementById("start-hour").value;
    const startMinute = document.getElementById("start-minute").value;

    const endDate = document.getElementById("end-date").value;
    const endHour = document.getElementById("end-hour").value;
    const endMinute = document.getElementById("end-minute").value;

    // 驗證金額與積分是否大於 0
    const rewardNTD = parseFloat(document.getElementById("reward-ntd").value) || 0; // 金額
    const rewardPoints = parseFloat(document.getElementById("reward-points").value) || 0; // 積分

    if (rewardNTD <= 0 || rewardPoints <= 0) {
      alert("金額與積分皆須大於 0！");
      return;
    }

    // 驗證任務開始日期與結束日期是否填寫
    if (!startDate) {
      alert("請填寫任務開始日期！");
      return;
    }

    if (!endDate) {
      alert("請填寫任務結束日期！");
      return;
    }

    // 驗證是否至少勾選一個區域
    if (!isRegionSelected()) {
      alert("請至少勾選一個區域！");
      return;
    }

    // 合併日期和時間
    const startDateTime = new Date(`${startDate}T${startHour}:${startMinute}:00`);
    const endDateTime = new Date(`${endDate}T${endHour}:${endMinute}:00`);

    // 動態更新開始時間的合理性
    if (startDateTime < currentDateTime) {
      // 如果開始時間無效，更新為當前時間的 5 分鐘後
      setDefaultStartTime();

      // 提示用戶已自動更新，並重新提交表單
      alert("任務開始時間早於當前時間，已自動更新為當前時間的未來時間！表單已正常提交！");
      isSubmitting = true; // 標記表單正在提交，防止重複執行
      form.requestSubmit(); // 重新提交表單
      return;
    }

    // 驗證結束時間是否晚於開始時間
    if (endDateTime <= startDateTime) {
      alert("任務結束時間必須晚於任務開始時間！");
      return;
    }

    // 如果驗證通過，執行提交邏輯
    alert("表單已提交！");
    isSubmitting = true; // 標記表單正在提交
    form.submit(); // 手動提交表單
  });
});