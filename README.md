# Chat Messenger (Frontend)

This is the **frontend** of the Chat Messenger application — a real-time chat platform that allows users to communicate, manage chats, and receive automated responses.  
The frontend is built with **React**, using **custom HTML/CSS** (no UI libraries).

---

## Features

- **Google Authentication** — Users can log in securely via Google.  
- **Predefined Chats** — Three default chats are available when the app starts.  
- **Create New Chat** — Add new chats by providing first and last names.  
- **Edit Chat Info** — Update existing chat details (first name and last name).  
- **Delete Chat** — Remove chats with a confirmation prompt to prevent mistakes.  
- **Send Messages** — Users can send messages within any chat.  
- **Auto-Response (Quotes)** — The backend sends an automated reply after 3 seconds, using random quotes from **ZenQuotes.io**.  
- **Toast Notifications** — Notifications appear for new or updated messages.  
- **Search Chats** — Quickly search through all available chats.  
- **Live Socket Connection** — Enables real-time message updates and random auto-messages via **Socket.IO**.

---

## Technologies Used

### Frontend
- **React (JS)**
- **HTML / CSS** — Custom styling, no UI libraries
- **React Query** — For efficient API data fetching and caching
- **Socket.IO Client** — For live chat updates
- **Google OAuth** — Authentication with Google accounts

### Backend (connected service)
- **Express.js**
- **MongoDB (Atlas)**
- **Socket.IO**
- **ZenQuotes API** for random quote responses

---

## Live Demo
🔗 **Frontend:** [https://chat-messenger-seven.vercel.app](https://chat-messenger-seven.vercel.app)  
🔗 **Backend:** [https://chat-messenger-yiim.onrender.com](https://chat-messenger-yiim.onrender.com)

---

## How It Works

1. **Login with Google** to enter the app.  
2. You’ll see a list of existing chats (three predefined).  
3. You can **create**, **edit**, or **delete** any chat.  
4. Open a chat and start messaging — the **server will reply automatically** after 3 seconds with a random quote.  
5. When Socket mode is enabled, random chats receive live messages instantly.
