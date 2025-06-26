import React from "react";
import OverviewWidget from "./OverviewWidget";
import { FaRegStickyNote, FaClock, FaShareAlt, FaStar, FaTrash } from "react-icons/fa";

const mockData = [
  {
    label: "Total Notes",
    count: 42,
    icon: <FaRegStickyNote />,
    color: "bg-blue-500",
    link: "/notes",
  },
  {
    label: "Recently Edited",
    count: 5,
    icon: <FaClock />,
    color: "bg-yellow-500",
    link: "/notes?sort=recent",
  },
  {
    label: "Shared With Me",
    count: 8,
    icon: <FaShareAlt />,
    color: "bg-green-500",
    link: "/shared",
  },
  {
    label: "Favorites",
    count: 12,
    icon: <FaStar />,
    color: "bg-pink-500",
    link: "/favorites",
  },
  {
    label: "Trash",
    count: 3,
    icon: <FaTrash />,
    color: "bg-gray-500",
    link: "/trash",
  },
];

const OverviewWidgets: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
      {mockData.map((item) => (
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