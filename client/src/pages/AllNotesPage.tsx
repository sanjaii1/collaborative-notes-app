import React, { useState, useMemo } from "react";
import { FaStar, FaRegStar, FaTrash, FaEdit, FaUsers, FaTh, FaBars, FaEye, FaShareAlt } from "react-icons/fa";
import QuickCreateNoteModal from "../components/QuickCreateNoteModal";
import NoteDetailModal from "../components/NoteDetailModal";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes ,createNote, updateNote, deleteNote } from "../services/noteApi";
import { toast } from "react-toastify";


type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  collaborators: string[];
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
  const { data: notes = [], isLoading, error, refetch } = useQuery({
    queryKey: ["notes"],
    queryFn: fetchNotes,
  });
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(sortOptions[0].value);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);

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
    if (window.confirm(`Are you sure you want to delete "${note.title}"?`)) {
      try {
        await deleteNote(note.id);
        toast.success("Note deleted!");
        refetch();
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to delete note");
      }
    }
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
                    onClick={() => alert(`Share note: ${note.title}`)}
                  >
                    <FaShareAlt className="text-blue-500 hover:text-blue-700" />
                  </button>
                  {note.isShared && <FaUsers className="text-green-500" title="Shared" />}
                  <button title="Edit"><FaEdit className="text-blue-400" /></button>
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
              <div className="text-xs text-gray-400 mt-auto">Last edited: 2024-06-01</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="divide-y bg-white rounded-lg shadow">
          {filteredNotes.map((note: Note) => (
            <div
              key={note.id}
              className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:ring-2 ring-blue-200"
              onClick={() => { setSelectedNote(note); setDetailOpen(true); }}
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
              </div>
              <div className="flex gap-2 items-center">
                <button title="Favorite" onClick={() => handleToggleFavorite(note)}>{note.isStarred ? <FaStar className="text-pink-500" /> : <FaRegStar className="text-gray-400" />}</button>
                <button title="Share" onClick={() => alert(`Share note: ${note.title}`)}>
                  <FaShareAlt className="text-blue-500 hover:text-blue-700" />
                </button>
                <button title="Edit"><FaEdit className="text-blue-400" /></button>
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
      <NoteDetailModal
        open={detailOpen}
        note={selectedNote}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  );
};

export default AllNotesPage; 