import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { fetchCurrentUser, fetchTasksByUser } from "./myTasksApi";
import "./MyTasksPage.css";

const ITEMS_PER_PAGE = 10;

export default function MyTasksPage() {
  const [user, setUser] = useState(null);
  const [dispatchedTasks, setDispatchedTasks] = useState([]);
  const [acceptedTasks, setAcceptedTasks] = useState([]);

  const [tab, setTab] = useState("accepted"); // accepted or dispatched

  // 分頁狀態
  const [acceptedPage, setAcceptedPage] = useState(0);
  const [dispatchedPage, setDispatchedPage] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const currentUser = await fetchCurrentUser();
        setUser(currentUser);

        const tasks = await fetchTasksByUser(currentUser.id);
        setDispatchedTasks(tasks.dispatchedTasks);
        setAcceptedTasks(tasks.acceptedTasks);
      } catch (err) {
        console.error("載入任務失敗", err);
      }
    }
    loadData();
  }, []);

  // 分頁用切割函數
  const paginateTasks = (tasks, page) =>
    tasks.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  // 分頁按鈕處理
  const handleAcceptedPageChange = (selectedItem) => {
    setAcceptedPage(selectedItem.selected);
  };
  const handleDispatchedPageChange = (selectedItem) => {
    setDispatchedPage(selectedItem.selected);
  };

  return (
    <div className="mytasks-page">
      <header className="mytasks-header-container">
        <div className="mytasks-header-content">
          <h1 className="mytasks-title">我的任務</h1>
          {user && (
            <div className="mytasks-user-row">
              <span className="mytasks-user-label">使用者：</span> {user.name}
            </div>
          )}
        </div>
      </header>

      <main className="mytasks-main-content">
        <nav className="mytasks-tabs-mine">
          <button
            className={`mytasks-tab-btn-mine ${tab === "accepted" ? "active" : ""}`}
            onClick={() => setTab("accepted")}
          >
            承接中任務
          </button>
          <button
            className={`mytasks-tab-btn-mine ${tab === "dispatched" ? "active" : ""}`}
            onClick={() => setTab("dispatched")}
          >
            派發中任務
          </button>
        </nav>

        {/* 承接中任務列表 */}
        {tab === "accepted" && (
          <>
            <ul className="mytasks-list-custom">
              {paginateTasks(acceptedTasks, acceptedPage).map((task) => (
                <li key={task.id} className="mytasks-list-group-item">
                  <div className="mytasks-task-fields">
                    <div className="mytasks-task-title">{task.title}</div>
                    <div className="mytasks-task-content">{task.description}</div>
                  </div>
                </li>
              ))}
            </ul>

            <ReactPaginate
              pageCount={Math.ceil(acceptedTasks.length / ITEMS_PER_PAGE)}
              onPageChange={handleAcceptedPageChange}
              containerClassName="pagination"
              activeClassName="active"
              previousLabel="‹"
              nextLabel="›"
              breakLabel="..."
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              forcePage={acceptedPage}
            />
          </>
        )}

        {/* 派發中任務列表 */}
        {tab === "dispatched" && (
          <>
            <ul className="mytasks-list-custom">
              {paginateTasks(dispatchedTasks, dispatchedPage).map((task) => (
                <li key={task.id} className="mytasks-list-group-item">
                  <div className="mytasks-task-fields">
                    <div className="mytasks-task-title">{task.title}</div>
                    <div className="mytasks-task-content">{task.description}</div>
                  </div>
                </li>
              ))}
            </ul>

            <ReactPaginate
              pageCount={Math.ceil(dispatchedTasks.length / ITEMS_PER_PAGE)}
              onPageChange={handleDispatchedPageChange}
              containerClassName="pagination"
              activeClassName="active"
              previousLabel="‹"
              nextLabel="›"
              breakLabel="..."
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              forcePage={dispatchedPage}
            />
          </>
        )}
      </main>

      <footer className="mytasks-footer-container">
        <div className="mytasks-footer-content">
          {/* 可以放新增任務按鈕或其他內容 */}
          <button className="mytasks-add-btn">新增任務</button>
        </div>
      </footer>
    </div>
  );
}
