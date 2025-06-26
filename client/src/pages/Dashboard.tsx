import Sidebar from "../components/Sidebar";
import OverviewWidgets from "../components/OverviewWidgets";
import PinnedNotes from "../components/PinnedNotes";
import NotesToolbar from "../components/NotesToolbar";
import NotesList from "../components/NotesList";
import QuickCreateNoteModal from "../components/QuickCreateNoteModal";
import RecentActivityFeed from "../components/RecentActivityFeed";
import CollaborationQuickAccess from "../components/CollaborationQuickAccess";
import { useState } from "react";

export default function Dashboard(): React.JSX.Element {
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreateNote = (note: { title: string; content: string; tags: string[] }) => {
    alert(`Created note: ${note.title}`);
    // Here you would add the note to your state or refetch notes
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8 relative">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Dashboard Overview</h2>
        <OverviewWidgets />
        <PinnedNotes />
        <NotesToolbar />
        <NotesList />
        <button
          className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl shadow-lg hover:bg-blue-700 transition z-50"
          onClick={() => setModalOpen(true)}
          title="Create New Note"
        >
          +
        </button>
        <QuickCreateNoteModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onCreate={handleCreateNote}
        />
      </main>
      <div className="hidden lg:flex flex-col gap-6 w-80 ml-6">
        <RecentActivityFeed />
        <CollaborationQuickAccess />
      </div>
    </div>
  );
}

