import React from "react";

interface NoteDetailModalProps {
  open: boolean;
  note: any; // You can type this better if you have a Note type
  onClose: () => void;
}

const NoteDetailModal: React.FC<NoteDetailModalProps> = ({ open, note, onClose }) => {
  if (!open || !note) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{note.title}</h3>
          <button className="text-gray-400 hover:text-gray-700" onClick={onClose}>&times;</button>
        </div>
        <div className="mb-2 text-gray-600">{note.content}</div>
        <div className="flex flex-wrap gap-1 mb-2">
          {note.tags?.map((tag: string) => (
            <span key={tag} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
        <div className="text-xs text-gray-400">Last edited: 2024-06-01</div>
        {/* Add more details as needed */}
      </div>
    </div>
  );
};

export default NoteDetailModal;