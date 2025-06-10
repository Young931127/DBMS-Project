import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "./page/LoginPage";
import HomePage from "./page/HomePage";
import RegisterPage from "./page/RegisterPage";
import PostPage from "./page/PostPage";
import TaskDetailPage from "./page/TaskDetailPage";
import MyAcceptedTasks from "./page/MyAcceptedTasks";

const App = () => {
  return (
    <div className="phone">
      <div className="content">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/Login" />} />
            <Route path="/Login" element={<LoginPage />} />
            <Route path="/RegisterPage" element={<RegisterPage />} />
            <Route path="/HomePage" element={<HomePage />} />
            <Route path="/PostPage" element={<PostPage />} />
            <Route path="/tasks/:taskID" element={<TaskDetailPage />} />
            <Route path="/MyAcceptedTasks" element={<MyAcceptedTasks />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
};

export default App;
