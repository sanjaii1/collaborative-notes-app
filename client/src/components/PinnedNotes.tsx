import React, { useState } from "react";
import NoteCard from "./NoteCard";

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  sharedWith: string[];
  isPinned?: boolean;
  isFavorite?: boolean;
  isShared?: boolean;
}

interface PinnedNotesProps {
  notes: Note[];
  getUserNames?: (userIds: string[]) => string[];
  onTogglePin?: (noteId: string, isPinned: boolean) => Promise<void>;
}

const PinnedNotes: React.FC<PinnedNotesProps> = ({ notes, getUserNames, onTogglePin }) => {
  const [pinned, setPinned] = useState(notes || []);

  React.useEffect(() => {
    setPinned(notes || []);
  }, [notes]);

  const handleUnpin = async (id: string) => {
    if (onTogglePin) {
      await onTogglePin(id, true); 
    } else {
      setPinned((prev) => prev.filter((note) => note.id !== id));
    }
  };

  if (!pinned || pinned.length === 0) {
    return (
      <div className="mb-8 text-center text-gray-400 italic">No pinned notes yet. Pin important notes to see them here!</div>
    );
  }

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">Pinned Notes</h3>
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {pinned.map((note) => (
          <div key={note.id} className="min-w-[300px] max-w-xs">
            <NoteCard
              id={note.id}
              title={note.title}
              content={note.content}
              tags={note.tags}
              sharedWith={note.sharedWith}
              getUserNames={getUserNames}
              isPinned={note.isPinned}
              isFavorite={note.isFavorite}
              isShared={note.isShared}
              onPin={() => handleUnpin(note.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PinnedNotes; 