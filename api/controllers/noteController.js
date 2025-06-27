// api/controllers/noteController.js
import { Note } from "../models/noteModel.js";

export const getNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user.id }).sort({ updatedAt: -1 });
  res.json(notes);
};

export const createNote = async (req, res) => {
  const { title, content,tags } = req.body;
  if (!title || !content) return res.status(400).json({ message: "Missing fields" });

  const note = await Note.create({ user: req.user.id, title, content, tags });
  res.status(201).json(note);
};

export const updateNote = async (req, res) => {
  const { title, content } = req.body;
  const note = await Note.findById(req.params.id);

  if (!note || note.user.toString() !== req.user.id) return res.status(404).json({ message: "Not found" });

  note.title = title;
  note.content = content;
  await note.save();

  res.json(note);
};

export const deleteNote = async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note || note.user.toString() !== req.user.id) return res.status(404).json({ message: "Not found" });

  await note.remove();
  res.json({ message: "Note deleted" });
};
