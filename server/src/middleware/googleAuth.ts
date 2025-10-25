import { Request, Response, NextFunction } from 'express';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import dotenv from 'dotenv';
import User from '../models/user.js';
import { Chat } from '../models/chat.js';
import Message from '../models/message.js';

dotenv.config();

const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

interface AuthRequest extends Request {
  userEmail?: string;
  userName?: string;
}

export const googleAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const ticket = await client.verifyIdToken({ idToken: token });
    const payload = ticket.getPayload() as TokenPayload | undefined;

    if (!payload?.email) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    let user = await User.findOne({ email: payload.email });
    if (!user) {
      // Створюємо користувача
      user = new User({
        email: payload.email,
        name: payload.name || '',
        avatar: payload.picture || '',
      });
      await user.save();

      // Seed 3 чатів для нового користувача
      const participants = [
        { firstName: 'Alice', lastName: 'Smith' },
        { firstName: 'Bob', lastName: 'Johnson' },
        { firstName: 'Charlie', lastName: 'Brown' },
      ];

      for (const participant of participants) {
        const chat = new Chat({
          userEmail: user.email,
          participant,
          messages: [],
        });
        await chat.save();

        const messages = await Message.insertMany([
          { chatId: chat._id, sender: 'user', text: `Hi ${participant.firstName}!` },
          { chatId: chat._id, sender: 'bot', text: `Hello ${participant.firstName}, how can I assist you today?` },
        ]);

        chat.messages = messages.map(m => m._id);
        await chat.save();
      }
    }

    req.userEmail = user.email;
    req.userName = user.name;

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid token' });
  }
};
