import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import questionsRouter from "./routes/questions.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

app.use("/api/questions", questionsRouter);
app.use("/api/auth", authRouter);

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error("MONGO_URI is missing in .env");
}

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.get("/", (_req, res) => {
  res.json({
    message: "Trivia API is working!",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
