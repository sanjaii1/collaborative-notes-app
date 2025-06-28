import React from "react";
import { FaStar, FaRegStar, FaThumbtack, FaRegShareSquare, FaTrash } from "react-icons/fa";
import CollaboratorsAvatars from "./CollaboratorsAvatars";

interface NoteCardProps {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  collaborators?: string[];
  isPinned?: boolean;
  isFavorite?: boolean;
  isShared?: boolean;
  checked?: boolean;
  onCheck?: (id: string) => void;
  onPin?: (id: string) => void;
  onFavorite?: (id: string) => void;
  onShare?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({
  id,
  title,
  content,
  tags = [],
  collaborators = [],
  isPinned,
  isFavorite,
  isShared,
  checked,
  onCheck,
  onPin,
  onFavorite,
  onShare,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col relative min-h-[180px]">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => onCheck && onCheck(id)}
            className="accent-blue-500"
          />
          <h3 className="font-semibold text-lg truncate" title={title}>{title}</h3>
          {isPinned && <FaThumbtack className="text-yellow-500 ml-1" title="Pinned" />}
          {isShared && <FaRegShareSquare className="text-green-500 ml-1" title="Shared" />}
        </div>
        <div className="flex gap-2">
          <button onClick={() => onPin && onPin(id)} title="Pin/Unpin">
            <FaThumbtack className={isPinned ? "text-yellow-500" : "text-gray-400"} />
          </button>
          <button onClick={() => onFavorite && onFavorite(id)} title="Favorite">
            {isFavorite ? <FaStar className="text-pink-500" /> : <FaRegStar className="text-gray-400" />}
          </button>
          <button onClick={() => onShare && onShare(id)} title="Share">
            <FaRegShareSquare className="text-blue-400" />
          </button>
          <button onClick={() => onDelete && onDelete(id)} title="Delete">
            <FaTrash className="text-red-400" />
          </button>
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{content}</p>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {tags.map((tag) => (
            <span key={tag} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
      )}
      {collaborators.length > 0 && (
        <div className="mt-auto">
          <CollaboratorsAvatars 
            collaborators={collaborators} 
            size="sm"
            maxDisplay={3}
          />
        </div>
      )}
    </div>
  );
};

export default NoteCard; 