// 1. 動態插入 head 樣式/套件
(function injectHead() {
  const head = document.head;
  [
    { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" },
    { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css" },
    { rel: "stylesheet", href: "post.css" }
  ].forEach(attr => {
    if (![...head.querySelectorAll('link')].some(link => link.href.includes(attr.href))) {
      const link = document.createElement('link');
      link.rel = attr.rel;
      link.href = attr.href;
      head.appendChild(link);
    }
  });
  if (![...head.querySelectorAll('script')].some(s => s.src.includes('flatpickr'))) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/flatpickr';
    head.appendChild(script);
  }
})();

// 2. 動態插入頁面主要內容（HTML）
function injectForm() {
  document.body.innerHTML = `
  <div class="container py-4">
    <form id="task-form">
      <div class="form-group mb-3">
        <label for="task-title" class="form-label fw-bold">任務標題</label>
        <input type="text" class="form-control" id="task-title" placeholder="請輸入本次任務的標題" required>
      </div>
      <div class="form-group mb-3">
        <label for="task-content" class="form-label fw-bold">任務內容</label>
        <textarea class="form-control task-content-box" id="task-content" placeholder="請輸入本次任務的內容" required></textarea>
      </div>
      <div class="form-group mb-3">
        <label class="form-label fw-bold">報酬</label>
        <div class="d-flex align-items-center">
          <span>新台幣</span>
          <input type="number" class="form-control mx-2" id="reward-ntd" placeholder="金額" min="0" style="width: 120px;">
          <span>元</span>
          <span class="mx-3">+</span>
          <span>自己的積分</span>
          <input type="number" class="form-control mx-2" id="reward-points" placeholder="積分" min="0" style="width: 120px;">
          <span>點</span>
        </div>
      </div>
      <div class="mb-3">
        <label for="start-date" class="form-label fw-bold">任務開始日期</label>
        <div class="date-time-group">
          <input type="text" class="form-control date-input" id="start-date" placeholder="請選擇任務開始日期" required>
          <div class="time-input">
            <select id="start-hour" class="form-select time-select"></select>
            <span class="input-group-text">點</span>
            <select id="start-minute" class="form-select time-select"></select>
            <span class="input-group-text">分</span>
          </div>
        </div>
      </div>
      <div class="mb-3">
        <label for="end-date" class="form-label fw-bold">任務結束日期</label>
        <div class="date-time-group">
          <input type="text" class="form-control date-input" id="end-date" placeholder="請選擇任務結束日期" required>
          <div class="time-input">
            <select id="end-hour" class="form-select time-select"></select>
            <span class="input-group-text">點</span>
            <select id="end-minute" class="form-select time-select"></select>
            <span class="input-group-text">分</span>
          </div>
        </div>
      </div>
      <div class="mb-3">
        <label class="form-label fw-bold">區域</label>
        <div class="checkbox-container">
          <div class="checkbox-item">
            <input type="checkbox" id="region1" value="自強五、六舍">
            <label for="region1">自強五、六舍</label>
          </div>
          <div class="checkbox-item">
            <input type="checkbox" id="region2" value="自強七、八舍">
            <label for="region2">自強七、八舍</label>
          </div>
          <div class="checkbox-item">
            <input type="checkbox" id="region3" value="自強九舍">
            <label for="region3">自強九舍</label>
          </div>
          <div class="checkbox-item">
            <input type="checkbox" id="region4" value="自強九舍D區">
            <label for="region4">自強九舍D區</label>
          </div>
          <div class="checkbox-item">
            <input type="checkbox" id="region5" value="自強十舍">
            <label for="region5">自強十舍</label>
          </div>
          <div class="checkbox-item">
            <input type="checkbox" id="region6" value="莊敬一舍">
            <label for="region6">莊敬一舍</label>
          </div>
          <div class="checkbox-item">
            <input type="checkbox" id="region7" value="莊敬二舍">
            <label for="region7">莊敬二舍</label>
          </div>
          <div class="checkbox-item">
            <input type="checkbox" id="region8" value="莊敬三舍">
            <label for="region8">莊敬三舍</label>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-end mt-4">
        <button class="btn btn-primary" id="submit-button" type="submit">送出</button>
      </div>
    </form>
  </div>
  `;
}

// 確保 flatpickr 載入後再初始化後續邏輯
function waitForFlatpickrReady(cb) {
  if (typeof flatpickr !== "undefined") { cb(); }
  else setTimeout(() => waitForFlatpickrReady(cb), 50);
}

document.addEventListener("DOMContentLoaded", function () {
  injectForm();
  waitForFlatpickrReady(() => {
    // === 以下為原 main.js 邏輯 ===
    const startDatePicker = flatpickr("#start-date", { dateFormat: "Y-m-d" });
    const endDatePicker = flatpickr("#end-date", { dateFormat: "Y-m-d" });

    function populateTimeOptions(hourId, minuteId) {
      const hourSelect = document.getElementById(hourId);
      const minuteSelect = document.getElementById(minuteId);
      for (let h = 0; h < 24; h++) {
        const option = document.createElement("option");
        option.value = option.text = h.toString().padStart(2, "0");
        hourSelect.appendChild(option);
      }
      for (let m = 0; m < 60; m++) {
        const option = document.createElement("option");
        option.value = option.text = m.toString().padStart(2, "0");
        minuteSelect.appendChild(option);
      }
    }
    populateTimeOptions("start-hour", "start-minute");
    populateTimeOptions("end-hour", "end-minute");

    function setDefaultStartTime() {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 5);
      const formattedDate = now.toISOString().split("T")[0];
      startDatePicker.setDate(formattedDate);
      document.getElementById("start-date").value = formattedDate;
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      document.getElementById("start-hour").value = hours;
      document.getElementById("start-minute").value = minutes;
    }
    setDefaultStartTime();

    function isRegionSelected() {
      const checkboxes = document.querySelectorAll(".checkbox-item input[type='checkbox']");
      return Array.from(checkboxes).some((checkbox) => checkbox.checked);
    }

    const form = document.getElementById("task-form");
    let isSubmitting = false;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (isSubmitting) return;
      const currentDateTime = new Date();
      const startDate = document.getElementById("start-date").value;
      const startHour = document.getElementById("start-hour").value;
      const startMinute = document.getElementById("start-minute").value;
      const endDate = document.getElementById("end-date").value;
      const endHour = document.getElementById("end-hour").value;
      const endMinute = document.getElementById("end-minute").value;
      const rewardNTD = parseFloat(document.getElementById("reward-ntd").value) || 0;
      const rewardPoints = parseFloat(document.getElementById("reward-points").value) || 0;
      if (rewardNTD <= 0 || rewardPoints <= 0) {
        alert("金額與積分皆須大於 0！");
        return;
      }
      if (!startDate) {
        alert("請填寫任務開始日期！");
        return;
      }
      if (!endDate) {
        alert("請填寫任務結束日期！");
        return;
      }
      if (!isRegionSelected()) {
        alert("請至少勾選一個區域！");
        return;
      }
      const startDateTime = new Date(`${startDate}T${startHour}:${startMinute}:00`);
      const endDateTime = new Date(`${endDate}T${endHour}:${endMinute}:00`);
      if (startDateTime < currentDateTime) {
        setDefaultStartTime();
        alert("任務開始時間早於當前時間，已自動更新為當前時間的未來時間！表單已正常提交！");
        isSubmitting = true;
        form.requestSubmit();
        return;
      }
      if (endDateTime <= startDateTime) {
        alert("任務結束時間必須晚於任務開始時間！");
        return;
      }
      alert("表單已提交！");
      isSubmitting = true;
      form.submit();
    });
  });
});