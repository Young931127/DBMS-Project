import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { fetchCurrentUser, fetchTasksByUser } from "../api/myTasksApi";
import "./MyTasksPage.css";

const ITEMS_PER_PAGE = 10;

export default function MyTasksPage() {
  const [user, setUser] = useState(null);
  const [dispatchedTasks, setDispatchedTasks] = useState([]);
  const [acceptedTasks, setAcceptedTasks] = useState([]);

  const [statusTab, setStatusTab] = useState("pending"); // "pending" or "completed"
  const [identityTab, setIdentityTab] = useState("accepted"); // "accepted" or "dispatched"

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

  // 篩選特定狀態的任務
  const filteredTasks = (status, identity) => {
    const tasks = identity === "accepted" ? acceptedTasks : dispatchedTasks;
    return tasks.filter((task) => task.status === status);
  };

  const currentTasks = filteredTasks(statusTab, identityTab);
  const currentPage = identityTab === "accepted" ? acceptedPage : dispatchedPage;
  const setCurrentPage = identityTab === "accepted" ? setAcceptedPage : setDispatchedPage;

  const paginateTasks = (tasks, page) =>
    tasks.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
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

        {/* 外層 tab：任務狀態 */}
        <nav className="mytasks-tabs-status">
          <button
            className={`mytasks-tab-btn-mine ${statusTab === "pending" ? "active" : ""}`}
            onClick={() => setStatusTab("pending")}
          >
            等待中任務
          </button>
          <button
            className={`mytasks-tab-btn-mine ${statusTab === "completed" ? "active" : ""}`}
            onClick={() => setStatusTab("completed")}
          >
            已完成任務
          </button>
        </nav>

        {/* 內層 tab：我承接的 vs 我派發的 */}
        <nav className="mytasks-tabs-identity">
          <button
            className={`mytasks-tab-btn-mine ${identityTab === "accepted" ? "active" : ""}`}
            onClick={() => setIdentityTab("accepted")}
          >
            我承接的任務
          </button>
          <button
            className={`mytasks-tab-btn-mine ${identityTab === "dispatched" ? "active" : ""}`}
            onClick={() => setIdentityTab("dispatched")}
          >
            我派發的任務
          </button>
        </nav>

        {/* 任務清單 */}
        <ul className="mytasks-list-custom">
          {paginateTasks(currentTasks, currentPage).map((task) => (
            <li key={task.id} className="mytasks-list-group-item">
              <div className="mytasks-task-fields">
                <div className="mytasks-task-title">{task.title}</div>
                <div className="mytasks-task-content">{task.description}</div>
              </div>
            </li>
          ))}
        </ul>

        {/* 分頁 */}
        <ReactPaginate
          pageCount={Math.ceil(currentTasks.length / ITEMS_PER_PAGE)}
          onPageChange={handlePageChange}
          containerClassName="pagination"
          activeClassName="active"
          previousLabel="‹"
          nextLabel="›"
          breakLabel="..."
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          forcePage={currentPage}
        />
      </main>

      <footer className="mytasks-footer-container">
        <div className="mytasks-footer-content">
          <button className="mytasks-add-btn">新增任務</button>
        </div>
      </footer>
    </div>
  );
}
