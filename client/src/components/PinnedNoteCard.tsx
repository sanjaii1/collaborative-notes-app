import React from "react";
import CollaboratorsAvatars from "./CollaboratorsAvatars";

interface PinnedNoteCardProps {
  title: string;
  content: string;
  tags?: string[];
  onUnpin: () => void;
  collaborators?: string[];
}

const PinnedNoteCard: React.FC<PinnedNoteCardProps> = ({ title, content, tags, onUnpin, collaborators }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 w-64 flex flex-col justify-between">
      <div>
        <h3 className="font-semibold text-lg mb-1 truncate" title={title}>{title}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{content}</p>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.map((tag) => (
              <span key={tag} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
        )}
        {collaborators && collaborators.length > 0 && (
          <div className="mb-2">
            <CollaboratorsAvatars 
              collaborators={collaborators} 
              size="sm"
              maxDisplay={3}
            />
          </div>
        )}
      </div>
      <button
        onClick={onUnpin}
        className="mt-2 text-xs text-red-500 hover:underline self-end"
      >
        Unpin
      </button>
    </div>
  );
};

export default PinnedNoteCard; 