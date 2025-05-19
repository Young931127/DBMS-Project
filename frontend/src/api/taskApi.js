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
//接受任務