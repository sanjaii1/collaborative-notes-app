// api/controllers/noteController.js
import {Note} from "../models/noteModel.js";

export const getNotes = async (req, res) => {
  const notes = await Note.find({
    $or: [
      { user: req.user.id },
      { sharedWith: req.user.id }
    ]
  }).sort({ updatedAt: -1 });
  res.json(notes);
};

export const createNote = async (req, res) => {
  const { title, content,tags } = req.body;
  if (!title || !content) return res.status(400).json({ message: "Missing fields" });

  const note = await Note.create({ user: req.user.id, title, content, tags });
  res.status(201).json(note);
};

export const updateNote = async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note || note.user.toString() !== req.user.id) return res.status(404).json({ message: "Not found" });

  Object.keys(req.body).forEach(key => {
    if (note.schema.paths[key]) {
      note[key] = req.body[key];
    }
  });
  
  await note.save();

  res.json(note);
};

export const deleteNote = async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note || note.user.toString() !== req.user.id) return res.status(404).json({ message: "Not found" });

  await Note.deleteOne({ _id: req.params.id });
  res.json({ message: "Note deleted" });
};


export const shareNote = async (req, res) => {
  const { userIds } = req.body; // array of user IDs to share with
  const note = await Note.findById(req.params.id);

  if (!note || note.user.toString() !== req.user.id) {
    return res.status(404).json({ message: "Not found" });
  }

  note.sharedWith = userIds;
  await note.save();

  res.json({ message: "Note shared", sharedWith: note.sharedWith });
};