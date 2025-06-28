import api from "./api";

export const fetchNotes = async (): Promise<any> => {
  const res = await api.get("/notes");
  return res.data;
};

export const createNote = async (data: { title: string; content: string; tags?: string[] }): Promise<any> => {
  const res = await api.post("/notes", data);
  return res.data;
};

export const updateNote = async (id: string, data: Partial<{ title: string; content: string; tags?: string[]; isFavorite?: boolean; isStarred?: boolean; isPinned?: boolean }>): Promise<any> => {
  const res = await api.put(`/notes/${id}`, data);
  return res.data;
};

export const deleteNote = async (id: string): Promise<any> => {
  const res = await api.delete(`/notes/${id}`);
  return res.data;
};

export const shareNote = async (noteId: string, userIds: string[]): Promise<any> => {
  const res = await api.post(`/notes/${noteId}/share`, { userIds });
  return res.data;
};