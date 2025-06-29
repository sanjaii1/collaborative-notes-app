import React from "react";
import { FaRegStickyNote, FaShareAlt, FaStar, FaTags, FaChartBar } from "react-icons/fa";
import { Link, useLocation,useNavigate } from "react-router-dom";
import UserInitials from "./UserInitials";
import { useAuthStore } from "../store/authStore";

const navLinks = [
    { name: "Overview", icon: <FaChartBar />, path: "/dashboard" },
    { name: "All Notes", icon: <FaRegStickyNote />, path: "/notes" },
    { name: "Shared", icon: <FaShareAlt />, path: "/shared" },
    { name: "Favorites", icon: <FaStar />, path: "/favorites" },
    { name: "Tags", icon: <FaTags />, path: "/tags" },
];

const Sidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({ isOpen = true, onClose }) => {
    const user = useAuthStore((state: any) => state.user);
    const location = useLocation();
    const navigate = useNavigate();

    // Determine if mobile drawer mode
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const sidebarContent = (
        <>
            <div>
                <div className="p-6 text-2xl font-bold text-blue-600 flex items-center justify-between">
                    NoteNest
                    {/* Close button for mobile */}
                    {isMobile && onClose && (
                        <button onClick={onClose} className="sm:hidden text-gray-500 hover:text-blue-600 text-2xl ml-2" aria-label="Close sidebar">&times;</button>
                    )}
                </div>
                <nav className="mt-8">
                    <ul className="space-y-2">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <Link
                                    to={link.path}
                                    className={`flex items-center px-6 py-3 rounded transition text-gray-700 hover:bg-blue-100 ${location.pathname === link.path ? 'bg-blue-500 text-white font-semibold' : ''}`}
                                    onClick={isMobile && onClose ? onClose : undefined}
                                >
                                    <span className="mr-3 text-lg">{link.icon}</span>
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <div className="p-6 border-t border-gray-200 flex flex-col items-center gap-2">
                {user && (
                  <div className="flex items-center gap-3 pb-2">
                    <UserInitials name={user.name} size="lg" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800 leading-tight">{user.name}</span>
                      <span className="text-xs text-gray-500 leading-tight">{user.email}</span>
                    </div>
                  </div>
                )}
                <button
                    className="w-full py-2 rounded bg-blue-500 text-white text-sm hover:bg-blue-600 mb-2"
                    onClick={() => {
                        navigate("/login");
                    }}
                >
                    Logout
                </button>
            </div>
        </>
    );

    // Desktop sidebar
    if (!isMobile) {
        return (
            <aside className="h-screen w-64 bg-white shadow flex flex-col justify-between hidden sm:flex">
                {sidebarContent}
            </aside>
        );
    }

    // Mobile drawer sidebar
    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-200 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />
            {/* Sidebar drawer */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow flex flex-col justify-between z-50 transform transition-transform duration-200 ${isOpen ? 'translate-x-0' : '-translate-x-full'} sm:hidden`}
            >
                {sidebarContent}
            </aside>
        </>
    );
};

export default Sidebar; 