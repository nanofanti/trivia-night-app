import mongoose, { Schema } from "mongoose";

const questionSchema = new Schema({
  eventDate: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  question: {
    type: String,
    required: true,
  },

  answer: {
    type: String,
    required: true,
  },

  points: {
    type: Number,
    required: true,
    min: 0,
  },

  // New fields: allow multiple images
  questionImages: {
    type: [String],
    default: [],
  },

  answerImages: {
    type: [String],
    default: [],
  },

  // Legacy fields:
  // keep these temporarily so existing questions still work
  questionImage: {
    type: String,
    required: false,
  },

  answerImage: {
    type: String,
    required: false,
  },
});

const Question = mongoose.model("Question", questionSchema);

export default Question;
