import mongoose, { Document } from "mongoose";

// Тип документа користувача
export interface UserDocument extends Document {
  email: string;
  name?: string;
  avatar?: string;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String },
    avatar: { type: String },
  },
  { timestamps: true }
);

// Експортуємо і модель, і тип документу
const User = mongoose.model<UserDocument>("User", userSchema);
export default User;
