import React, { useState, useMemo } from "react";
import { FaTags, FaSearch, FaStickyNote } from "react-icons/fa";
import NoteCard from "../components/NoteCard";
import NoteDetailModal from "../components/NoteDetailModal";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../services/noteApi";
import { fetchUsers } from "../services/userApi";

const TagsPage: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [tagSearch, setTagSearch] = useState("");
  const [noteSearch, setNoteSearch] = useState("");
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: fetchNotes,
  });
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const userMap = useMemo(() => {
    const map = new Map();
    users.forEach((user: any) => map.set(user.id, user.name));
    return map;
  }, [users]);
  const getUserNamesFromIds = (userIds: string[]) => userIds.map(id => userMap.get(id) || 'Unknown User');

  const tagsWithCounts = useMemo(() => {
    const tagMap: Record<string, number> = {};
    notes.forEach((note: any) => {
      (note.tags || []).forEach((tag: string) => {
        tagMap[tag] = (tagMap[tag] || 0) + 1;
      });
    });
    return Object.entries(tagMap)
      .map(([tag, count]) => ({ tag, count }))
      .filter(({ tag }) => tag.toLowerCase().includes(tagSearch.toLowerCase()));
  }, [notes, tagSearch]);

  const filteredNotes = useMemo(() => {
    let filtered = notes;
    if (selectedTag) {
      filtered = filtered.filter((note: any) => note.tags && note.tags.includes(selectedTag));
    }
    if (noteSearch) {
      filtered = filtered.filter((note: any) =>
        note.title.toLowerCase().includes(noteSearch.toLowerCase()) ||
        note.content.toLowerCase().includes(noteSearch.toLowerCase())
      );
    }
    return filtered;
  }, [notes, selectedTag, noteSearch]);

  const handleViewNote = (noteId: string) => {
    const note = notes.find((n: any) => n.id === noteId);
    if (note) {
      setSelectedNote(note);
      setDetailModalOpen(true);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800 flex items-center gap-2">
          <FaTags className="text-blue-500" /> Tags
        </h2>
        <p className="text-gray-600">Manage and filter your notes by tags here.</p>
      </div>

      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
          <div className="relative w-full sm:w-72">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tags..."
              value={tagSearch}
              onChange={e => setTagSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {tagsWithCounts.length === 0 ? (
            <span className="text-gray-400 italic">No tags found.</span>
          ) : (
            tagsWithCounts.map(({ tag, count }) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition flex items-center gap-2 cursor-pointer ${
                  tag === selectedTag
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-100"
                }`}
              >
                <FaStickyNote />
                {tag}
                <span className="ml-1 bg-white/30 rounded-full px-2 py-0.5 text-xs font-semibold">
                  {count}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:w-96">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={selectedTag ? `Search notes with '${selectedTag}'...` : "Search notes..."}
            value={noteSearch}
            onChange={e => setNoteSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-400 italic">Loading notes...</div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <FaStickyNote className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">
            {selectedTag ? `No notes found for '${selectedTag}'` : 'No notes found'}
          </h3>
          <p className="text-gray-400">
            {selectedTag
              ? 'Try selecting another tag or clearing your search.'
              : 'Try creating a note or adjusting your search.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredNotes.map((note: any) => (
            <NoteCard
              key={note.id}
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
              onView={handleViewNote}
              showPin={false}
              showShare={false}
              showEdit={false}
              showDelete={false}
              showFavorite={false}
            />
          ))}
        </div>
      )}

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

export default TagsPage; 