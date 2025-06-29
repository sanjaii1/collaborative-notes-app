import api from "./api";

export const fetchUsers = async (): Promise<{ id: string; name: string; email: string }[]> => {
  const res = await api.get("/users");
  return res.data.map((u: any) => ({
    id: u._id,
    name: u.name,
    email: u.email,
  }));
};