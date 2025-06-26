import React, { useState, useRef } from "react";
import SearchSuggestions from "./SearchSuggestions";

const tags = ["Work", "Personal", "Finance", "Planning"];
const sortOptions = [
  { label: "Last Edited", value: "lastEdited" },
  { label: "Title (A–Z)", value: "title" },
  { label: "Recently Created", value: "created" },
];

const mockNotes = [
  { title: "Meeting Notes", content: "Discussed project timeline and deliverables...", tags: ["Work"] },
  { title: "Personal Journal", content: "Today I went to the park and read a book...", tags: ["Personal"] },
  { title: "Project Plan", content: "Outline project milestones and deliverables for Q2...", tags: ["Work", "Planning"] },
  { title: "Budget 2025", content: "Draft budget for next year, including all departments...", tags: ["Finance"] },
];

function getSuggestions(query: string) {
  if (!query) return { titles: [], content: [], tags: [] };
  const lower = query.toLowerCase();
  return {
    titles: mockNotes.filter(n => n.title.toLowerCase().includes(lower)).map(n => n.title),
    content: mockNotes.filter(n => n.content.toLowerCase().includes(lower)).map(n => n.content),
    tags: tags.filter(t => t.toLowerCase().includes(lower)),
  };
}

const NotesToolbar: React.FC = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sort, setSort] = useState(sortOptions[0].value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search
  const [debounced, setDebounced] = useState("");
  React.useEffect(() => {
    const handler = setTimeout(() => setDebounced(search), 200);
    return () => clearTimeout(handler);
  }, [search]);

  const suggestions = getSuggestions(debounced);

  const handleSelectSuggestion = (value: string, group: string) => {
    alert(`Selected: ${value} (${group})`);
    setShowSuggestions(false);
    setSearch(value);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-8 bg-white p-4 rounded-lg shadow relative">
      {/* Search Bar */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          className="border rounded px-3 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {showSuggestions && (
          <SearchSuggestions
            query={debounced}
            suggestions={suggestions}
            onSelect={handleSelectSuggestion}
          />
        )}
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        <button
          className={`px-3 py-2 rounded ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`px-3 py-2 rounded ${filter === "shared" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"}`}
          onClick={() => setFilter("shared")}
        >
          Shared
        </button>
        <button
          className={`px-3 py-2 rounded ${filter === "favorites" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"}`}
          onClick={() => setFilter("favorites")}
        >
          Favorites
        </button>
      </div>

      {/* Tags Dropdown */}
      <select
        className="border rounded px-3 py-2 bg-gray-50 text-gray-700"
        value={selectedTag || ""}
        onChange={(e) => setSelectedTag(e.target.value || null)}
      >
        <option value="">Tags</option>
        {tags.map((tag) => (
          <option key={tag} value={tag}>{tag}</option>
        ))}
      </select>

      {/* Date Range Picker Placeholder */}
      <button className="px-3 py-2 rounded bg-gray-100 text-gray-700 cursor-not-allowed" disabled>
        Date Range
      </button>

      {/* Sort Dropdown */}
      <select
        className="border rounded px-3 py-2 bg-gray-50 text-gray-700"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
};

export default NotesToolbar; 