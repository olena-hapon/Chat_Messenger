import express, { Request, Response } from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Server } from "socket.io";
import axios from "axios";
import { Chat, ChatDocument } from "./models/chat.js";
import Message from "./models/message.js";
import { googleAuth } from "./middleware/googleAuth.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI || "";

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "http://localhost:5174",
  "https://chat-messenger-yiim.onrender.com",
  "https://chat-messenger-seven.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  allowedHeaders: ["Authorization", "Content-Type"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.options("*", cors({
  origin: allowedOrigins,
  credentials: true,
  allowedHeaders: ["Authorization", "Content-Type"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
  }
});

io.on("connection", (socket) => {
  console.log("Client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// --------- Mongo connection ---------
const connect = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Mongo connection error:", err);
  }
};

server.listen(PORT, () => {
  connect();
  console.log(`Server is running on port ${PORT}`);
});

// --------- Routes ---------
app.get("/", (req, res) => {
  res.status(200).send("Server is running.");
});

// Google Auth route
app.post("/auth/google", googleAuth, (req: any, res) => {
  res.json({ email: req.userEmail, name: req.userName });
});

// Auto-send message
app.post("/api/auto-send", async (req: Request, res: Response) => {
  try {
    const chats: ChatDocument[] = await Chat.find().exec();
    if (chats.length === 0) return res.status(400).send("No chats found");

    let content = "Бот не зміг отримати цитату";
    try {
      const quoteRes = await axios.get("https://zenquotes.io/api/random");
      const quoteData = quoteRes.data;
      if (Array.isArray(quoteData) && quoteData[0]?.q && quoteData[0]?.a) {
        content = `${quoteData[0].q} — ${quoteData[0].a}`;
      }
    } catch (err) {
      console.error("Error fetching quote:", err);
    }

    const randomChat = chats[Math.floor(Math.random() * chats.length)];
    if (!randomChat) return res.status(400).send("Invalid chat selected");

    const newMessage = new Message({
      chatId: randomChat._id,
      sender: "bot",
      text: content,
    });
    await newMessage.save();
    await Chat.findByIdAndUpdate(randomChat._id, { $push: { messages: newMessage._id } });

    io.emit("newMessage", {
      chatId: String(randomChat._id),
      chatName: `${randomChat.participant.firstName} ${randomChat.participant.lastName}`,
      message: newMessage.text,
    });

    res.status(200).send("Message sent");
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Internal server error");
  }
});

// Get all chats
app.get("/api/chats", googleAuth, async (req: any, res: Response) => {
  try {
    const userEmail = req.userEmail;
    const chats = await Chat.find({ userEmail })
      .populate({ path: "messages", options: { sort: { createdAt: -1 } } })
      .sort({ updatedAt: -1 });
    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get single chat
app.get("/api/chats/:id", googleAuth, async (req: any, res: Response) => {
  try {
    const userEmail = req.userEmail;
    const chat = await Chat.findOne({ _id: req.params.id, userEmail })
      .populate({ path: "messages", options: { sort: { createdAt: 1 } } });

    if (!chat) return res.status(404).json({ message: "Chat not found" });
    res.json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create chat
app.post("/api/chats", googleAuth, async (req: any, res: Response) => {
  try {
    const userEmail = req.userEmail;
    const { firstName, lastName } = req.body;

    const newChat = new Chat({ userEmail, participant: { firstName, lastName }, messages: [] });
    await newChat.save();

    setTimeout(async () => {
      try {
        const quoteRes = await axios.get("https://zenquotes.io/api/random");
        const data = quoteRes.data[0];
        const botMessage = new Message({
          chatId: newChat._id,
          sender: "bot",
          text: `${data.q} — ${data.a}`,
        });
        await botMessage.save();
        await Chat.findByIdAndUpdate(newChat._id, { $push: { messages: botMessage._id } });
      } catch (err) {
        console.error("Bot message failed:", err);
      }
    }, 3000);

    res.status(201).json(newChat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create chat" });
  }
});

// Send message
app.post("/api/chats/:chatId/messages", googleAuth, async (req: any, res: Response) => {
  try {
    const { chatId } = req.params;
    const { text } = req.body;
    const userEmail = req.userEmail;

    const chat = await Chat.findOne({ _id: chatId, userEmail });
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    const userMessage = new Message({ chatId, sender: "user", text });
    await userMessage.save();
    await Chat.findByIdAndUpdate(chatId, { $push: { messages: userMessage._id } });

    setTimeout(async () => {
      try {
        let quote = "";
        try {
          const quoteRes = await axios.get("https://zenquotes.io/api/random");
          const quoteData = quoteRes.data;
          if (Array.isArray(quoteData) && quoteData[0]?.q && quoteData[0]?.a) {
            quote = `${quoteData[0].q} — ${quoteData[0].a}`;
          }
        } catch {}

        const botMessage = new Message({ chatId, sender: "bot", text: quote });
        await botMessage.save();
        await Chat.findByIdAndUpdate(chatId, { $push: { messages: botMessage._id } });
      } catch (err) {
        console.error("Bot reply failed:", err);
      }
    }, 3000);

    res.status(201).json(userMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

// Update chat
app.put("/api/chats/:id", googleAuth, async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName } = req.body;
    const userEmail = req.userEmail;

    const chat = await Chat.findOneAndUpdate(
      { _id: id, userEmail },
      { participant: { firstName, lastName } },
      { new: true }
    );

    if (!chat) return res.status(404).json({ message: "Chat not found" });
    res.status(200).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete chat
app.delete("/api/chats/:id", googleAuth, async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const userEmail = req.userEmail;

    const chat = await Chat.findOneAndDelete({ _id: id, userEmail });
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    await Message.deleteMany({ chatId: chat._id });
    res.status(200).json({ message: "Chat deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});
