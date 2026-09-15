import express from "express";

import Question from "../models/Question.js";
import authenticateAdmin from "../middleware/auth.js";

const router = express.Router();

// CREATE a question
router.post("/", authenticateAdmin, async (req, res) => {
  // console.log("BODY RECEIVED:", req.body);
  try {
    const {
      eventDate,
      category,
      question,
      answer,
      points,
      questionImages,
      answerImages,
    } = req.body;

    const newQuestion = new Question({
      eventDate,
      category,
      question,
      answer,
      points,
      questionImages: questionImages ?? [],
      answerImages: answerImages ?? [],
    });

    // console.log("QUESTION BEFORE SAVE:", newQuestion);

    const savedQuestion = await newQuestion.save();

    // console.log("QUESTION AFTER SAVE:", savedQuestion);

    res.status(201).json(savedQuestion);
  } catch (error) {
    console.error("Error creating question:", error);

    res.status(500).json({
      message: "Error creating question",
    });
  }
});

// GET all questions
router.get("/", async (_req, res) => {
  try {
    const questions = await Question.find().sort({
      eventDate: -1,
    });

    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);

    res.status(500).json({
      message: "Error fetching questions",
    });
  }
});

// UPDATE a question
router.put("/:id", authenticateAdmin, async (req, res) => {
  try {
    const {
      eventDate,
      category,
      question,
      answer,
      points,
      questionImages,
      answerImages,
      questionImage,
      answerImage,
    } = req.body;

    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      {
        eventDate,
        category,
        question,
        answer,
        points,
        questionImages,
        answerImages,

        // Legacy fields kept temporarily for old questions
        questionImage,
        answerImage,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedQuestion) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    res.json(updatedQuestion);
  } catch (error) {
    console.error("Error updating question:", error);

    res.status(500).json({
      message: "Error updating question",
    });
  }
});

// DELETE a question
router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(req.params.id);

    if (!deletedQuestion) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    res.json({
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting question:", error);

    res.status(500).json({
      message: "Error deleting question",
    });
  }
});

export default router;
