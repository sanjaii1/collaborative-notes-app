import React from "react";

interface OverviewWidgetProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  color: string; 
  onClick?: () => void;
  link?: string;
}

const OverviewWidget: React.FC<OverviewWidgetProps> = ({ icon, label, count, color, onClick, link }) => {
  const content = (
    <div
      className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer"
      onClick={onClick}
    >
      <div className={`w-12 h-12 flex items-center justify-center rounded-full ${color} text-white text-2xl mr-4`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold">{count}</div>
        <div className="text-gray-500 text-sm">{label}</div>
      </div>
    </div>
  );

  if (link) {
    return (
      <a href={link} className="block">
        {content}
      </a>
    );
  }
  return content;
};

export default OverviewWidget; 