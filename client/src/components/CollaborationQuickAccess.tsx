import React from "react";
import { FaShareAlt, FaUserCircle } from "react-icons/fa";
import CollaboratorsAvatars from "./CollaboratorsAvatars";

const mockSharedNotes = [
  {
    id: "1",
    title: "Project Plan",
    sharedBy: "Alex Johnson",
    time: "5 mins ago",
    collaborators: ["Alex Johnson", "You", "Sam Wilson", "David Chen"],
  },
  {
    id: "2",
    title: "Budget 2025",
    sharedBy: "John Smith",
    time: "1 hour ago",
    collaborators: ["John Smith", "You", "Emily Davis"],
  },
];

const CollaborationQuickAccess: React.FC = () => {
  return (
    <div className="mt-8 bg-white rounded-lg shadow p-4">
      <button
        className="w-full flex items-center gap-2 px-3 py-2 mb-4 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition"
        onClick={() => alert('Go to Shared with me')}
      >
        <FaShareAlt /> Shared with me
      </button>
      <h4 className="text-sm font-semibold text-gray-700 mb-3">Recently Shared</h4>
      <ul className="space-y-3">
        {mockSharedNotes.map(note => (
          <li key={note.id} className="flex flex-col gap-1 bg-gray-50 rounded p-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800 text-sm truncate">{note.title}</span>
              <span className="text-xs text-gray-400">{note.time}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              Shared by {note.sharedBy}
              <CollaboratorsAvatars 
                collaborators={note.collaborators} 
                size="sm"
                maxDisplay={3}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollaborationQuickAccess; 