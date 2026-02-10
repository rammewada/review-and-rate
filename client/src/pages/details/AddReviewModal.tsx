import { FormEvent, useState } from "react";
import axios from "axios";
import { z } from "zod";

const reviewSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  subject: z.string().optional(),
  content: z.string().min(10, "Review must be at least 10 characters"),
  rating: z.number().min(1, "Please select a rating").max(5),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface AddReviewModalProps {
  companyId: string;
  open: boolean;
  onClose: () => void;
}

const satisfactionLabel = (rating: number) => {
  if (rating >= 5) return "Excellent";
  if (rating >= 4) return "Satisfied";
  if (rating >= 3) return "Neutral";
  if (rating >= 2) return "Not Satisfied";
  if (rating >= 1) return "Very Bad";
  return "";
};

export default function AddReviewModal({
  companyId,
  open,
  onClose,
}: AddReviewModalProps) {
  const [form, setForm] = useState<ReviewFormValues>({
    name: "",
    subject: "",
    content: "",
    rating: 4,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ReviewFormValues, string>>>(
    {}
  );
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  if (!open) return null;

  const handleChange =
    (field: keyof ReviewFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setForm((prev) => ({
        ...prev,
        [field]: field === "rating" ? Number(value) : value,
      }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleStarClick = (value: number) => {
    setForm((prev) => ({ ...prev, rating: value }));
    setErrors((prev) => ({ ...prev, rating: undefined }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const result = reviewSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ReviewFormValues, string>> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof ReviewFormValues;
        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      setSubmitting(true);
      await axios.post("http://localhost:4000/api/review", {
        name: result.data.name,
        content: result.data.subject
          ? `${result.data.subject}\n\n${result.data.content}`
          : result.data.content,
        rating: result.data.rating,
        company: companyId,
      });

      setForm({
        name: "",
        subject: "",
        content: "",
        rating: 4,
      });
      onClose();
    } catch (err: any) {
      setServerError(
        err?.response?.data?.message || "Failed to submit review. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-lg mx-4 rounded-3xl bg-white shadow-2xl overflow-hidden">
        {/* Decorative gradient circle */}
        <div className="absolute -top-16 -left-16 w-40 h-40 rounded-full custom-gradient opacity-80" />

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl leading-none text-gray-500 hover:text-gray-700"
        >
          ×
        </button>

        <form
          onSubmit={handleSubmit}
          className="relative z-10 px-8 pt-10 pb-8 space-y-6"
        >
          <h2 className="text-center text-2xl font-semibold text-gray-900 mb-4">
            Add Review
          </h2>

          {serverError && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {serverError}
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-800">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter"
              value={form.name}
              onChange={handleChange("name")}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-0.5">{errors.name}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-800">
              Subject
            </label>
            <input
              type="text"
              placeholder="Enter"
              value={form.subject ?? ""}
              onChange={handleChange("subject")}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-800">
              Enter your Review
            </label>
            <textarea
              placeholder="Description"
              rows={4}
              value={form.content}
              onChange={handleChange("content")}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
            {errors.content && (
              <p className="text-xs text-red-600 mt-0.5">{errors.content}</p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">Rating</span>
              <span className="text-xs text-gray-500">
                {satisfactionLabel(form.rating)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  className="text-2xl focus:outline-none"
                >
                  <span
                    className={
                      star <= form.rating ? "text-yellow-400" : "text-gray-300"
                    }
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>
            {errors.rating && (
              <p className="text-xs text-red-600 mt-0.5">{errors.rating}</p>
            )}
          </div>

          <div className="pt-2 flex justify-center">
            <button
              type="submit"
              disabled={submitting}
              className="min-w-[140px] rounded-full custom-gradient text-white text-sm font-medium py-2.5 px-6 shadow-md hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

