import { useState } from "react";
import { toast } from "sonner";

import { categories, categoryIcons } from "../data/categories";
import { apiRequest } from "../utils/api";

type QuestionFormProps = {
  authToken: string | null;
  onQuestionAdded: () => void;
  onUnauthorized: () => void;
};

function QuestionForm({
  authToken,
  onQuestionAdded,
  onUnauthorized,
}: QuestionFormProps) {
  const [eventDate, setEventDate] = useState("");
  const [category, setCategory] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [points, setPoints] = useState(1);

  const [questionImages, setQuestionImages] = useState<string[]>([""]);
  const [answerImages, setAnswerImages] = useState<string[]>([""]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateQuestionImage = (index: number, value: string) => {
    setQuestionImages((current) =>
      current.map((image, imageIndex) =>
        imageIndex === index ? value : image,
      ),
    );
  };

  const addQuestionImage = () => {
    setQuestionImages((current) => [...current, ""]);
  };

  const removeQuestionImage = (index: number) => {
    setQuestionImages((current) => {
      const updatedImages = current.filter(
        (_, imageIndex) => imageIndex !== index,
      );

      return updatedImages.length > 0 ? updatedImages : [""];
    });
  };

  const updateAnswerImage = (index: number, value: string) => {
    setAnswerImages((current) =>
      current.map((image, imageIndex) =>
        imageIndex === index ? value : image,
      ),
    );
  };

  const addAnswerImage = () => {
    setAnswerImages((current) => [...current, ""]);
  };

  const removeAnswerImage = (index: number) => {
    setAnswerImages((current) => {
      const updatedImages = current.filter(
        (_, imageIndex) => imageIndex !== index,
      );

      return updatedImages.length > 0 ? updatedImages : [""];
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!eventDate) {
      toast.error("Please choose a Trivia Night date");
      return;
    }

    if (!category) {
      toast.error("Please choose a category");
      return;
    }

    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    if (!answer.trim()) {
      toast.error("Please enter an answer");
      return;
    }

    if (!Number.isFinite(points) || points < 0) {
      toast.error("Please enter a valid number of points");
      return;
    }

    const cleanedQuestionImages = questionImages
      .map((image) => image.trim())
      .filter((image) => image.length > 0);

    const cleanedAnswerImages = answerImages
      .map((image) => image.trim())
      .filter((image) => image.length > 0);

    setIsSubmitting(true);

    try {
      const response = await apiRequest("/api/questions", {
        method: "POST",
        token: authToken,
        body: JSON.stringify({
          eventDate,
          category,
          question: question.trim(),
          answer: answer.trim(),
          points,
          questionImages: cleanedQuestionImages,
          answerImages: cleanedAnswerImages,
        }),
      });

      if (response.status === 401) {
        onUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error("Could not create question");
      }

      toast.success("Question added successfully");

      setCategory("");
      setQuestion("");
      setAnswer("");
      setPoints(1);
      setQuestionImages([""]);
      setAnswerImages([""]);

      // Keep the date because several questions
      // normally belong to the same Trivia Night.

      onQuestionAdded();
    } catch (error) {
      console.error("Error creating question:", error);
      toast.error("Could not add question");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-trivia-dark/15 bg-white px-4 py-3 text-trivia-dark outline-none transition placeholder:text-trivia-green/50 focus:border-trivia-gold focus:ring-2 focus:ring-trivia-gold/20 dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder:text-trivia-beige/40";

  const labelClass =
    "mb-2 block text-sm font-bold text-trivia-dark dark:text-white";

  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-sm dark:bg-white/10">
      {/* Header */}
      <div className="border-b border-trivia-dark/10 bg-trivia-green/5 px-6 py-6 dark:border-white/10 dark:bg-white/5 sm:px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-trivia-gold text-2xl">
            ➕
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-trivia-green dark:text-trivia-gold">
              Question Builder
            </p>

            <h2 className="mt-1 text-2xl font-black text-trivia-dark dark:text-white">
              Add Question
            </h2>

            <p className="mt-1 text-sm text-trivia-green dark:text-trivia-beige">
              Create a new question for one of your Trivia Nights.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-8 p-6 sm:p-8">
        {/* Basic Information */}
        <div>
          <div className="mb-5">
            <h3 className="text-lg font-black text-trivia-dark dark:text-white">
              Basic Information
            </h3>

            <p className="mt-1 text-sm text-trivia-green dark:text-trivia-beige">
              Choose the Trivia Night, category and point value.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label htmlFor="eventDate" className={labelClass}>
                Trivia Night Date
              </label>

              <input
                id="eventDate"
                type="date"
                value={eventDate}
                onChange={(event) => setEventDate(event.target.value)}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="category" className={labelClass}>
                Category
              </label>

              <select
                id="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                required
                className={inputClass}
              >
                <option value="">Choose a category</option>

                {categories.map((categoryName) => (
                  <option key={categoryName} value={categoryName}>
                    {categoryIcons[categoryName]} {categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="points" className={labelClass}>
                Points
              </label>

              <input
                id="points"
                type="number"
                min="0"
                value={points}
                onChange={(event) => setPoints(Number(event.target.value))}
                required
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-trivia-dark/10 dark:border-white/10" />

        {/* Question */}
        <div>
          <div className="mb-5">
            <h3 className="text-lg font-black text-trivia-dark dark:text-white">
              Question
            </h3>

            <p className="mt-1 text-sm text-trivia-green dark:text-trivia-beige">
              Write the question and optionally attach one or more images.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="question" className={labelClass}>
                Question Text
              </label>

              <textarea
                id="question"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                required
                rows={4}
                placeholder="Write the trivia question here..."
                className={`${inputClass} resize-y`}
              />
            </div>

            <div>
              <label className={labelClass}>
                Question Images
                <span className="ml-2 text-xs font-medium text-trivia-green dark:text-trivia-beige">
                  Optional
                </span>
              </label>

              <div className="space-y-3">
                {questionImages.map((image, index) => (
                  <div
                    key={`question-image-${index}`}
                    className="flex items-center gap-3"
                  >
                    <input
                      type="url"
                      value={image}
                      onChange={(event) =>
                        updateQuestionImage(index, event.target.value)
                      }
                      placeholder={`https://... image ${index + 1}`}
                      className={inputClass}
                    />

                    {questionImages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestionImage(index)}
                        className="shrink-0 rounded-xl border border-red-200 px-3 py-3 font-bold text-red-600 transition hover:bg-red-50 dark:border-red-400/30 dark:text-red-300 dark:hover:bg-red-500/10"
                        aria-label={`Remove question image ${index + 1}`}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addQuestionImage}
                className="mt-3 rounded-xl border border-trivia-green/30 px-4 py-2 text-sm font-bold text-trivia-green transition hover:border-trivia-gold hover:text-trivia-dark dark:text-trivia-beige dark:hover:text-trivia-gold"
              >
                ＋ Add another image
              </button>

              <p className="mt-2 text-xs text-trivia-green dark:text-trivia-beige">
                Add as many images as the question needs.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-trivia-dark/10 dark:border-white/10" />

        {/* Answer */}
        <div>
          <div className="mb-5">
            <h3 className="text-lg font-black text-trivia-dark dark:text-white">
              Answer
            </h3>

            <p className="mt-1 text-sm text-trivia-green dark:text-trivia-beige">
              Add the correct answer and optional reveal images.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="answer" className={labelClass}>
                Correct Answer
              </label>

              <textarea
                id="answer"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                required
                rows={3}
                placeholder="Write the correct answer here..."
                className={`${inputClass} resize-y`}
              />
            </div>

            <div>
              <label className={labelClass}>
                Answer Images
                <span className="ml-2 text-xs font-medium text-trivia-green dark:text-trivia-beige">
                  Optional
                </span>
              </label>

              <div className="space-y-3">
                {answerImages.map((image, index) => (
                  <div
                    key={`answer-image-${index}`}
                    className="flex items-center gap-3"
                  >
                    <input
                      type="url"
                      value={image}
                      onChange={(event) =>
                        updateAnswerImage(index, event.target.value)
                      }
                      placeholder={`https://... image ${index + 1}`}
                      className={inputClass}
                    />

                    {answerImages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAnswerImage(index)}
                        className="shrink-0 rounded-xl border border-red-200 px-3 py-3 font-bold text-red-600 transition hover:bg-red-50 dark:border-red-400/30 dark:text-red-300 dark:hover:bg-red-500/10"
                        aria-label={`Remove answer image ${index + 1}`}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addAnswerImage}
                className="mt-3 rounded-xl border border-trivia-green/30 px-4 py-2 text-sm font-bold text-trivia-green transition hover:border-trivia-gold hover:text-trivia-dark dark:text-trivia-beige dark:hover:text-trivia-gold"
              >
                ＋ Add another image
              </button>

              <p className="mt-2 text-xs text-trivia-green dark:text-trivia-beige">
                Add as many images as you want to reveal with the answer.
              </p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-col gap-3 border-t border-trivia-dark/10 pt-6 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-trivia-green dark:text-trivia-beige">
            The selected date stays active after submission.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-trivia-gold px-6 py-3.5 font-bold text-trivia-dark shadow-sm transition hover:-translate-y-0.5 hover:bg-trivia-green hover:text-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Adding..." : "＋ Add Question"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default QuestionForm;
