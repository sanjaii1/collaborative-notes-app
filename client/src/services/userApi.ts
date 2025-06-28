// client/src/services/userApi.ts
import api from "./api";

export const fetchUsers = async (): Promise<{ id: string; name: string; email: string }[]> => {
  const res = await api.get("/users");
  // Map _id to id for frontend consistency
  return res.data.map((u: any) => ({
    id: u._id,
    name: u.name,
    email: u.email,
  }));
};