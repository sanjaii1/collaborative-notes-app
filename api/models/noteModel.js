// api/models/noteModel.js
import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    isStarred: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    id: {
      type: String,
      default: function() {
        return this._id.toString();
      }
    },
    
  },
  { timestamps: true }
);


export const Note = mongoose.model("Note", noteSchema);
 