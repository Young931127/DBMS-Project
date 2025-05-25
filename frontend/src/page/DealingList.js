import React, { useEffect, useState } from "react";

function DealingList() {
  const [currentUser, setCurrentUser] = useState(null); // 用戶ID字串
  const [tasks, setTasks] = useState([]); // 從API拿到的所有任務
  const [tab, setTab] = useState("dispatched"); // "dispatched" or "accepted"
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);

  // 取得當前用戶ID（API調用範例）
  async function fetchCurrentUser() {
    // 這邊改成你真實API路徑
    const resp = await fetch("/api/currentUser");
    if (!resp.ok) throw new Error("無法取得用戶資料");
    const data = await resp.json();
    return data.currentUser; // 字串
  }

  // 取得全部任務清單
  async function fetchAllTasks() {
    // 你給的API範例是單一陣列
    const resp = await fetch("/api/tasks");
    if (!resp.ok) throw new Error("無法取得任務資料");
    const data = await resp.json();
    return data; // 陣列
  }

  useEffect(() => {
    async function loadData() {
      try {
        const userId = await fetchCurrentUser();
        setCurrentUser(userId);

        const allTasks = await fetchAllTasks();
        setTasks(allTasks);
      } catch (error) {
        console.error("載入資料錯誤", error);
        // 失敗時你可以決定要用localStorage備用資料或空白清單
        setCurrentUser(null);
        setTasks([]);
      }
    }
    loadData();
  }, []);

  // 根據 tab 與 searchKeyword 篩選任務
  useEffect(() => {
    if (!currentUser) {
      setFilteredTasks([]);
      return;
    }

    let filtered = [];
    if (tab === "dispatched") {
      filtered = tasks.filter((task) => task.createdBy === currentUser);
    } else if (tab === "accepted") {
      filtered = tasks.filter((task) => task.acceptedBy === currentUser);
    }

    if (searchKeyword.trim() !== "") {
      const kw = searchKeyword.trim().toLowerCase();
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(kw)
      );
    }

    setFilteredTasks(filtered);
  }, [tab, searchKeyword, tasks, currentUser]);

  return (
    <div>
      <div>
        <button onClick={() => setTab("dispatched")}>我派發的</button>
        <button onClick={() => setTab("accepted")}>我承接的</button>
      </div>

      <input
        type="text"
        placeholder="搜尋任務標題"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
      />

      <div>
        {filteredTasks.length === 0 ? (
          <div>目前沒有任務。</div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.title}>
              <h3>{task.title}</h3>
              <p>{task.content}</p>
              <p>
                報酬：新台幣{task.rewardNTD}元 + 積分{task.rewardPoints}點
              </p>
              <p>
                任務時間：{task.startDate} {task.startHour}:{task.startMinute} ~{" "}
                {task.endDate} {task.endHour}:{task.endMinute}
              </p>
              <p>區域：{(task.regions || []).join("、")}</p>
              <p>指派人：{task.createdBy}</p>
              <p>承接人：{task.acceptedBy || "-"}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DealingList;
