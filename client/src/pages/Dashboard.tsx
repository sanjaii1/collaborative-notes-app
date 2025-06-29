import OverviewWidgets from "../components/OverviewWidgets";
import QuickCreateNoteModal from "../components/QuickCreateNoteModal";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../services/userApi";

import {
  fetchNotes,
  createNote,
  updateNote,
  // deleteNote
} from "../services/noteApi";
import { useEffect, useState } from "react";
import NoteCard from "../components/NoteCard";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import { getSocket } from "../services/socket";

export default function Dashboard(): React.JSX.Element {
  const [modalOpen, setModalOpen] = useState(false);

  const user = useAuthStore((state: any) => state.user);
  const queryClient = useQueryClient();

  
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    enabled: true,
  });

  const { data: notes = [], isLoading, error, refetch } = useQuery({
    queryKey: ["notes"],
    queryFn: fetchNotes,
  });



  useEffect(() => {
    if (user?._id) {
      getSocket()?.emit("join", user._id);
    }
  
    getSocket()?.on("refresh-notes", () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    });
  
    return () => {
      getSocket()?.off("refresh-notes");
    };
  }, [user?._id]);  

  const getUserNamesFromIds = (userIds: string[]): string[] => {
    return userIds.map(id => {
      const user = users.find(u => u.id === id);
      return user ? user.name : 'Unknown User';
    });
  };

  const handleCreateNote = async (note: { title: string; content: string; tags: string[] }) => {
    try {
      await createNote({ title: note.title, content: note.content, tags: note.tags });
      toast.success("Note created!");
      refetch(); 
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create note");
    }
  };


  const handleToggleFavorite = async (noteId: string, isStarred: boolean) => {
    try {
      await updateNote(noteId, { isStarred: !isStarred });
      toast.success(`Note ${!isStarred ? "starred" : "unstarred"}!`);
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update note");
    }
  };

  const starredNotes = notes.filter((note: any) => note.isStarred === true);
  const sharedNotes = notes.filter((note: any) => note.sharedWith && note.sharedWith.length > 0);

  const overviewStats = {
    totalNotes: notes.length,
    recentlyEdited: notes.filter((note: any) => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return new Date(note.updatedAt) > oneWeekAgo;
    }).length,
    sharedWithMe: notes.filter((note: any) => note.sharedWith && note.sharedWith.length > 0).length,
    favorites: notes.filter((note: any) => note.isStarred).length,
    trash: 0, 
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">Error loading dashboard data</div>;
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <main className="flex-1 p-2 sm:p-4 md:p-8 relative w-full max-w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2 sm:gap-0">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Dashboard Overview</h2>
          <button
            className="bg-blue-600 text-white px-4 sm:px-5 py-2 rounded font-semibold shadow hover:bg-blue-700 transition text-base sm:text-lg"
            onClick={() => setModalOpen(true)}
            title="Add Note"
          >
            + Add Note
          </button>
        </div>
        <OverviewWidgets stats={overviewStats} />

        <section className="mb-2">
          <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-700">Starred Notes</h3>
          {starredNotes.length === 0 ? (
            <div className="text-center text-gray-400 italic">No starred notes yet. Star important notes to see them here!</div>
          ) : (
            <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50">
              {starredNotes.map((note: any) => (
                <div key={note.id} className="min-w-[250px] sm:min-w-[300px] max-w-xs">
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
                    onFavorite={() => handleToggleFavorite(note.id, note.isStarred)}
                    showEdit={false}
                    showDelete={false}
                    showView={false}
                    showPin={false}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mb-2">
          <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-700">Shared With Me</h3>
          {sharedNotes.length === 0 ? (
            <div className="text-center text-gray-400 italic">No shared notes yet.</div>
          ) : (
            <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50">
              {sharedNotes.map((note: any) => (
                <div key={note.id} className="min-w-[250px] sm:min-w-[300px] max-w-xs">
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
                    showEdit={false}
                    showDelete={false}
                    showView={false}
                    showPin={false}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="flex justify-center my-2">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-full shadow-lg text-base sm:text-lg transition w-full max-w-xs sm:max-w-md"
            onClick={() => window.location.href = '/notes'}
          >
            View All Notes
          </button>
        </div>

        <QuickCreateNoteModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onCreate={handleCreateNote}
        />
      </main>

    </div>
  );
}

