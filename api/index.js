// api/index.js (or app.js depending on your setup)
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import noteRoutes from "./routes/noteRoutes.js";
import userRoutes from "./routes/auth.js";

dotenv.config();
connectDB();

const app = express();


const server = http.createServer(app); // create HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.use(cors({
    origin: "http://localhost:5173", // or true for all origins (not recommended for production)
    credentials: true // if you use cookies
  }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/users", userRoutes);
app.set("io", io);



io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    socket.join(userId); // Join user-specific room
    console.log(`User ${userId} connected to socket`);
  }

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
