import api from "./axiosInstance";

export const login = async (user_id, password) => {
  try {
    const { data } = await api.post(`users/login`, {
      user_id,
      password,
    });

    localStorage.setItem("token", data.token);
    return data.user;
  } catch (err) {
    console.log("err.response:", err.response);

    const code = err.response?.data?.code;
    const message = err.response?.data?.message;

    if (
      code === "VALIDATION_ERROR" ||
      err.response?.status === 400 ||
      err.response?.status === 403
    ) {
      console.log("loginApi error:", err, err.response, err.message);

      throw new Error("帳號或密碼錯誤");
    }

    throw new Error(message || "登入失敗");
  }
};
