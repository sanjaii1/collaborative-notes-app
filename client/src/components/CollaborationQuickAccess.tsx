import React from "react";
import { FaShareAlt } from "react-icons/fa";
import CollaboratorsAvatars from "./CollaboratorsAvatars";

interface CollaborationQuickAccessProps {
  getUserNames?: (userIds: string[]) => string[];
}

const mockSharedNotes = [
  {
    id: "1",
    title: "Project Plan",
    sharedBy: "Alex Johnson",
    time: "5 mins ago",
    sharedWith: ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"],
  },
  {
    id: "2",
    title: "Budget 2025",
    sharedBy: "John Smith",
    time: "1 hour ago",
    sharedWith: ["507f1f77bcf86cd799439015", "507f1f77bcf86cd799439016"],
  },
];

const CollaborationQuickAccess: React.FC<CollaborationQuickAccessProps> = ({ getUserNames }) => {
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
              {getUserNames && (
                <CollaboratorsAvatars 
                  collaborators={getUserNames(note.sharedWith)} 
                  size="sm"
                  maxDisplay={3}
                />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollaborationQuickAccess; 