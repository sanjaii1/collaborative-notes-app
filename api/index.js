// api/index.js (or app.js depending on your setup)
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {connectDB} from "./config/db.js";
import authRoutes from "./routes/auth.js";
import noteRoutes from "./routes/noteRoutes.js";
import userRoutes from "./routes/auth.js";


dotenv.config();
const app = express();

connectDB();
app.use(cors({
    origin: "http://localhost:5173", // or true for all origins (not recommended for production)
    credentials: true // if you use cookies
  }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
