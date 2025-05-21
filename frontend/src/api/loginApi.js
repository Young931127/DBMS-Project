import api from './axiosInstance';

export const login = async (user_id, password) => {
  try {
    const { data } = await api.post('/users/login', {
      user_id,
      password
    });
    // 假設 data = { token, user: { id, name, email } }
    // 你可以把 token 存 localStorage / Vuex / Redux，或 let axios 自動帶 cookie
    localStorage.setItem('token', data.token);
    return data.user;
  } catch (err) {
    // 依照後端回傳的 code 或 status 判斷
    const code = err.response?.data?.code;
    const message = err.response?.data?.message;

    if (code === 'VALIDATION_ERROR' || err.response?.status === 400 || err.response?.status === 403) {
      console.log("loginApi error:", err, err.response, err.message);
      // 假設後端驗證錯誤會給 code: 'VALIDATION_ERROR' 或 400
      throw new Error('帳號或密碼錯誤');
    }
    // err.response.data 會有你後端回傳的 { code, message }
    throw new Error(message || '登入失敗');
  }
};
