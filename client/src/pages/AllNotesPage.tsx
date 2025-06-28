import React, { useState, useMemo } from "react";
import { FaStar, FaRegStar, FaTrash, FaEdit, FaUsers, FaTh, FaBars, FaEye, FaShareAlt } from "react-icons/fa";
import QuickCreateNoteModal from "../components/QuickCreateNoteModal";
import NoteDetailModal from "../components/NoteDetailModal";
import CollaboratorsAvatars from "../components/CollaboratorsAvatars";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes ,createNote, updateNote, deleteNote } from "../services/noteApi";
import { toast } from "react-toastify";
import { fetchUsers } from "../services/userApi";
import { shareNote as shareNoteApi } from "../services/noteApi";
import { useAuthStore } from "../store/authStore";
import UserInitials from "../components/UserInitials";

type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  sharedWith: string[];
  isPinned: boolean;
  isStarred: boolean;
  isFavorite: boolean;
  isShared: boolean;
};

const sortOptions = [
  { label: "Last Edited", value: "lastEdited" },
  { label: "Recently Created", value: "created" },
  { label: "Title (A-Z)", value: "titleAZ" },
  { label: "Title (Z-A)", value: "titleZA" },
  { label: "Favorites First", value: "favorites" },
];

const AllNotesPage: React.FC = () => {

  const { data: notes = [], refetch } = useQuery({
    queryKey: ["notes"],
    queryFn: fetchNotes,
  });
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(sortOptions[0].value);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<Note | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [noteToShare, setNoteToShare] = useState<Note | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);


  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    enabled: true,
  });

  // Function to map user IDs to user names
  const getUserNamesFromIds = (userIds: string[]): string[] => {
    return userIds.map(id => {
      const user = users.find(u => u.id === id);
      return user ? user.name : 'Unknown User';
    });
  };

  // Function to get current user's name
  // const getCurrentUserName = (): string => {
  //   const currentUser = useAuthStore.getState().user;
  //   return currentUser?.name || 'You';
  // };

  const filteredNotes = useMemo(() => {
    let filtered = [...notes];
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        n =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.tags.some((tag: string) => tag.toLowerCase().includes(q))
      );
    }
    switch (sort) {
      case "titleAZ":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "titleZA":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "favorites":
        filtered.sort((a, b) => (b.isStarred ? 1 : 0) - (a.isStarred ? 1 : 0));
        break;
      // Add more sort logic as needed
      default:
        break;
    }
    return filtered;
  }, [notes, search, sort]);

  const handleCreateNote = async (note: { title: string; content: string; tags: string[] }) => {
    try {
      await createNote({ title: note.title, content: note.content, tags: note.tags });
      toast.success("Note created!");
      refetch()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create note");
    }
  };

  const handleToggleFavorite = async (note: Note) => {
    try {
      await updateNote(note.id, { isStarred: !note.isStarred });
      toast.success(`Note ${!note.isStarred ? "starred" : "unstarred"}!`);
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update note");
    }
  };

  const handleDeleteNote = async (note: Note) => {
    setNoteToDelete(note);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!noteToDelete) return;
    
    try {
      await deleteNote(noteToDelete.id);
      toast.success("Note deleted!");
      refetch();
      setDeleteModalOpen(false);
      setNoteToDelete(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete note");
    }
  };

  const handleEditNote = (note: Note) => {
    setNoteToEdit(note);
    setEditModalOpen(true);
  };

  const handleUpdateNote = async (noteData: { title: string; content: string; tags: string[] }) => {
    if (!noteToEdit) return;
    
    try {
      await updateNote(noteToEdit.id, noteData);
      toast.success("Note updated!");
      refetch();
      setEditModalOpen(false);
      setNoteToEdit(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update note");
    }
  };

  const handleShareNote = (note: Note) => {
    setNoteToShare(note);
    setShareModalOpen(true);
    setSelectedUsers([]);
  };

  const handleConfirmShare = async () => {
    if (!noteToShare || selectedUsers.length === 0) return;
  
    try {
      await shareNoteApi(noteToShare.id, selectedUsers);
      toast.success(`Note shared with ${selectedUsers.length} user(s)!`);
      setShareModalOpen(false);
      setNoteToShare(null);
      setSelectedUsers([]);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to share note");
    }
  };

  const toggleUserSelection = (userId: string) => {
    // Don't allow selecting the current user
    if (userId === useAuthStore.getState().user?.id) {
      return;
    }
    
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Notes</h2>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded px-3 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select
            className="border rounded px-3 py-2 bg-gray-50 text-gray-700"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button
            className={`p-2 rounded ${view === "grid" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"}`}
            onClick={() => setView("grid")}
            title="Grid view"
          >
            <FaTh />
          </button>
          <button
            className={`p-2 rounded ${view === "list" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"}`}
            onClick={() => setView("list")}
            title="List view"
          >
            <FaBars />
          </button>
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded font-semibold shadow hover:bg-blue-700 transition ml-2"
            onClick={() => setModalOpen(true)}
            title="Add Note"
          >
            + Add Note
          </button>
        </div>
      </div>
      {filteredNotes.length === 0 ? (
        <div className="text-center text-gray-400 italic mt-12">No notes found.</div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredNotes.map((note: Note) => (
            <div
              key={note.id}
              className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 cursor-pointer hover:ring-2 ring-blue-200"
              // onClick={() => { setSelectedNote(note); setDetailOpen(true); }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-lg truncate" title={note.title}>{note.title}</span>
                <div className="flex gap-2">
                  <button title="Favorite" onClick={() => handleToggleFavorite(note)}>{note.isStarred ? <FaStar className="text-pink-500" /> : <FaRegStar className="text-gray-400" />}</button>
                  <button
                    title="Share"
                    onClick={() => handleShareNote(note)}
                  >
                    <FaShareAlt className="text-blue-500 hover:text-blue-700" />
                  </button>
                  {note.isShared && <FaUsers className="text-green-500" title="Shared" />}
                  <button title="Edit" onClick={() => handleEditNote(note)}><FaEdit className="text-blue-400" /></button>
                  <button title="Delete" onClick={() => handleDeleteNote(note)}><FaTrash className="text-red-400" /></button>

                  <button
                    title="View Details"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNote(note);
                      setDetailOpen(true);
                    }}
                  >
                    <FaEye className="text-gray-500 hover:text-blue-500" />
                  </button>
                </div>
              </div>
              <div className="text-gray-600 text-sm line-clamp-2 mb-1">{note.content}</div>
              <div className="flex flex-wrap gap-1 mb-1">
                {note.tags.map(tag => (
                  <span key={tag} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
              <div className="flex items-center justify-between mt-auto">
                <div className="text-xs text-gray-400">Last edited: 2024-06-01</div>
                {note.sharedWith && note.sharedWith.length > 0 && (
                  <CollaboratorsAvatars 
                    collaborators={getUserNamesFromIds(note.sharedWith)} 
                    size="sm"
                    maxDisplay={3}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="divide-y bg-white rounded-lg shadow">
          {filteredNotes.map((note: Note) => (
            <div
              key={note.id}
              className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:ring-2 ring-blue-200"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold truncate" title={note.title}>{note.title}</span>
                  {note.isShared && <FaUsers className="text-green-500" title="Shared" />}
                  {note.isStarred && <FaStar className="text-pink-500" />}
                </div>
                <div className="text-gray-600 text-sm truncate">{note.content}</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {note.tags.map(tag => (
                    <span key={tag} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
                {note.sharedWith && note.sharedWith.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">Collaborators:</span>
                    <CollaboratorsAvatars 
                      collaborators={getUserNamesFromIds(note.sharedWith)} 
                      size="sm"
                      maxDisplay={3}
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-2 items-center">
                <button title="Favorite" onClick={() => handleToggleFavorite(note)}>{note.isStarred ? <FaStar className="text-pink-500" /> : <FaRegStar className="text-gray-400" />}</button>
                <button title="Share" onClick={() => handleShareNote(note)}>
                  <FaShareAlt className="text-blue-500 hover:text-blue-700" />
                </button>
                <button title="Edit" onClick={() => handleEditNote(note)}><FaEdit className="text-blue-400" /></button>
                <button title="Delete" onClick={() => handleDeleteNote(note)}><FaTrash className="text-red-400" /></button>
                <button
                  title="View Details"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNote(note);
                    setDetailOpen(true);
                  }}
                >
                  <FaEye className="text-gray-500 hover:text-blue-500" />
                </button>
              </div>
              <div className="text-xs text-gray-400 ml-4">Last edited: 2024-06-01</div>
            </div>
          ))}
        </div>
      )}
      <QuickCreateNoteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateNote}
      />
      <QuickCreateNoteModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setNoteToEdit(null);
        }}
        onCreate={handleUpdateNote}
        initialData={noteToEdit ? {
          title: noteToEdit.title,
          content: noteToEdit.content,
          tags: noteToEdit.tags
        } : undefined}
        isEditing={true}
      />
      <NoteDetailModal
        open={detailOpen}
        note={selectedNote}
        onClose={() => setDetailOpen(false)}
      />
      
      {/* Delete Confirmation Modal */}
      {deleteModalOpen && noteToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm overflow-hidden">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Delete Note</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{noteToDelete.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setNoteToDelete(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Share Modal */}
      {shareModalOpen && noteToShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm overflow-hidden">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Share Note</h3>
            <p className="text-gray-600 mb-4">
              Share "{noteToShare.title}" with:
            </p>
            <div className="space-y-2 mb-6 max-h-48 overflow-y-auto">
              {users.map(user => {
                const isCurrentUser = user.id === useAuthStore.getState().user?.id;
                return (
                  <label key={user.id} className={`flex items-center gap-3 p-2 rounded cursor-pointer ${isCurrentUser ? 'bg-gray-50 opacity-60' : 'hover:bg-gray-50'}`}>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      className="rounded"
                      disabled={isCurrentUser}
                    />
                    <div className="flex items-center gap-2">
                      <UserInitials name={user.name} size="sm" />
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {user.name}
                          {isCurrentUser && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">You</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        {isCurrentUser && (
                          <div className="text-xs text-gray-400 mt-1">Cannot share with yourself</div>
                        )}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
                onClick={() => {
                  setShareModalOpen(false);
                  setNoteToShare(null);
                  setSelectedUsers([]);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                onClick={handleConfirmShare}
                disabled={selectedUsers.length === 0}
              >
                Share ({selectedUsers.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllNotesPage; 