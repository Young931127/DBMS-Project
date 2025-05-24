import api from "./axiosInstance";

//發送GET請求道後端，獲取置頂任務資料
export const fetchTopTasks = async()=>{
    try{
        const response = await api.get(`tasks/top`)

        return response.data;//返回後端的資料
    }catch(error){
        console.error("Error fetching top tasks:", error);
        throw error; 
    }
};

//獲取一般任務
export const fetchNormalTasks=async()=>{
    try{
        const response = await api.get (`tasks/normal`)
        return response.data;
    }catch(error){
        console.error("Error fetching normal tasks:", error);
        throw error;
    }
};

//發布任務
export const submitTask = async (submitData) =>{
    try{
        const response = await api.post(`tasks/submit`, submitData)
        return response.data;
    }catch(error){
        console.error("Error submitting task:", error);
        throw error;
    }
};
//接受任務
export const fetchTaskDetails = async (taskID) => {
    try {
      // 如果你在 axiosInstance 裡把 baseURL 設成了 '/api'，這裡就直接寫路徑即可
      const response = await api.get(`tasks/${taskID}`);
      return response.data;       // 回傳後端整包 data
    } catch (error) {
      console.error("Error fetching task details:", error);
      throw error;
    }
  };