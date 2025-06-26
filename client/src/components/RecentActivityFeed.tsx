import React from "react";
import { FaEdit, FaComment, FaShareAlt, FaUserCircle } from "react-icons/fa";

const mockActivities = [
  { type: "edit", user: "You", note: "Meeting Notes", time: "2 mins ago" },
  { type: "comment", user: "Alex", note: "Project Plan", time: "10 mins ago" },
  { type: "share", user: "You", note: "Budget 2025", target: "John", time: "30 mins ago" },
  { type: "edit", user: "Sam", note: "Personal Journal", time: "1 hour ago" },
];

function getIcon(type: string) {
  switch (type) {
    case "edit":
      return <FaEdit className="text-blue-500" />;
    case "comment":
      return <FaComment className="text-green-500" />;
    case "share":
      return <FaShareAlt className="text-purple-500" />;
    default:
      return <FaUserCircle className="text-gray-400" />;
  }
}

const RecentActivityFeed: React.FC = () => {
  return (
    <div className="hidden lg:block w-80 p-4 bg-white rounded-lg shadow ml-6 h-fit sticky top-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Recent Activity</h3>
      <ul className="space-y-4">
        {mockActivities.map((a, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className="mt-1">{getIcon(a.type)}</div>
            <div className="flex-1 text-sm text-gray-700">
              {a.type === "edit" && (
                <span>
                  <span className="font-semibold">{a.user}</span> edited <span className="font-semibold">'{a.note}'</span>
                </span>
              )}
              {a.type === "comment" && (
                <span>
                  <span className="font-semibold">{a.user}</span> commented on <span className="font-semibold">‘{a.note}’</span>
                </span>
              )}
              {a.type === "share" && (
                <span>
                  <span className="font-semibold">{a.user}</span> shared <span className="font-semibold">‘{a.note}’</span> with <span className="font-semibold">{a.target}</span>
                </span>
              )}
              <div className="text-xs text-gray-400 mt-0.5">{a.time}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivityFeed; 