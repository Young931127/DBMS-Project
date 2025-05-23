import api from "./axiosInstance";

// 獲取置頂任務
export const fetchTopTasks = async () => {
  try {
    const response = await api.get(`tasks/top`);
    return response.data;
  } catch (error) {
    console.error("Error fetching top tasks:", error);
    throw error;
  }
};

// 獲取一般任務
export const fetchNormalTasks = async () => {
  try {
    const response = await api.get(`tasks/normal`);
    return response.data;
  } catch (error) {
    console.error("Error fetching normal tasks:", error);
    throw error;
  }
};

// 發布任務
export const submitTask = async (taskData) => {
  try {
    const response = await api.post(`tasks/submit`, taskData);
    return response.data;
  } catch (error) {
    console.error("Error submitting task:", error);
    throw error;
  }
};

// 接受任務
export const acceptTask = async (taskID) => {
  try {
    const response = await api.post(`tasks/accept`, { taskID });
    return response.data;
  } catch (error) {
    console.error("Error accepting task:", error);
    throw error;
  }
};

// 完成任務
export const completeTask = async (completionData) => {
  try {
    const response = await api.post(`tasks/complete`, completionData);
    return response.data;
  } catch (error) {
    console.error("Error completing task:", error);
    throw error;
  }
};

// 獲取任務詳情
export const getTaskDetails = async (taskID) => {
  try {
    const response = await api.get(`tasks/details/${taskID}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching task details:", error);
    throw error;
  }
};

// 搜尋任務
export const searchTask = async (query) => {
  try {
    const response = await api.get(`tasks/search?query=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error("Error searching task:", error);
    throw error;
  }
};

// 獲取使用者積分
export const getUserPoint = async (userId) => {
  try {
    const response = await api.post(`tasks/point`, { userId });
    return response.data;
  } catch (error) {
    console.error("Error fetching user point:", error);
    throw error;
  }
};

// 評價任務接受者
export const rateAccepter = async (taskId, data) => {
  try {
    const response = await api.post(`tasks/rate/accepter/${taskId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error rating accepter:", error);
    throw error;
  }
};

// 評價任務發布者
export const rateReporter = async (taskId, data) => {
  try {
    const response = await api.post(`tasks/rate/reporter/${taskId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error rating reporter:", error);
    throw error;
  }
};

// 刪除逾時任務
export const deleteOvertimeTasks = async () => {
  try {
    const response = await api.delete(`tasks/overtime`);
    return response.data;
  } catch (error) {
    console.error("Error deleting overtime tasks:", error);
    throw error;
  }
};

// 通報違規
export const reportViolation = async (reason) => {
  try {
    const response = await api.post(`tasks/violations`, { reason });
    return response.data;
  } catch (error) {
    console.error("Error reporting violation:", error);
    throw error;
  }
};
