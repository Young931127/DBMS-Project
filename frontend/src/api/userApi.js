import api from "./axiosInstance";

export async function registerUser({ username, user_id, password, phoneNum }) {
  try {
    const response = await api.post('/users/signup', {
      username,
      user_id,
      password,
      phoneNum,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Registration failed');
  }
};