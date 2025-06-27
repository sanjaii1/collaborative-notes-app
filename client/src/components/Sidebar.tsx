import React from "react";
import { FaRegStickyNote, FaShareAlt, FaStar, FaTrash, FaTags, FaChartBar } from "react-icons/fa";
import TagManager from "./TagManager";
import TrashBinModal from "./TrashBinModal";
import { useState } from "react";
import { Link } from "react-router-dom";

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
    const [trashOpen, setTrashOpen] = useState(false);
    return (
        <aside className={`h-screen w-64 bg-white shadow flex flex-col justify-between`}>
            <div>
                <div className="p-6 text-2xl font-bold text-blue-600">NotesApp</div>
                <nav className="mt-8">
                    <ul className="space-y-2">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <Link
                                    to={link.path}
                                    className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-100 rounded transition"
                                >
                                    <span className="mr-3 text-lg">{link.icon}</span>
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                {/* <TagManager /> */}
            </div>
            <div className="p-6 border-t border-gray-200 flex flex-col items-center gap-2">

                <button
                    className="w-full py-2 rounded bg-blue-500 text-white text-sm hover:bg-blue-600 mb-2"
                    onClick={() => {
                        // Mock logout handler
                        window.location.href = "/login";
                    }}
                >
                    Logout
                </button>
                <span className="text-gray-400 text-sm">&copy; 2024</span>
                <TrashBinModal open={trashOpen} onClose={() => setTrashOpen(false)} />
            </div>
        </aside>
    );
};

export default Sidebar; 