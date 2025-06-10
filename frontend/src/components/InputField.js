import React, { useState } from "react";
import { searchTask } from "../api/searchApi";
import "./InputField.css";

const InputField = ({ placeholder, onSearch }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSearch = async () => {
    try {
      const response = await searchTask(inputValue);
      console.log("Search results:", response);
      if (onSearch) {
        onSearch(response.data);
      }
      setInputValue(""); // 清空輸入框
    } catch (error) {
      console.error("Error searching tasks:", error);
    }
  };

  return (
    <div className="input-container">
      <input
        type="text" 
        className="input"
        placeholder={placeholder || "請輸入關鍵字..."} //設定輸入框的預設文字
        value={inputValue} //綁定狀態值
        onChange={(e) => setInputValue(e.target.value)} //當輸入框的值改變時，更新狀態值
      />
      <button
        className="search-button"
        onClick={handleSearch} 
      >
        <i class="bi bi-search"></i>
      </button>
    </div>
  );
};

export default InputField;
