// DealingApi.js
import api from "./axiosInstance";

/**
 * 取得當前用戶資料
 */
export const fetchCurrentUser = async () => {
  try {
    const response = await api.get("/users/me");
    return response.data;  // 假設回傳用戶物件 { id, name, ... }
  } catch (error) {
    console.error("fetchCurrentUser error:", error);
    throw error;
  }
};

/**
 * 取得該用戶的任務清單
 * @param {string} userId - 用戶 ID
 * @returns {object} { dispatchedTasks: [], acceptedTasks: [] }
 */
export const fetchTasksByUser = async (userId) => {
  try {
    // 假設後端有兩個API：
    // 1. /tasks?createdBy=userId 取得派發的任務
    // 2. /tasks?acceptedBy=userId 取得承接的任務

    const [dispatchedRes, acceptedRes] = await Promise.all([
      api.get(`/tasks`, { params: { createdBy: userId } }),
      api.get(`/tasks`, { params: { acceptedBy: userId } }),
    ]);

    return {
      dispatchedTasks: dispatchedRes.data,
      acceptedTasks: acceptedRes.data,
    };
  } catch (error) {
    console.error("fetchTasksByUser error:", error);
    throw error;
  }
};
