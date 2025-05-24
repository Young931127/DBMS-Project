(function injectHead() {
  const head = document.head;
  [
    { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" },
    { rel: "stylesheet", href: "App.css" },
    { rel: "stylesheet", href: "tasklist.css" }
  ].forEach(attr => {
    if (![...head.querySelectorAll('link')].some(link => link.href.includes(attr.href))) {
      const link = document.createElement('link');
      link.rel = attr.rel;
      link.href = attr.href;
      head.appendChild(link);
    }
  });
})();

const CURRENT_USER = "test";

function getAllTasks() {
  return JSON.parse(localStorage.getItem('tasks') || '[]');
}

function renderCurrentTime() {
  const timeSpan = document.getElementById('current-time');
  if (!timeSpan) return;
  const now = new Date();
  const pad = n => n.toString().padStart(2, '0');
  const formatted = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  timeSpan.textContent = formatted;
}

document.addEventListener("DOMContentLoaded", renderTaskBoard);

function renderTaskBoard() {
  document.body.innerHTML = `
    <div class="phone">
      <div class="content">
        <div class="container py-4" style="width: 100%;">
          <!-- 簡潔標題區 -->
          <div class="tasklist-header-simple mb-3">
            <div class="tasklist-title">我的任務系統</div>
            <div class="tasklist-time-row">
              <span class="tasklist-time-label">現在時間：</span>
              <span id="current-time" class="tasklist-time"></span>
            </div>
            <div class="tasklist-user-row">
              <span class="tasklist-user-label">當前用戶：</span>
              <span id="current-user" class="tasklist-user-name"></span>
            </div>
          </div>
          <div class="task-tabs-mine mb-3">
            <button class="btn tab-btn-mine active" data-tab="dispatched">我派發的</button>
            <button class="btn tab-btn-mine" data-tab="accepted">我承接的</button>
          </div>
          <button id="back-btn" class="btn btn-primary mb-3 w-100 tasklist-add-btn">新增任務</button>
          <div class="input-group mb-3 tasklist-searchbox">
            <input type="text" class="form-control" id="search-bar" placeholder="搜尋任務標題...">
            <button class="btn btn-outline-secondary" type="button" id="clear-search">清除</button>
          </div>
          <div id="task-list" class="list-group mb-4 task-list-custom"></div>
        </div>
      </div>
    </div>
  `;
  document.getElementById('current-user').textContent = CURRENT_USER;

  renderTaskList();

  document.getElementById('back-btn').addEventListener('click', () => {
    window.location.href = "postpage.html";
  });

  document.querySelectorAll('.tab-btn-mine').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.tab-btn-mine').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      renderTaskList();
    });
  });

  const searchBar = document.getElementById('search-bar');
  const clearBtn = document.getElementById('clear-search');
  searchBar.addEventListener('input', function () {
    renderTaskList(this.value);
  });
  clearBtn.addEventListener('click', function () {
    searchBar.value = "";
    renderTaskList();
    searchBar.focus();
  });

  renderCurrentTime();
  setInterval(renderCurrentTime, 1000);
}

function renderTaskList(searchKeyword = "") {
  const allTasks = getAllTasks();
  const mineTab = document.querySelector('.tab-btn-mine.active').getAttribute('data-tab');
  let filteredTasks = [];
  if (mineTab === "dispatched") {
    filteredTasks = allTasks.filter(task => task.createdBy === CURRENT_USER);
  } else if (mineTab === "accepted") {
    filteredTasks = allTasks.filter(task => task.acceptedBy === CURRENT_USER);
  }

  if (searchKeyword && searchKeyword.trim() !== "") {
    const keyword = searchKeyword.trim().toLowerCase();
    filteredTasks = filteredTasks.filter(task => (task.title || "").toLowerCase().includes(keyword));
  }

  const listDiv = document.getElementById('task-list');
  if (!filteredTasks.length) {
    listDiv.innerHTML = `<div class="list-group-item text-muted text-center">目前沒有任務。</div>`;
    return;
  }

  listDiv.innerHTML = filteredTasks.map(task => `
    <div class="list-group-item">
      <div class="task-fields">
        <div class="task-field task-title">${task.title}</div>
        <div class="task-field task-content">${task.content}</div>
        <div class="task-field">報酬：新台幣${task.rewardNTD}元 + 積分${task.rewardPoints}點</div>
        <div class="task-field">
          任務時間：${task.startDate} ${task.startHour}:${task.startMinute} ~ ${task.endDate} ${task.endHour}:${task.endMinute}
        </div>
        <div class="task-field">區域：${(task.regions||[]).join("、")}</div>
        <div class="task-field">指派人：${task.createdBy || '-'}</div>
        <div class="task-field">承接人：${task.acceptedBy || '-'}</div>
      </div>
      <button class="btn btn-danger btn-sm delete-task-btn" data-title="${task.title}">刪除</button>
    </div>
  `).join('');

  document.querySelectorAll('.delete-task-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const taskTitle = this.getAttribute('data-title');
      let allTasks = getAllTasks();
      let idx = allTasks.findIndex(task => task.title === taskTitle);
      deleteTask(idx);
    });
  });
}

function deleteTask(idx) {
  let tasks = getAllTasks();
  if (idx >= 0 && idx < tasks.length) {
    if (confirm(`確定要刪除「${tasks[idx].title}」這個任務嗎？`)) {
      tasks.splice(idx, 1);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTaskList(document.getElementById('search-bar')?.value || "");
    }
  }
}