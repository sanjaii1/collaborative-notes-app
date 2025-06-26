import React, { useState } from "react";

interface TrashBinModalProps {
  open: boolean;
  onClose: () => void;
}

const mockDeletedNotes = [
  { id: "1", title: "Old Meeting Notes", content: "Outdated project details...", deletedAt: "2024-05-01" },
  { id: "2", title: "Draft Budget", content: "Initial draft, not needed...", deletedAt: "2024-05-10" },
];

const TrashBinModal: React.FC<TrashBinModalProps> = ({ open, onClose }) => {
  const [deletedNotes, setDeletedNotes] = useState(mockDeletedNotes);

  const handleRestore = (id: string) => {
    setDeletedNotes(notes => notes.filter(n => n.id !== id));
    alert(`Restored note ${id}`);
  };
  const handleDelete = (id: string) => {
    setDeletedNotes(notes => notes.filter(n => n.id !== id));
    alert(`Permanently deleted note ${id}`);
  };
  const handleEmptyTrash = () => {
    setDeletedNotes([]);
    alert("Emptied trash");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Trash Bin</h3>
          <button className="text-gray-400 hover:text-gray-700" onClick={onClose}>&times;</button>
        </div>
        <div className="mb-2 text-xs text-gray-500">Notes are auto-deleted after 30 days.</div>
        {deletedNotes.length === 0 ? (
          <div className="text-center text-gray-400 italic my-8">Trash is empty.</div>
        ) : (
          <>
            <ul className="space-y-4 mb-4">
              {deletedNotes.map(note => (
                <li key={note.id} className="bg-gray-50 rounded p-3 flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">{note.title}</span>
                    <span className="text-xs text-gray-400">Deleted: {note.deletedAt}</span>
                  </div>
                  <div className="text-sm text-gray-500 line-clamp-2">{note.content}</div>
                  <div className="flex gap-2 mt-2">
                    <button className="text-blue-600 text-xs hover:underline" onClick={() => handleRestore(note.id)}>Restore</button>
                    <button className="text-red-500 text-xs hover:underline" onClick={() => handleDelete(note.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
            <button className="w-full py-2 rounded bg-red-500 text-white text-sm hover:bg-red-600" onClick={handleEmptyTrash}>Empty Trash</button>
          </>
        )}
      </div>
    </div>
  );
};

export default TrashBinModal; 