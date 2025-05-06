import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/*import InputField from "./components/InputField";
import PostBtn from "./components/post_btn";
import AcceptBtn from "./components/accept_btn";
import TaskSwitcher from "./components/TaskSwitcher";
import LoginField from "./components/LoginField";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";*/
import LoginPage from "./page/LoginPage";
import HomePage from "./page/HomePage";

const App = () => {
  //假資料，實際要從API獲取
  const topTasks = [
    { title: "任務1", description: "這是任務1的描述", date: "2023-10-01" },
    { title: "任務2", description: "這是任務2的描述", date: "2023-10-02" },
  ];

  const normalTasks = [
    { title: "任務3", description: "這是任務3的描述", date: "2023-10-03" },
    { title: "任務4", description: "這是任務4的描述", date: "2023-10-04" },
  ];
  return (
    /*<div className="container mt-4">
      <InputField />
      <TaskSwitcher topTasks={topTasks} normalTasks={normalTasks} />
      <PostBtn />
      <AcceptBtn />
      <LoginField />
      <Navbar />
      <Sidebar/>
    </div>*/
    <div className="phone">
      <div className="content">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/HomePage" element={<HomePage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
};

export default App;
