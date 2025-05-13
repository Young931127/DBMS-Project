import axios from 'axios';

export const login = async (email, password) => {
  try {
    const { data } = await axios.post('/api/auth/login', {
      email,
      password
    });
    // 假設 data = { token, user: { id, name, email } }
    // 你可以把 token 存 localStorage / Vuex / Redux，或 let axios 自動帶 cookie
    localStorage.setItem('token', data.token);
    return data.user;
  } catch (err) {
    // err.response.data 會有你後端回傳的 { code, message }
    throw new Error(err.response?.data?.message || '登入失敗');
  }
};
