import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotes, createNote, updateNote, deleteNote } from "../api/noteApi";
import { useState } from "react";

export default function Dashboard(): React.JSX.Element {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ title: "", content: "" });
  const [editId, setEditId] = useState<string | null>(null);

  const { data: notes, isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: fetchNotes,
  });

  const create = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setForm({ title: "", content: "" });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof form }) =>
      updateNote(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setForm({ title: "", content: "" });
      setEditId(null);
    },
  });

  const remove = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      update.mutate({ id: editId, data: form });
    } else {
      create.mutate(form);
    }
  };

  const handleEdit = (note: any) => {
    setForm({ title: note.title, content: note.content });
    setEditId(note._id);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">📝 Your Notes</h2>

      <form onSubmit={handleSubmit} className="space-y-2 mb-4">
        <input
          className="w-full border p-2 rounded"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          className="w-full border p-2 rounded"
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
          {editId ? "Update Note" : "Add Note"}
        </button>
      </form>

      {isLoading ? (
        <p>Loading notes...</p>
      ) : (
        <ul className="space-y-3">
          {notes?.map((note: any) => (
            <li key={note._id} className="bg-white shadow p-3 rounded">
              <h3 className="text-lg font-semibold">{note.title}</h3>
              <p>{note.content}</p>
              <div className="mt-2 space-x-2">
                <button onClick={() => handleEdit(note)} className="text-blue-600">Edit</button>
                <button onClick={() => remove.mutate(note._id)} className="text-red-600">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

