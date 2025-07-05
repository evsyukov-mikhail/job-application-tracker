import mongoose from "mongoose";

export const ReminderSchema = new mongoose.Schema({
  title: String,
  date: Date,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
});