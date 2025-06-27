import React from "react";

interface Suggestions {
  titles: string[];
  content: string[];
  tags: string[];
}

interface SearchSuggestionsProps {
  query: string;
  suggestions: Suggestions;
  onSelect: (value: string, group: keyof Suggestions) => void;
}

function highlight(text: string, query: string) {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={i} className="bg-yellow-200 font-semibold">{part}</span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ query, suggestions, onSelect }) => {
  if (!query || (!suggestions.titles.length && !suggestions.content.length && !suggestions.tags.length)) {
    return null;
  }
  return (
    <div className="absolute z-40 mt-1 w-64 bg-white border rounded shadow-lg max-h-72 overflow-y-auto">
      {Object.entries(suggestions).map(([group, items]) =>
        items.length > 0 ? (
          <div key={group}>
            <div className="px-3 py-1 text-xs text-gray-400 uppercase bg-gray-50">{group}</div>
            {items.map((item: string, idx: number) => (
              <button
                key={item + idx}
                className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm"
                onClick={() => onSelect(item, group as keyof Suggestions)}
              >
                {highlight(item, query)}
              </button>
            ))}
          </div>
        ) : null
      )}
    </div>
  );
};

export default SearchSuggestions; 