import React, { useState } from "react";
import NoteCard from "./NoteCard";

const mockNotes = [
  {
    id: "1",
    title: "Meeting Notes",
    content: "Discussed project timeline and deliverables...",
    tags: ["Work"],
    collaborators: ["Alex"],
    isPinned: false,
    isFavorite: true,
    isShared: true,
  },
  {
    id: "2",
    title: "Personal Journal",
    content: "Today I went to the park and read a book...",
    tags: ["Personal"],
    collaborators: [],
    isPinned: false,
    isFavorite: false,
    isShared: false,
  },
  {
    id: "3",
    title: "Project Plan",
    content: "Outline project milestones and deliverables for Q2...",
    tags: ["Work", "Planning"],
    collaborators: ["Sam"],
    isPinned: true,
    isFavorite: false,
    isShared: true,
  },
  {
    id: "4",
    title: "Budget 2025",
    content: "Draft budget for next year, including all departments...",
    tags: ["Finance"],
    collaborators: ["John"],
    isPinned: false,
    isFavorite: false,
    isShared: true,
  },
];

const NotesList: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([]);

  const handleCheck = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleBatchDelete = () => {
    // Mock batch delete
    alert(`Deleted notes: ${selected.join(", ")}`);
    setSelected([]);
  };

  if (mockNotes.length === 0) {
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
        {mockNotes.map((note) => (
          <NoteCard
            key={note.id}
            {...note}
            checked={selected.includes(note.id)}
            onCheck={handleCheck}
            // Mock handlers for actions
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