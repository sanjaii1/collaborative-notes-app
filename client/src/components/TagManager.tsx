import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

interface Tag {
  name: string;
  count: number;
}

const initialTags: Tag[] = [
  { name: "Work", count: 8 },
  { name: "Personal", count: 5 },
  { name: "Finance", count: 2 },
  { name: "Planning", count: 3 },
];

const TagManager: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [adding, setAdding] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleAdd = () => {
    if (newTag.trim() && !tags.find(t => t.name === newTag.trim())) {
      setTags([...tags, { name: newTag.trim(), count: 0 }]);
      setNewTag("");
      setAdding(false);
    }
  };

  const handleEdit = (name: string) => {
    setTags(tags.map(t => t.name === name ? { ...t, name: editValue } : t));
    setEditing(null);
    setEditValue("");
  };

  const handleDelete = (name: string) => {
    setTags(tags.filter(t => t.name !== name));
  };

  const handleFilter = (name: string) => {
    alert(`Filter notes by tag: ${name}`);
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700">Tags</span>
        <button
          className="p-1 rounded hover:bg-blue-100 text-blue-600"
          onClick={() => setAdding(true)}
          title="Add Tag"
        >
          <FaPlus />
        </button>
      </div>
      <ul className="space-y-1">
        {tags.map(tag => (
          <li key={tag.name} className="flex items-center justify-between group">
            {editing === tag.name ? (
              <>
                <input
                  className="border rounded px-2 py-1 text-sm w-20"
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  autoFocus
                />
                <button className="ml-1 text-green-600 text-xs" onClick={() => handleEdit(tag.name)} title="Save">Save</button>
                <button className="ml-1 text-gray-400 text-xs" onClick={() => setEditing(null)} title="Cancel">Cancel</button>
              </>
            ) : (
              <>
                <button
                  className="flex-1 text-left text-gray-600 hover:text-blue-600 text-sm truncate"
                  onClick={() => handleFilter(tag.name)}
                  title={`Filter by ${tag.name}`}
                >
                  {tag.name}
                </button>
                <span className="ml-2 bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">{tag.count}</span>
                <button className="ml-1 text-gray-400 hover:text-blue-600" onClick={() => { setEditing(tag.name); setEditValue(tag.name); }} title="Edit">
                  <FaEdit size={12} />
                </button>
                <button className="ml-1 text-gray-400 hover:text-red-500" onClick={() => handleDelete(tag.name)} title="Delete">
                  <FaTrash size={12} />
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      {adding && (
        <div className="flex items-center mt-2">
          <input
            className="border rounded px-2 py-1 text-sm w-20"
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
            autoFocus
          />
          <button className="ml-1 text-green-600 text-xs" onClick={handleAdd}>Add</button>
          <button className="ml-1 text-gray-400 text-xs" onClick={() => { setAdding(false); setNewTag(""); }}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default TagManager; 