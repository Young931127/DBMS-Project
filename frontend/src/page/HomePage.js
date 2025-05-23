import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import InputField from "../components/InputField";
import Postbtn from "../components/Postbtn";
import TaskSwitcher from "../components/TaskSwitcher";
import "./HomePage.css";
import { fetchTopTasks, fetchNormalTasks } from "../api/taskApi";

function HomePage() {
  const [topTasks, setTopTasks] = useState([]);
  const [normalTasks, setNormalTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //useEffect 獲取資料
  useEffect(() => {
    //調用fetchTopTasks和fetchNormalTasks API 函數
    const loadTasks = async () => {
      try {
        const topData = await fetchTopTasks();
        const normalData = await fetchNormalTasks();
        console.log("Top Tasks:", topData.data); // 檢查返回的資料
        console.log("Normal Tasks:", normalData.data); // 檢查返回的資料
        setTopTasks(topData.data);
        setNormalTasks(normalData.data);
        setLoading(false); //加載完成
      } catch (err) {
        setError(err);
        setLoading(false); //停止加載
      }
    };

    loadTasks();
  }, []);

  if (loading) return <div>加載中...</div>;
  if (error) return <div>錯誤：{error.message}</div>;

  return (
    <div className="homepage">
      
      <div className="homepage-header-container">
        <div className="homepage-header-content">
          <Sidebar />
          <InputField />
        </div>
      </div>
      <div className="main-content">
        <TaskSwitcher topTasks={topTasks} normalTasks={normalTasks} />
        
      </div>
      <div className="homepage-footer-container">
        <div className="homepage-footer-content">
          <Postbtn />
        </div>
      </div>
    </div>
  );
}
export default HomePage;
