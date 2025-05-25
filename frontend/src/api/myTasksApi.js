import api from "./axiosInstance";

/**
 * 取得當前用戶資料
 */
export const fetchCurrentUser = async () => {
  try {
    const response = await api.get("/users/me");
    return response.data;
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
