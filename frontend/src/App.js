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
import RegisterPage from "./page/RegisterPage";

const App = () => {
  
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
            <Route path="/" element={<Navigate to="/Login" />} />
            <Route path="/Login" element={<LoginPage />} />
            <Route path="/RegisterPage" element={<RegisterPage />} />
            <Route path="/HomePage" element={<HomePage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
};

export default App;
