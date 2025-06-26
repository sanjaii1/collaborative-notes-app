import React from "react";
import { FaRegStickyNote, FaShareAlt, FaStar, FaTrash, FaTags, FaChartBar } from "react-icons/fa";

const navLinks = [
  { name: "Overview", icon: <FaChartBar />, path: "/dashboard" },
  { name: "All Notes", icon: <FaRegStickyNote />, path: "/notes" },
  { name: "Shared", icon: <FaShareAlt />, path: "/shared" },
  { name: "Favorites", icon: <FaStar />, path: "/favorites" },
  { name: "Trash", icon: <FaTrash />, path: "/trash" },
  { name: "Tags", icon: <FaTags />, path: "/tags" },
  { name: "Activity", icon: <FaChartBar />, path: "/activity" },
];

const Sidebar: React.FC = () => {
  return (
    <aside className={`h-screen w-64 bg-white shadow flex flex-col justify-between`}>
      <div>
        <div className="p-6 text-2xl font-bold text-blue-600">NotesApp</div>
        <nav className="mt-8">
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.path}
                  className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-100 rounded transition"
                >
                  <span className="mr-3 text-lg">{link.icon}</span>
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="p-6 border-t border-gray-200 flex items-center justify-center">
        <span className="text-gray-400 text-sm">&copy; 2024</span>
      </div>
    </aside>
  );
};

export default Sidebar; 