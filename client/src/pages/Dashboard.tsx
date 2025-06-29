// import Sidebar from "../components/Sidebar";
import OverviewWidgets from "../components/OverviewWidgets";
// import PinnedNotes from "../components/PinnedNotes";
// import NotesToolbar from "../components/NotesToolbar";
// import NotesList from "../components/NotesList";
import QuickCreateNoteModal from "../components/QuickCreateNoteModal";
// import RecentActivityFeed from "../components/RecentActivityFeed";
// import CollaborationQuickAccess from "../components/CollaborationQuickAccess";
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
import { useSocket } from "../hook/useSocket";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import socket from "../services/socket";

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

  // useSocket("refresh-notes", () => {
  //   queryClient.invalidateQueries({ queryKey: ["notes"] });
  // });


  useEffect(() => {
    if (user?._id) {
      socket.emit("join", user._id);
    }
  
    socket.on("refresh-notes", () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    });
  
    return () => {
      socket.off("refresh-notes");
    };
  }, [user?._id]);  

  // Function to map user IDs to user names
  const getUserNamesFromIds = (userIds: string[]): string[] => {
    return userIds.map(id => {
      const user = users.find(u => u.id === id);
      return user ? user.name : 'Unknown User';
    });
  };

  const handleCreateNote = async (note: { title: string; content: string; tags: string[] }) => {
    try {
      // If your API expects tags, include them; otherwise, just title and content
      await createNote({ title: note.title, content: note.content, tags: note.tags });
      // Optionally, show a success toast and refresh notes
      toast.success("Note created!");
      refetch(); // Refetch notes after creating
    } catch (err: any) {
      // Optionally, show an error toast
      toast.error(err.response?.data?.message || "Failed to create note");
    }
  };

  // const handleTogglePin = async (noteId: string, isPinned: boolean) => {
  //   try {
  //     await updateNote(noteId, { isPinned: !isPinned });
  //     toast.success(`Note ${!isPinned ? 'pinned' : 'unpinned'}!`);
  //     refetch(); // Refetch notes after updating
  //   } catch (err: any) {
  //     toast.error(err.response?.data?.message || "Failed to update note");
  //   }
  // };

  // Add this function to handle toggling favorite/starred status
  const handleToggleFavorite = async (noteId: string, isStarred: boolean) => {
    try {
      await updateNote(noteId, { isStarred: !isStarred });
      toast.success(`Note ${!isStarred ? "starred" : "unstarred"}!`);
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update note");
    }
  };

  // Filter starred and shared notes from the real data
  const starredNotes = notes.filter((note: any) => note.isStarred === true);
  const sharedNotes = notes.filter((note: any) => note.sharedWith && note.sharedWith.length > 0);

  // Calculate overview statistics from real data
  const overviewStats = {
    totalNotes: notes.length,
    recentlyEdited: notes.filter((note: any) => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return new Date(note.updatedAt) > oneWeekAgo;
    }).length,
    sharedWithMe: notes.filter((note: any) => note.sharedWith && note.sharedWith.length > 0).length,
    favorites: notes.filter((note: any) => note.isStarred).length,
    trash: 0, // This would need to be fetched separately if you have a trash system
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">Error loading dashboard data</div>;
  }

  return (
    <div className="flex  bg-gray-50">
      {/* <Sidebar /> */}
      <main className="flex-1 p-8 relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded font-semibold shadow hover:bg-blue-700 transition"
            onClick={() => setModalOpen(true)}
            title="Add Note"
          >
            + Add Note
          </button>
        </div>
        <OverviewWidgets stats={overviewStats} />

        {/* Starred Notes Section */}
        <section className="mb-2">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Starred Notes</h3>
          {starredNotes.length === 0 ? (
            <div className="text-center text-gray-400 italic">No starred notes yet. Star important notes to see them here!</div>
          ) : (
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {starredNotes.map((note: any) => (
                <div key={note.id} className="min-w-[300px] max-w-xs">
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
                    // Optionally add onPin, onShare, onDelete, onEdit, onView handlers as needed
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

        {/* Shared Notes Section */}
        <section className="mb-2">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Shared With Me</h3>
          {sharedNotes.length === 0 ? (
            <div className="text-center text-gray-400 italic">No shared notes yet.</div>
          ) : (
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {sharedNotes.map((note: any) => (
                <div key={note.id} className="min-w-[300px] max-w-xs">
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

        {/* Centered View All Notes Button */}
        <div className="flex justify-center my-2">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg text-lg transition"
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
      {/* <div className="hidden lg:flex flex-col gap-6 w-80 ml-6">
        <RecentActivityFeed />
        <CollaborationQuickAccess />
      </div> */}
    </div>
  );
}

