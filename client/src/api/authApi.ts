import axios from "./axiosInstance";

export const register = async (
  userData: { name: string; email: string; password: string }
): Promise<any> => {
  const { data } = await axios.post("/auth/register", userData);
  return data;
};

export const login = async (
  userData: { email: string; password: string }
): Promise<any> => {
  const { data } = await axios.post("/auth/login", userData);
  return data;
};

export const getMe = async (): Promise<any> => {
  const { data } = await axios.get("/auth/me");
  return data;
};
