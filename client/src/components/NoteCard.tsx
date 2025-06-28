import React from "react";
import { FaStar, FaRegStar, FaTrash, FaEdit, FaUsers, FaEye, FaShareAlt } from "react-icons/fa";
import CollaboratorsAvatars from "./CollaboratorsAvatars";

interface NoteCardProps {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  sharedWith?: string[];
  getUserNames?: (userIds: string[]) => string[];
  isPinned?: boolean;
  isFavorite?: boolean;
  isStarred?: boolean;
  isShared?: boolean;
  lastEdited?: string;
  // Selection props
  checked?: boolean;
  onCheck?: (id: string) => void;
  // Action handlers
  onPin?: (id: string) => void;
  onFavorite?: (id: string) => void;
  onShare?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
  // Control which buttons to show
  showPin?: boolean;
  showFavorite?: boolean;
  showShare?: boolean;
  showDelete?: boolean;
  showEdit?: boolean;
  showView?: boolean;
}

const NoteCard: React.FC<NoteCardProps> = ({
  id,
  title,
  content,
  tags = [],
  sharedWith = [],
  getUserNames,

  isStarred,
  isShared,
  lastEdited,
  checked,
  onCheck,
  onPin,
  onFavorite,
  onShare,
  onDelete,
  onEdit,
  onView,
  showFavorite = true,
  showShare = true,
  showDelete = true,
  showEdit = true,
  showView = true,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 min-h-[180px] hover:ring-2 ring-blue-200 cursor-pointer relative">
      {onCheck && (
        <div className="absolute top-2 left-2 z-10">
          <input
            type="checkbox"
            checked={checked || false}
            onChange={(e) => {
              e.stopPropagation();
              onCheck(id);
            }}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>
      )}
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold text-lg truncate" title={title}>{title}</span>
        <div className="flex gap-2">
          {showFavorite && (
            <button title="Favorite" onClick={e => { e.stopPropagation(); onFavorite && onFavorite(id); }}>
              {isStarred ? <FaStar className="text-pink-500" /> : <FaRegStar className="text-gray-400" />}
            </button>
          )}
          {showShare && (
            <button title="Share" onClick={e => { e.stopPropagation(); onShare && onShare(id); }}>
              <FaShareAlt className="text-blue-500 hover:text-blue-700" />
            </button>
          )}
          {isShared && <FaUsers className="text-green-500" title="Shared" />}
          {showEdit && (
            <button title="Edit" onClick={e => { e.stopPropagation(); onEdit && onEdit(id); }}><FaEdit className="text-blue-400" /></button>
          )}
          {showDelete && (
            <button title="Delete" onClick={e => { e.stopPropagation(); onDelete && onDelete(id); }}><FaTrash className="text-red-400" /></button>
          )}
          {showView && (
            <button title="View Details" onClick={e => { e.stopPropagation(); onView && onView(id); }}>
              <FaEye className="text-gray-500 hover:text-blue-500" />
            </button>
          )}
        </div>
      </div>
      <div className="text-gray-600 text-sm line-clamp-2 mb-1">{content}</div>
      <div className="flex flex-wrap gap-1 mb-1">
        {tags.map(tag => (
          <span key={tag} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{tag}</span>
        ))}
      </div>
      <div className="flex items-center justify-between mt-auto">
        <div className="text-xs text-gray-400">Last edited: {lastEdited || "-"}</div>
        {sharedWith.length > 0 && getUserNames && (
          <CollaboratorsAvatars 
            collaborators={getUserNames(sharedWith)} 
            size="sm"
            maxDisplay={3}
          />
        )}
      </div>
    </div>
  );
};

export default NoteCard; 