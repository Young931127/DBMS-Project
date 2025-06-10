import api from "./axiosInstance";

export async function registerUser({ username, user_id, password, phoneNum }) {
  try {
    const response = await api.post(`/users/signup`, {
      username,
      user_id,
      password,
      phoneNum,
    });
    return response.data;
  } catch (error) {
    console.log("registerUser error:", error.response?.data); 
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error("註冊失敗，請稍後再試");
    }
  }
}
