import mongoose from "mongoose";

export const ReminderSchema = new mongoose.Schema({
  title: String,
  date: Date
});