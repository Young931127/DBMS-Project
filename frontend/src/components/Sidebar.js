import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // 控制側欄開關
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 控制下拉選單開關
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // 切換側欄狀態
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // 切換下拉選單狀態
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false); // 點擊後關閉側欄
  };

  const handleOverlayClick = (e) => {
    // 如果點擊的區域不是側欄，則關閉側欄
    if (!e.target.closest(".sidebar")) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* 左上角的三條線圖示 */}
     
        <i className="bi bi-list-ul menu-icon" 
        onClick={toggleSidebar}
        
        ></i>
    
      {/* 側欄 */}
      {isOpen && (
        <div className="overlay" onClick={handleOverlayClick}>
          <div className={`sidebar ${isOpen ? "open" : ""}`}>
            <button className="close-btn" onClick={toggleSidebar}>
              &times;
            </button>
            <div className="sidebar-content">
              <ul>
                <li onClick={() => handleNavigation("/profile")}>Profile</li>
                <li>
                  <div className="dropdown-header" onClick={toggleDropdown}>
                    所有任務
                    <span className={`arrow ${isDropdownOpen ? "open" : ""}`}>
                      {isDropdownOpen ? "▼" : "▲"}
                    </span>
                  </div>
                  <ul className="dropdown-menu">
                    <li onClick={() => handleNavigation("/ProgressingTask")}>
                      進行中任務
                    </li>
                    <li onClick={() => handleNavigation("/WaitingTask")}>
                      等待中任務
                    </li>
                    <li onClick={() => handleNavigation("/FinishedTask")}>
                      已完成任務
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
