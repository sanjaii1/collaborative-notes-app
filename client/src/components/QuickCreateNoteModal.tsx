import React, { useState, useEffect } from "react";

interface QuickCreateNoteModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (note: { title: string; content: string; tags: string[] }) => void;
  initialData?: { title: string; content: string; tags: string[] };
  isEditing?: boolean;
}

const QuickCreateNoteModal: React.FC<QuickCreateNoteModalProps> = ({ open, onClose, onCreate, initialData, isEditing = false }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    if (initialData && isEditing) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setTags(initialData.tags.join(", "));
    } else {
      setTitle("");
      setContent("");
      setTags("");
    }
  }, [initialData, isEditing, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({ title, content, tags: tags.split(",").map(t => t.trim()).filter(Boolean) });
    if (!isEditing) {
      setTitle("");
      setContent("");
      setTags("");
    }
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">{isEditing ? "Edit Note" : "Create New Note"}</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="w-full border p-2 rounded"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full border p-2 rounded"
            placeholder="Content"
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={4}
            required
          />
          <input
            className="w-full border p-2 rounded"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={e => setTags(e.target.value)}
          />
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="px-4 py-2 rounded bg-gray-100 text-gray-700" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
              {isEditing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickCreateNoteModal; 