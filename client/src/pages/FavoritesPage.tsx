import React, { useState, useMemo } from "react";
import { FaStar, FaTh, FaBars, FaSearch } from "react-icons/fa";
import NoteCard from "../components/NoteCard";
import NoteDetailModal from "../components/NoteDetailModal";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes, updateNote, deleteNote } from "../services/noteApi";
import { fetchUsers } from "../services/userApi";
import { toast } from "react-toastify";

const FavoritesPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const { data: notes = [], isLoading, refetch } = useQuery({
    queryKey: ['notes'],
    queryFn: fetchNotes,
  });
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const userMap = useMemo(() => {
    const map = new Map();
    users.forEach((user: any) => map.set(user.id, user.name));
    return map;
  }, [users]);
  const getUserNamesFromIds = (userIds: string[]) => userIds.map(id => userMap.get(id) || 'Unknown User');

  const favoriteNotes = useMemo(() => {
    return notes.filter((note: any) => note.isStarred || note.isFavorite);
  }, [notes]);

  const filteredNotes = useMemo(() => {
    if (!searchTerm) return favoriteNotes;
    return favoriteNotes.filter((note: any) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (note.tags && note.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  }, [favoriteNotes, searchTerm]);

  const handleViewNote = (noteId: string) => {
    const note = notes.find((n: any) => n.id === noteId);
    if (note) {
      setSelectedNote(note);
      setDetailModalOpen(true);
    }
  };
  const handleToggleFavorite = async (noteId: string) => {
    const note = notes.find((n: any) => n.id === noteId);
    if (!note) return;
    try {
      await updateNote(noteId, { isStarred: !note.isStarred });
      toast.success(note.isStarred ? "Removed from favorites!" : "Added to favorites!");
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update note");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800 flex items-center gap-2">
          <FaStar className="text-pink-500" /> Favorites
        </h2>
        <p className="text-gray-600">
          {favoriteNotes.length === 0
            ? "No favorite notes yet. Mark notes as favorite to see them here."
            : `${favoriteNotes.length} favorite note${favoriteNotes.length !== 1 ? 's' : ''} found.`}
        </p>
      </div>

      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search favorite notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-600'}`}
            title="Grid View"
          >
            <FaTh />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-600'}`}
            title="List View"
          >
            <FaBars />
          </button>
        </div>
      </div>

      {/* Notes Display */}
      {isLoading ? (
        <div className="text-center text-gray-400 italic">Loading favorite notes...</div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <FaStar className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">
            {searchTerm ? 'No notes found' : 'No favorite notes yet'}
          </h3>
          <p className="text-gray-400">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Mark notes as favorite to see them here.'}
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
          : 'space-y-4'}>
          {filteredNotes.map((note: any) => (
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
                onView={handleViewNote}
                showPin={false}
                showShare={false}
                showDelete={false}
                showEdit={false}
                showFavorite={true}
                showView={true}
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
    </div>
  );
};

export default FavoritesPage; 