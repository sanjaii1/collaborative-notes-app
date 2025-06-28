import React, { useState } from "react";
import PinnedNoteCard from "./PinnedNoteCard";

const mockPinnedNotes = [
  {
    id: "1",
    title: "Project Plan",
    content: "Outline project milestones and deliverables for Q2...",
    tags: ["Work", "Planning"],
    collaborators: ["Alex Johnson", "Sam Wilson", "David Chen"],
  },
  {
    id: "2",
    title: "Grocery List",
    content: "Eggs, milk, bread, and more for the week...",
    tags: ["Personal"],
    collaborators: [],
  },
  {
    id: "3",
    title: "Budget 2025",
    content: "Draft budget for next year, including all departments...",
    tags: ["Finance"],
    collaborators: ["John Smith", "Emily Davis"],
  },
];

const PinnedNotes: React.FC = () => {
  const [pinned, setPinned] = useState(mockPinnedNotes);

  const handleUnpin = (id: string) => {
    setPinned((prev) => prev.filter((note) => note.id !== id));
  };

  if (pinned.length === 0) {
    return (
      <div className="mb-8 text-center text-gray-400 italic">No pinned notes yet. Pin important notes to see them here!</div>
    );
  }

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">Pinned Notes</h3>
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {pinned.map((note) => (
          <PinnedNoteCard
            key={note.id}
            title={note.title}
            content={note.content}
            tags={note.tags}
            collaborators={note.collaborators}
            onUnpin={() => handleUnpin(note.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default PinnedNotes; 