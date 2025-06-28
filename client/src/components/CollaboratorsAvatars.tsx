import React from "react";
import UserInitials from "./UserInitials";

interface CollaboratorsAvatarsProps {
  collaborators: string[];
  maxDisplay?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const CollaboratorsAvatars: React.FC<CollaboratorsAvatarsProps> = ({ 
  collaborators, 
  maxDisplay = 3, 
  size = "sm",
  className = "" 
}) => {
  if (!collaborators || collaborators.length === 0) {
    return null;
  }

  const displayCollaborators = collaborators.slice(0, maxDisplay);
  const remainingCount = collaborators.length - maxDisplay;

  return (
    <div className={`flex -space-x-2 ${className}`}>
      {displayCollaborators.map((collaborator, index) => (
        <UserInitials
          key={`${collaborator}-${index}`}
          name={collaborator}
          size={size}
          className="border-2 border-white shadow-sm"
        />
      ))}
      {remainingCount > 0 && (
        <div
          className={`${size === "sm" ? "w-6 h-6" : size === "md" ? "w-8 h-8" : "w-10 h-10"} bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-semibold border-2 border-white shadow-sm text-xs`}
          title={`${remainingCount} more collaborator${remainingCount > 1 ? 's' : ''}`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export default CollaboratorsAvatars; 