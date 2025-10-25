import mongoose, { Document, Schema } from 'mongoose';

export interface MessageDocument extends Document {
  chatId: mongoose.Types.ObjectId;
  sender: 'user' | 'bot';
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<MessageDocument>(
  {
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    sender: { type: String, enum: ['user', 'bot'], required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<MessageDocument>('Message', messageSchema);
