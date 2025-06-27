import mongoose from "mongoose";

const sharedNoteSchema = new mongoose.Schema({
  note: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Note",
    required: true,
  },
  sharedWith: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  permissions: {
    type: String,
    enum: ["view", "edit"],
    default: "view",
  },
});

export const SharedNote = mongoose.model("SharedNote", sharedNoteSchema);
