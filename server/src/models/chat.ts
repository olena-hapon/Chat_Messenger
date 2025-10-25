import mongoose, { Document, Schema } from "mongoose";

interface Participant {
  firstName: string;
  lastName: string;
}

export interface ChatDocument extends Document {
  userEmail: string;
  participant: Participant;
  messages: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<ChatDocument>(
  {
    userEmail: { type: String, required: true },
    participant: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  },
  { timestamps: true }
);

export const Chat = mongoose.model<ChatDocument>("Chat", chatSchema);
