import React from "react";

export default function LogoHeader(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center mb-6">
      <div className="flex items-center justify-center">
        <span className="text-3xl font-extrabold text-blue-700 tracking-tight flex items-center">
          NoteNest
        </span>
      </div>
      <div className="text-blue-500 text-sm font-medium mt-1 text-center">
        Nest your thoughts. Collaborate freely.
      </div>
    </div>
  );
} 