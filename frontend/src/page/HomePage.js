import React from "react";
import Sidebar from "../components/Sidebar";
import InputField from "../components/InputField";
import Postbtn from "../components/Postbtn";
import TaskSwitcher from "../components/TaskSwitcher";
import "./HomePage.css";

function HomePage() {
  //假資料，實際要從API獲取
  const topTasks = [
    { title: "任務1", description: "這是任務1的描述", date: "2023-10-01" },
    { title: "任務2", description: "這是任務2的描述", date: "2023-10-02" },
    { title: "任務3", description: "這是任務3的描述", date: "2023-10-03" },
    { title: "任務4", description: "這是任務4的描述", date: "2023-10-04" },
    { title: "任務5", description: "這是任務5的描述", date: "2023-10-05" },
    { title: "任務6", description: "這是任務6的描述", date: "2023-10-06" },
    { title: "任務7", description: "這是任務7的描述", date: "2023-10-07" },
    { title: "任務8", description: "這是任務8的描述", date: "2023-10-08" },
    { title: "任務9", description: "這是任務9的描述", date: "2023-10-09" },
    { title: "任務10", description: "這是任務10的描述", date: "2023-10-10" },
  ];

  const normalTasks = [
    { title: "任務3", description: "這是任務3的描述", date: "2023-10-03" },
    { title: "任務4", description: "這是任務4的描述", date: "2023-10-04" },
    { title: "任務5", description: "這是任務5的描述", date: "2023-10-05" },
    { title: "任務6", description: "這是任務6的描述", date: "2023-10-06" },
    { title: "任務7", description: "這是任務7的描述", date: "2023-10-07" },
    { title: "任務8", description: "這是任務8的描述", date: "2023-10-08" },
    { title: "任務9", description: "這是任務9的描述", date: "2023-10-09" },
    { title: "任務10", description: "這是任務10的描述", date: "2023-10-10" },
  ];
  return (
    <div>
      <div className="homepage-header">
        <Sidebar />
        <InputField />
      </div>
      <div className="main-content">
        <TaskSwitcher topTasks={topTasks} normalTasks={normalTasks} />
        <Postbtn />
      </div>
    </div>
  );
}
export default HomePage;
