import React, { useState, useMemo } from "react";
import { FaStar, FaRegStar, FaTrash, FaEdit, FaUsers, FaTh, FaBars, FaEye, FaShareAlt, FaSearch } from "react-icons/fa";
import NoteCard from "../components/NoteCard";
import NoteDetailModal from "../components/NoteDetailModal";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes, updateNote, deleteNote } from "../services/noteApi";
import { fetchUsers } from "../services/userApi";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/authStore";

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
  user: string;
  updatedAt: string;
};

const SharedPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<Note | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const currentUser = useAuthStore((state: any) => state.user);

  // Fetch all notes (including shared ones)
  const { data: notes = [], isLoading, refetch } = useQuery({
    queryKey: ['notes'],
    queryFn: fetchNotes,
  });

  console.log(notes,"asjdhskhkah")

  // Fetch users for displaying names
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  // Filter to only show shared notes (notes shared with current user or shared by current user)
  const sharedNotes = useMemo(() => {
    if (!currentUser) return [];
    
    return notes.filter((note: Note) => {
      // Notes shared with current user
      const isSharedWithMe = note.sharedWith && note.sharedWith.includes(currentUser.id);
      // Notes shared by current user (but not owned by current user)
      const isSharedByMe = note.user !== currentUser.id && note.sharedWith && note.sharedWith.length > 0;
      
      return isSharedWithMe || isSharedByMe;
    });
  }, [notes, currentUser]);

  // Filter notes based on search term
  const filteredNotes = useMemo(() => {
    if (!searchTerm) return sharedNotes;
    
    return sharedNotes.filter((note: Note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [sharedNotes, searchTerm]);

  // Create a map of user IDs to names
  const userMap = useMemo(() => {
    const map = new Map();
    users.forEach(user => map.set(user.id, user.name));
    return map;
  }, [users]);

  // Function to get user names from IDs
  const getUserNamesFromIds = (userIds: string[]): string[] => {
    return userIds.map(id => userMap.get(id) || 'Unknown User');
  };

  // Handle note actions
  const handleViewNote = (noteId: string) => {
    const note = notes.find((n: Note) => n.id === noteId);
    if (note) {
      setSelectedNote(note);
      setDetailModalOpen(true);
    }
  };

  const handleEditNote = (noteId: string) => {
    const note = notes.find((n: Note) => n.id === noteId);
    if (note) {
      setNoteToEdit(note);
      setEditModalOpen(true);
    }
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

  const handleDeleteNote = (noteId: string) => {
    const note = notes.find((n: Note) => n.id === noteId);
    if (note) {
      setNoteToDelete(note);
      setDeleteModalOpen(true);
    }
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

  const handleToggleFavorite = async (noteId: string) => {
    const note = notes.find((n: Note) => n.id === noteId);
    if (!note) return;

    try {
      await updateNote(noteId, { isStarred: !note.isStarred });
      toast.success(note.isStarred ? "Removed from favorites!" : "Added to favorites!");
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update note");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Shared Notes</h2>
        <p className="text-gray-600">
          {sharedNotes.length === 0 
            ? "No shared notes yet. Notes shared with you or by you will appear here."
            : `${sharedNotes.length} shared note${sharedNotes.length !== 1 ? 's' : ''} found.`
          }
        </p>
      </div>

      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search shared notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
            title="Grid View"
          >
            <FaTh />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
            title="List View"
          >
            <FaBars />
          </button>
        </div>
      </div>

      {/* Notes Display */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <FaUsers className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">
            {searchTerm ? 'No notes found' : 'No shared notes yet'}
          </h3>
          <p className="text-gray-400">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Notes shared with you or by you will appear here'
            }
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
          : 'space-y-4'
        }>
          {filteredNotes.map((note: Note) => (
            <div key={note.id} className={viewMode === 'list' ? 'w-full' : ''}>
              <NoteCard
                id={note.id}
                title={note.title}
                content={note.content}
                tags={note.tags}
                sharedWith={note.sharedWith}
                getUserNames={getUserNamesFromIds}
                isPinned={note.isPinned}
                isStarred={note.isStarred}
                isShared={note.sharedWith && note.sharedWith.length > 0}
                lastEdited={note.updatedAt ? new Date(note.updatedAt).toISOString().split('T')[0] : undefined}
                onFavorite={handleToggleFavorite}
                onDelete={handleDeleteNote}
                onEdit={handleEditNote}
                onView={handleViewNote}
                showPin={false}
                showShare={false}
              />
            </div>
          ))}
        </div>
      )}

      {/* Note Detail Modal */}
      {selectedNote && (
        <NoteDetailModal
          note={selectedNote}
          open={detailModalOpen}
          onClose={() => {
            setDetailModalOpen(false);
            setSelectedNote(null);
          }}
        />
      )}

      {/* Edit Modal */}
      {noteToEdit && (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${editModalOpen ? '' : 'hidden'}`}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Edit Note</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleUpdateNote({
                title: formData.get('title') as string,
                content: formData.get('content') as string,
                tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()).filter(Boolean)
              });
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={noteToEdit.title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  name="content"
                  defaultValue={noteToEdit.content}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  name="tags"
                  defaultValue={noteToEdit.tags.join(', ')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditModalOpen(false);
                    setNoteToEdit(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Note</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{noteToDelete?.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setNoteToDelete(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharedPage; 