import { useState } from "react";

import { categories, categoryIcons } from "../data/categories";
import type { Question } from "../types/Question";
import { apiRequest } from "../utils/api";

import { toast } from "sonner";

type QuestionListProps = {
  questions: Question[];
  authToken: string | null;
  onQuestionChanged: () => void;
  onUnauthorized: () => void;
};

function QuestionList({
  questions,
  authToken,
  onQuestionChanged,
  onUnauthorized,
}: QuestionListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const [editEventDate, setEditEventDate] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");
  const [editPoints, setEditPoints] = useState(1);

  const [editQuestionImages, setEditQuestionImages] = useState<string[]>([""]);
  const [editAnswerImages, setEditAnswerImages] = useState<string[]>([""]);

  const [filterCategory, setFilterCategory] = useState("All");
  const [filterDate, setFilterDate] = useState("All");

  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(
    null,
  );

  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const inputClass =
    "w-full rounded-xl border border-trivia-dark/15 bg-white px-4 py-3 text-trivia-dark outline-none transition placeholder:text-trivia-green/50 focus:border-trivia-gold focus:ring-2 focus:ring-trivia-gold/20 dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder:text-trivia-beige/40";

  const labelClass =
    "mb-2 block text-sm font-bold text-trivia-dark dark:text-white";

  // --------------------
  // EDIT
  // --------------------

  const handleEditClick = (question: Question) => {
    setEditingId(question._id);

    setEditEventDate(question.eventDate);
    setEditCategory(question.category);
    setEditQuestion(question.question);
    setEditAnswer(question.answer);

    setEditPoints(question.points ?? 1);

    setEditQuestionImages(
      question.questionImages?.length
        ? question.questionImages
        : question.questionImage
          ? [question.questionImage]
          : [""],
    );

    setEditAnswerImages(
      question.answerImages?.length
        ? question.answerImages
        : question.answerImage
          ? [question.answerImage]
          : [""],
    );
  };

  const handleCancelEdit = () => {
    setEditingId(null);

    setEditEventDate("");
    setEditCategory("");
    setEditQuestion("");
    setEditAnswer("");
    setEditPoints(1);

    setEditQuestionImages([""]);
    setEditAnswerImages([""]);
  };

  const updateEditQuestionImage = (index: number, value: string) => {
    setEditQuestionImages((current) =>
      current.map((image, imageIndex) =>
        imageIndex === index ? value : image,
      ),
    );
  };

  const addEditQuestionImage = () => {
    setEditQuestionImages((current) => [...current, ""]);
  };

  const removeEditQuestionImage = (index: number) => {
    setEditQuestionImages((current) => {
      const updatedImages = current.filter(
        (_, imageIndex) => imageIndex !== index,
      );

      return updatedImages.length > 0 ? updatedImages : [""];
    });
  };

  const updateEditAnswerImage = (index: number, value: string) => {
    setEditAnswerImages((current) =>
      current.map((image, imageIndex) =>
        imageIndex === index ? value : image,
      ),
    );
  };

  const addEditAnswerImage = () => {
    setEditAnswerImages((current) => [...current, ""]);
  };

  const removeEditAnswerImage = (index: number) => {
    setEditAnswerImages((current) => {
      const updatedImages = current.filter(
        (_, imageIndex) => imageIndex !== index,
      );

      return updatedImages.length > 0 ? updatedImages : [""];
    });
  };

  const handleUpdate = async (id: string) => {
    if (!editEventDate) {
      toast.error("Please choose a Trivia Night date");
      return;
    }

    if (!editCategory) {
      toast.error("Please choose a category");
      return;
    }

    if (!editQuestion.trim()) {
      toast.error("Please enter a question");
      return;
    }

    if (!editAnswer.trim()) {
      toast.error("Please enter an answer");
      return;
    }

    if (!Number.isFinite(editPoints) || editPoints < 0) {
      toast.error("Please enter a valid number of points");
      return;
    }

    setSavingId(id);

    try {
      const response = await apiRequest(`/api/questions/${id}`, {
        method: "PUT",
        token: authToken,
        body: JSON.stringify({
          eventDate: editEventDate,
          category: editCategory,
          question: editQuestion.trim(),
          answer: editAnswer.trim(),
          points: editPoints,
          questionImages: editQuestionImages
            .map((image) => image.trim())
            .filter(Boolean),
          answerImages: editAnswerImages
            .map((image) => image.trim())
            .filter(Boolean),

          // Clear the old single-image fields after editing.
          // Existing questions are loaded into the arrays above.
          questionImage: "",
          answerImage: "",
        }),
      });

      if (response.status === 401) {
        onUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error("Could not update question");
      }

      toast.success("Question updated successfully");

      setEditingId(null);
      await onQuestionChanged();
    } catch (error) {
      console.error("Error updating question:", error);
      toast.error("Could not update question");
    } finally {
      setSavingId(null);
    }
  };

  // --------------------
  // DELETE
  // --------------------

  const handleDelete = async (id: string) => {
    setDeletingId(id);

    try {
      const response = await apiRequest(`/api/questions/${id}`, {
        method: "DELETE",
        token: authToken,
      });

      if (response.status === 401) {
        onUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error("Could not delete question");
      }

      toast.success("Question deleted successfully");

      setQuestionToDelete(null);
      await onQuestionChanged();
    } catch (error) {
      console.error("Error deleting question:", error);
      toast.error("Could not delete question");
    } finally {
      setDeletingId(null);
    }
  };

  // --------------------
  // FILTER DATA
  // --------------------

  const availableDates = [
    ...new Set(questions.map((question) => question.eventDate).filter(Boolean)),
  ]
    .sort()
    .reverse();

  const filteredQuestions = questions.filter((question) => {
    const matchesCategory =
      filterCategory === "All" || question.category === filterCategory;

    const matchesDate =
      filterDate === "All" || question.eventDate === filterDate;

    return matchesCategory && matchesDate;
  });

  const questionsForSelectedDate =
    filterDate === "All"
      ? questions
      : questions.filter((question) => question.eventDate === filterDate);

  const categoryCounts = categories.map((category) => ({
    category,
    count: questionsForSelectedDate.filter(
      (question) => question.category === category,
    ).length,
  }));

  // --------------------
  // DATE FORMATTING
  // --------------------

  const formatEventDate = (date: string) => {
    const [year, month, day] = date.split("-").map(Number);

    const eventDate = new Date(year, month - 1, day);

    return eventDate.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getQuestionImages = (question: Question) => {
    if (question.questionImages?.length) {
      return question.questionImages;
    }

    return question.questionImage ? [question.questionImage] : [];
  };

  const getAnswerImages = (question: Question) => {
    if (question.answerImages?.length) {
      return question.answerImages;
    }

    return question.answerImage ? [question.answerImage] : [];
  };

  return (
    <>
      <section className="overflow-hidden rounded-3xl bg-white shadow-sm dark:bg-white/10">
        {/* HEADER */}
        <div className="border-b border-trivia-dark/10 bg-trivia-green/5 px-6 py-6 dark:border-white/10 dark:bg-white/5 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-trivia-gold text-2xl">
                📚
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-trivia-green dark:text-trivia-gold">
                  Question Library
                </p>

                <h2 className="mt-1 text-2xl font-black text-trivia-dark dark:text-white">
                  Questions
                </h2>

                <p className="mt-1 text-sm text-trivia-green dark:text-trivia-beige">
                  Browse, filter, edit, and delete your existing trivia
                  questions.
                </p>
              </div>
            </div>

            <span className="self-start rounded-full bg-trivia-dark px-4 py-2 text-sm font-bold text-white dark:bg-trivia-gold dark:text-trivia-dark">
              {questions.length} total
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {/* FILTERS */}
          <div className="mb-8 rounded-2xl bg-trivia-beige/60 p-5 dark:bg-white/5">
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-widest text-trivia-green dark:text-trivia-gold">
                Filters
              </p>

              <h3 className="mt-1 text-lg font-black text-trivia-dark dark:text-white">
                Narrow down the list
              </h3>

              <p className="mt-1 text-sm text-trivia-green dark:text-trivia-beige">
                Filter by Trivia Night or category.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="filterDate" className={labelClass}>
                  Trivia Night
                </label>

                <select
                  id="filterDate"
                  value={filterDate}
                  onChange={(event) => {
                    setFilterDate(event.target.value);
                    setFilterCategory("All");
                  }}
                  className={inputClass}
                >
                  <option value="All">All Trivia Nights</option>

                  {availableDates.map((date) => (
                    <option key={date} value={date}>
                      {formatEventDate(date)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="filterCategory" className={labelClass}>
                  Category
                </label>

                <select
                  id="filterCategory"
                  value={filterCategory}
                  onChange={(event) => setFilterCategory(event.target.value)}
                  className={inputClass}
                >
                  <option value="All">
                    All Categories ({questionsForSelectedDate.length})
                  </option>

                  {categoryCounts
                    .filter(({ count }) => count > 0)
                    .map(({ category, count }) => (
                      <option key={category} value={category}>
                        {categoryIcons[category as keyof typeof categoryIcons]}{" "}
                        {category} {count}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* CATEGORY OVERVIEW */}
          <div className="mb-8">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-trivia-green dark:text-trivia-gold">
              Category Overview
            </h3>

            <div className="flex flex-wrap gap-2">
              {categoryCounts
                .filter(({ count }) => count > 0)
                .map(({ category, count }) => (
                  <span
                    key={category}
                    className="rounded-full bg-trivia-green/10 px-3 py-1.5 text-sm text-trivia-dark dark:bg-white/10 dark:text-white"
                  >
                    <span className="font-bold">
                      {categoryIcons[category as keyof typeof categoryIcons]}{" "}
                      {category}
                    </span>

                    <span className="ml-2 text-trivia-green dark:text-trivia-beige">
                      {count}
                    </span>
                  </span>
                ))}
            </div>
          </div>

          {/* RESULTS SUMMARY */}
          <div className="mb-6 border-t border-trivia-dark/10 pt-6 dark:border-white/10">
            <p className="text-sm text-trivia-green dark:text-trivia-beige">
              Showing{" "}
              <strong className="text-trivia-dark dark:text-white">
                {filteredQuestions.length}
              </strong>{" "}
              {filteredQuestions.length === 1 ? "question" : "questions"}
              {filterCategory !== "All" && ` in ${filterCategory}`}
              {filterDate !== "All" && ` from ${formatEventDate(filterDate)}`}
            </p>
          </div>

          {/* EMPTY STATE */}
          {filteredQuestions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-trivia-dark/20 bg-trivia-beige/40 px-6 py-12 text-center dark:border-white/20 dark:bg-white/5">
              <div className="mb-3 text-4xl">🔎</div>

              <h3 className="font-black text-trivia-dark dark:text-white">
                No questions found
              </h3>

              <p className="mt-2 text-sm text-trivia-green dark:text-trivia-beige">
                Try changing your Trivia Night or category filters.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredQuestions.map((question) => (
                <article
                  key={question._id}
                  className="rounded-2xl border border-trivia-dark/10 bg-white p-5 transition hover:border-trivia-gold hover:shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-6"
                >
                  {editingId === question._id ? (
                    /* EDIT MODE */
                    <div>
                      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-trivia-green dark:text-trivia-gold">
                            Editing Question
                          </p>

                          <h3 className="mt-1 text-xl font-black text-trivia-dark dark:text-white">
                            Update question
                          </h3>
                        </div>

                        <span className="self-start rounded-full bg-trivia-gold/20 px-3 py-1 text-sm font-bold text-trivia-dark dark:text-trivia-gold">
                          Editing
                        </span>
                      </div>

                      <div className="space-y-5">
                        <div className="grid gap-5 md:grid-cols-3">
                          <div>
                            <label className={labelClass}>
                              Trivia Night Date
                            </label>

                            <input
                              type="date"
                              value={editEventDate}
                              onChange={(event) =>
                                setEditEventDate(event.target.value)
                              }
                              className={inputClass}
                            />
                          </div>

                          <div>
                            <label className={labelClass}>Category</label>

                            <select
                              value={editCategory}
                              onChange={(event) =>
                                setEditCategory(event.target.value)
                              }
                              className={inputClass}
                            >
                              <option value="">Choose a category</option>

                              {categories.map((categoryName) => (
                                <option key={categoryName} value={categoryName}>
                                  {categoryName}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className={labelClass}>Points</label>

                            <input
                              type="number"
                              min="0"
                              value={editPoints}
                              onChange={(event) =>
                                setEditPoints(Number(event.target.value))
                              }
                              className={inputClass}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>Question</label>

                          <textarea
                            value={editQuestion}
                            onChange={(event) =>
                              setEditQuestion(event.target.value)
                            }
                            rows={4}
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
                            {editQuestionImages.map((image, index) => (
                              <div
                                key={`edit-question-image-${index}`}
                                className="flex items-center gap-3"
                              >
                                <input
                                  type="url"
                                  value={image}
                                  onChange={(event) =>
                                    updateEditQuestionImage(
                                      index,
                                      event.target.value,
                                    )
                                  }
                                  placeholder={`https://... image ${index + 1}`}
                                  className={inputClass}
                                />

                                {editQuestionImages.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeEditQuestionImage(index)
                                    }
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
                            onClick={addEditQuestionImage}
                            className="mt-3 rounded-xl border border-trivia-green/30 px-4 py-2 text-sm font-bold text-trivia-green transition hover:border-trivia-gold hover:text-trivia-dark dark:text-trivia-beige dark:hover:text-trivia-gold"
                          >
                            ＋ Add another image
                          </button>
                        </div>

                        <div>
                          <label className={labelClass}>Answer</label>

                          <textarea
                            value={editAnswer}
                            onChange={(event) =>
                              setEditAnswer(event.target.value)
                            }
                            rows={3}
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
                            {editAnswerImages.map((image, index) => (
                              <div
                                key={`edit-answer-image-${index}`}
                                className="flex items-center gap-3"
                              >
                                <input
                                  type="url"
                                  value={image}
                                  onChange={(event) =>
                                    updateEditAnswerImage(
                                      index,
                                      event.target.value,
                                    )
                                  }
                                  placeholder={`https://... image ${index + 1}`}
                                  className={inputClass}
                                />

                                {editAnswerImages.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeEditAnswerImage(index)}
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
                            onClick={addEditAnswerImage}
                            className="mt-3 rounded-xl border border-trivia-green/30 px-4 py-2 text-sm font-bold text-trivia-green transition hover:border-trivia-gold hover:text-trivia-dark dark:text-trivia-beige dark:hover:text-trivia-gold"
                          >
                            ＋ Add another image
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-3 border-t border-trivia-dark/10 pt-5 dark:border-white/10">
                          <button
                            type="button"
                            onClick={() => handleUpdate(question._id)}
                            disabled={savingId === question._id}
                            className="rounded-xl bg-trivia-gold px-5 py-2.5 font-bold text-trivia-dark transition hover:bg-trivia-green hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {savingId === question._id
                              ? "Saving..."
                              : "Save Changes"}
                          </button>

                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            disabled={savingId === question._id}
                            className="rounded-xl border border-trivia-dark/15 bg-white px-5 py-2.5 font-bold text-trivia-dark transition hover:border-trivia-gold hover:bg-trivia-beige disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:bg-white/5 dark:text-white"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* NORMAL MODE */
                    <div>
                      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-2 rounded-full bg-trivia-green px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
                            {
                              categoryIcons[
                                question.category as keyof typeof categoryIcons
                              ]
                            }{" "}
                            {question.category}
                          </span>

                          <span className="rounded-full bg-trivia-beige px-3 py-1 text-xs font-bold text-trivia-dark">
                            {question.points ?? 1}{" "}
                            {(question.points ?? 1) === 1 ? "point" : "points"}
                          </span>
                        </div>

                        <p className="text-sm font-semibold text-trivia-green dark:text-trivia-beige">
                          {formatEventDate(question.eventDate)}
                        </p>
                      </div>

                      <div className="space-y-5">
                        <div>
                          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-trivia-green dark:text-trivia-gold">
                            Question
                          </p>

                          <p className="text-lg font-bold leading-7 text-trivia-dark dark:text-white">
                            {question.question}
                          </p>
                        </div>

                        {getQuestionImages(question).length > 0 && (
                          <div
                            className={`grid gap-3 ${
                              getQuestionImages(question).length === 1
                                ? "grid-cols-1"
                                : "sm:grid-cols-2"
                            }`}
                          >
                            {getQuestionImages(question).map((image, index) => (
                              <div
                                key={`${image}-${index}`}
                                className="flex items-center justify-center overflow-hidden rounded-xl border border-trivia-dark/10 bg-trivia-beige/30 dark:border-white/10 dark:bg-white/5"
                              >
                                <img
                                  src={image}
                                  alt={`Question ${index + 1}`}
                                  className="max-h-80 w-full object-contain"
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="rounded-xl bg-trivia-beige/60 p-4 dark:bg-white/5">
                          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-trivia-green dark:text-trivia-gold">
                            Answer
                          </p>

                          <p className="font-medium leading-7 text-trivia-dark dark:text-white">
                            {question.answer}
                          </p>
                        </div>

                        {getAnswerImages(question).length > 0 && (
                          <div
                            className={`grid gap-3 ${
                              getAnswerImages(question).length === 1
                                ? "grid-cols-1"
                                : "sm:grid-cols-2"
                            }`}
                          >
                            {getAnswerImages(question).map((image, index) => (
                              <div
                                key={`${image}-${index}`}
                                className="flex items-center justify-center overflow-hidden rounded-xl border border-trivia-dark/10 bg-trivia-beige/30 dark:border-white/10 dark:bg-white/5"
                              >
                                <img
                                  src={image}
                                  alt={`Answer ${index + 1}`}
                                  className="max-h-80 w-full object-contain"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3 border-t border-trivia-dark/10 pt-5 dark:border-white/10">
                        <button
                          type="button"
                          onClick={() => handleEditClick(question)}
                          className="rounded-xl border border-trivia-dark/15 bg-white px-4 py-2 text-sm font-bold text-trivia-dark transition hover:border-trivia-gold hover:bg-trivia-beige dark:border-white/20 dark:bg-white/5 dark:text-white"
                        >
                          ✏️ Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => setQuestionToDelete(question)}
                          className="rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100 dark:bg-red-500/10 dark:text-red-300"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* DELETE CONFIRMATION MODAL */}
      {questionToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={() => {
            if (!deletingId) {
              setQuestionToDelete(null);
            }
          }}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-trivia-dark sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl dark:bg-red-500/10">
                🗑️
              </div>

              <h3 className="text-2xl font-black text-trivia-dark dark:text-white">
                Delete question?
              </h3>

              <p className="mt-2 leading-6 text-trivia-green dark:text-trivia-beige">
                This action cannot be undone. The question will be permanently
                removed.
              </p>
            </div>

            <div className="mb-6 rounded-2xl bg-trivia-beige/60 p-4 dark:bg-white/5">
              <p className="text-xs font-bold uppercase tracking-widest text-trivia-green dark:text-trivia-gold">
                Question
              </p>

              <p className="mt-2 font-bold leading-6 text-trivia-dark dark:text-white">
                {questionToDelete.question}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-trivia-dark dark:bg-white/10 dark:text-white">
                  {questionToDelete.category}
                </span>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-trivia-dark dark:bg-white/10 dark:text-white">
                  {questionToDelete.points ?? 1}{" "}
                  {(questionToDelete.points ?? 1) === 1 ? "point" : "points"}
                </span>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setQuestionToDelete(null)}
                disabled={deletingId === questionToDelete._id}
                className="rounded-xl border border-trivia-dark/15 bg-white px-5 py-2.5 font-bold text-trivia-dark transition hover:border-trivia-gold hover:bg-trivia-beige disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:bg-white/5 dark:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleDelete(questionToDelete._id)}
                disabled={deletingId === questionToDelete._id}
                className="rounded-xl bg-red-600 px-5 py-2.5 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deletingId === questionToDelete._id
                  ? "Deleting..."
                  : "Delete Question"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default QuestionList;
