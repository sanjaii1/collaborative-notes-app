// Notes
export const mockNotes = [
  {
    id: "1",
    title: "Meeting Notes",
    content: "Discussed project timeline and deliverables. Action items assigned to team members.",
    tags: ["Work"],
    sharedWith: ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"],
    isPinned: true,
    isFavorite: true,
    isShared: true,
  },
  {
    id: "2",
    title: "Personal Journal",
    content: "Today I went to the park and read a book. It was relaxing and peaceful.",
    tags: ["Personal"],
    sharedWith: [],
    isPinned: false,
    isFavorite: false,
    isShared: false,
  },
  {
    id: "3",
    title: "Project Plan",
    content: "Outline project milestones and deliverables for Q2. Assign responsibilities.",
    tags: ["Work", "Planning"],
    sharedWith: ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013", "507f1f77bcf86cd799439014"],
    isPinned: true,
    isFavorite: false,
    isShared: true,
  },
  {
    id: "4",
    title: "Budget 2025",
    content: "Draft budget for next year, including all departments and expected expenses.",
    tags: ["Finance"],
    sharedWith: ["507f1f77bcf86cd799439015", "507f1f77bcf86cd799439016"],
    isPinned: false,
    isFavorite: false,
    isShared: true,
  },
  {
    id: "5",
    title: "Grocery List",
    content: "Eggs, milk, bread, and more for the week.",
    tags: ["Personal"],
    sharedWith: [],
    isPinned: false,
    isFavorite: true,
    isShared: false,
  },
] as const;

// Tags
export const mockTags = [
  { name: "Work", count: 8 },
  { name: "Personal", count: 5 },
  { name: "Finance", count: 2 },
  { name: "Planning", count: 3 },
  { name: "Ideas", count: 4 },
  { name: "Urgent", count: 1 },
] as const;

// Activities
export const mockActivities = [
  { type: "edit", user: "You", note: "Meeting Notes", time: "2 mins ago" },
  { type: "comment", user: "Alex", note: "Project Plan", time: "10 mins ago" },
  { type: "share", user: "You", note: "Budget 2025", target: "John", time: "30 mins ago" },
  { type: "edit", user: "Sam", note: "Personal Journal", time: "1 hour ago" },
  { type: "delete", user: "You", note: "Old Invoice", time: "2 hours ago" },
  { type: "restore", user: "You", note: "Draft Budget", time: "yesterday" },
] as const;

// Shared Notes
export const mockSharedNotes = [
  {
    id: "1",
    title: "Project Plan",
    sharedBy: "Alex Johnson",
    time: "5 mins ago",
    sharedWith: ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"],
  },
  {
    id: "2",
    title: "Budget 2025",
    sharedBy: "John Smith",
    time: "1 hour ago",
    sharedWith: ["507f1f77bcf86cd799439015", "507f1f77bcf86cd799439016"],
  },
  {
    id: "3",
    title: "Team Goals",
    sharedBy: "Sam Wilson",
    time: "yesterday",
    sharedWith: ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439011", "507f1f77bcf86cd799439017"],
  },
] as const;

// Trash (Deleted Notes)
export const mockDeletedNotes = [
  { id: "10", title: "Old Meeting Notes", content: "Outdated project details...", deletedAt: "2024-05-01" },
  { id: "11", title: "Draft Budget", content: "Initial draft, not needed...", deletedAt: "2024-05-10" },
  { id: "12", title: "Invoice 2023", content: "Invoice for last year.", deletedAt: "2024-05-15" },
] as const; 