import React from "react";
import OverviewWidget from "./OverviewWidget";
import { FaRegStickyNote, FaClock, FaShareAlt, FaStar, FaTrash } from "react-icons/fa";

interface OverviewStats {
  totalNotes: number;
  recentlyEdited: number;
  sharedWithMe: number;
  favorites: number;
  trash: number;
}

interface OverviewWidgetsProps {
  stats: OverviewStats;
}

const OverviewWidgets: React.FC<OverviewWidgetsProps> = ({ stats }) => {
  const widgetData = [
    {
      label: "Total Notes",
      count: stats.totalNotes,
      icon: <FaRegStickyNote />,
      color: "bg-blue-500",
      link: "/notes",
    },
    {
      label: "Recently Edited",
      count: stats.recentlyEdited,
      icon: <FaClock />,
      color: "bg-yellow-500",
      link: "/notes?sort=recent",
    },
    {
      label: "Shared With Me",
      count: stats.sharedWithMe,
      icon: <FaShareAlt />,
      color: "bg-green-500",
      link: "/shared",
    },
    {
      label: "Favorites",
      count: stats.favorites,
      icon: <FaStar />,
      color: "bg-pink-500",
      link: "/favorites",
    },
    {
      label: "Trash",
      count: stats.trash,
      icon: <FaTrash />,
      color: "bg-gray-500",
      link: "/trash",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-2">
      {widgetData.map((item) => (
        <OverviewWidget
          key={item.label}
          icon={item.icon}
          label={item.label}
          count={item.count}
          color={item.color}
          link={item.link}
        />
      ))}
    </div>
  );
};

export default OverviewWidgets; 