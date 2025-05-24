import api from './axiosInstance';

export const searchTask = async (query) => {
  try {
    const result = await api.get(`tasks/search?query=${encodeURIComponent(query)}`);
    return result.data;
  } catch (error) {
    console.error("Error searching task:", error);
    throw error;
  }
};
