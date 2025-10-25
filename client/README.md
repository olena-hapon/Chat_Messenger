# Chat Application (Frontend)

This is the frontend of the chat application that communicates with the backend to handle chats, messages, and auto-responses. The frontend is built with React, and the UI is custom-built without using any UI libraries (only HTML/CSS).

## Features Implemented

- **Predefined Chats**: Three predefined chats are available when the app starts.
- **Create New Chat**: Allows users to create new chats by providing first and last names.
- **Update Existing Chat**: Allows users to update the first and last names of an existing chat.
- **Delete Existing Chat**: Chats can be deleted with a confirmation prompt before removal.
- **Send Message**: Messages can be sent from the user, and the backend responds with an auto-generated quote after 3 seconds.
- **Auto-Response with Quote**: The backend sends an auto-response using random quotes from the Zenquotes.io.
- **Toast Notification**: Toast notifications are displayed when a new message is received.
- **Search Chats**: Users can search through existing chats.
- **Login with Gmail**: Users can log in using Gmail authentication.
- **Live Socket Connection**: Allows automatic sending of messages to a random chat and displays notifications for those messages.

## Technologies Used

- **Frontend**: React (JS), HTML, CSS, Axios
- **Authentication**: Clerk for login with Gmail
- **Backend Communication**: React Query for making API requests to the backend
- **Socket Connection**: Socket.IO for live communication with the backend

## Setup Instructions

1. Clone the repository.
2. Install dependencies:
   bash
   npm install
   npm dev

   Live Demo
Link to the deployed frontend

How it Works
On the main page, you can view predefined chats, or create a new one by providing first and last names.

Clicking on a chat will display the chat window, where messages can be sent.

After sending a message, the backend will automatically reply with a random quote after 3 seconds.

Toast notifications are shown for new messages and updates.

The live socket connection allows for automatic message sending in random chats, and you can turn this on via a button.

You can search through the list of chats using the search bar.

When deleting a chat, a confirmation prompt will appear to prevent accidental deletion.
