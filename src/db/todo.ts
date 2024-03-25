import mongoose, { Document, Types } from 'mongoose';

export interface Todo {
  userId: Types.ObjectId; 
  description: string;
  completed: boolean;
  createdAt: Date;
}

const TodoSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, required: true },
  description: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const TodoModel = mongoose.model<Document & Todo>('Todo', TodoSchema);
