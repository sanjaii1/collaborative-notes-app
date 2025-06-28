import React from "react";
import { FaUser } from "react-icons/fa";

interface UserInitialsProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const UserInitials: React.FC<UserInitialsProps> = ({ name, size = "md", className = "" }) => {
  // Generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate consistent color based on name
  const getColor = (name: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500", 
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-teal-500",
      "bg-orange-500",
      "bg-cyan-500"
    ];
    const index = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm", 
    lg: "w-10 h-10 text-base"
  };

  // Special case for "You" - show user icon
  if (name === "You") {
    return (
      <div
        className={`${sizeClasses[size]} bg-blue-600 text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm ${className}`}
        title="You"
      >
        <FaUser className={size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"} />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} ${getColor(name)} text-white rounded-full flex items-center justify-center font-semibold border-2 border-white shadow-sm ${className}`}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
};

export default UserInitials; 