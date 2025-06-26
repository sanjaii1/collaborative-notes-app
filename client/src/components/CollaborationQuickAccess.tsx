import React from "react";
import { FaShareAlt, FaUserCircle } from "react-icons/fa";

const mockSharedNotes = [
  {
    id: "1",
    title: "Project Plan",
    sharedBy: "Alex",
    time: "5 mins ago",
    collaborators: ["Alex", "You", "Sam"],
  },
  {
    id: "2",
    title: "Budget 2025",
    sharedBy: "John",
    time: "1 hour ago",
    collaborators: ["John", "You"],
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
              <div className="flex -space-x-2 ml-2">
                {note.collaborators.map((c, i) => (
                  <span key={i} className="inline-block w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center border-2 border-white" title={c}>
                    {c === 'You' ? <FaUserCircle /> : c[0].toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollaborationQuickAccess; 