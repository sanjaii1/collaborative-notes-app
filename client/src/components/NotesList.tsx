import React, { useState } from "react";
import NoteCard from "./NoteCard";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../services/noteApi";

type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  sharedWith: string[];
  isPinned: boolean;
  isFavorite: boolean;
  isShared: boolean;
};

interface NotesListProps {
  getUserNames?: (userIds: string[]) => string[];
}

const NotesList: React.FC<NotesListProps> = ({ getUserNames }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const { data: notes, isLoading, error, refetch } = useQuery({
    queryKey: ["notes"],
    queryFn: fetchNotes,
  });

  const handleCheck = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleBatchDelete = () => {
    alert(`Deleted notes: ${selected.join(", ")}`);
    setSelected([]);
  };

  if (isLoading) {
    return <div className="text-center text-gray-400 italic">Loading notes...</div>;
  }
  if (error) {
    return <div className="text-center text-red-400 italic">Error loading notes.</div>;
  }
  if (!notes || notes.length === 0) {
    return <div className="text-center text-gray-400 italic">No notes found.</div>;
  }

  return (
    <div className="mb-8">
      {selected.length > 0 && (
        <div className="mb-4 flex gap-2 items-center">
          <span className="text-sm text-gray-700">{selected.length} selected</span>
          <button
            className="px-3 py-1 rounded bg-red-500 text-white text-xs hover:bg-red-600"
            onClick={handleBatchDelete}
          >
            Delete Selected
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {notes.map((note: Note) => (
          <NoteCard
            key={note.id}
            {...note}
            getUserNames={getUserNames}
            checked={selected.includes(note.id)}
            onCheck={handleCheck}
            onPin={() => alert(`Pin/unpin note ${note.id}`)}
            onFavorite={() => alert(`Favorite/unfavorite note ${note.id}`)}
            onShare={() => alert(`Share note ${note.id}`)}
            onDelete={() => alert(`Delete note ${note.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default NotesList; 