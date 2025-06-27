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
        <OverviewWidgets />
        <PinnedNotes />
        {/* <NotesToolbar /> */}
        <NotesList />

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

