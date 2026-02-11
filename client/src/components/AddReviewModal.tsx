import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { z } from "zod";
import Model from "./Model";
import { Button } from "./Button";
import { cn } from "../utils/cn";
import { X } from "lucide-react";

const reviewSchema = z.object({
  name: z.string().min(1, "Full name is required"),

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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
    watch,
    setValue,
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      name: "",

      content: "",
      rating: 4,
    },
  });

  const rating = watch("rating");

  if (!open) return null;

  const handleStarClick = (value: number) => {
    setValue("rating", value, { shouldValidate: true });
  };

  const onSubmit = async (data: ReviewFormValues) => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/review`, {
        name: data.name,
        content: data.content,
        rating: data.rating,
        company: companyId,
      });

      reset();
      onClose();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError("root.serverError", {
          message:
            err.response?.data?.message ||
            "Failed to submit review. Please try again.",
        });
      } else {
        setError("root.serverError", {
          message: "Failed to submit review. Please try again.",
        });
      }
    }
  };

  return (
    <Model>
      <button
        type="button"
        onClick={onClose}
        className="absolute cursor-pointer z-10 top-4 right-4 text-2xl leading-none text-gray-500 hover:text-gray-700"
      >
        <X />
      </button>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative z-2 px-8 pt-10 pb-8 space-y-6"
      >
        <h2 className="text-center text-2xl font-semibold text-gray-900 mb-4">
          Add Review
        </h2>

        {errors.root?.serverError && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {errors.root.serverError.message}
          </div>
        )}

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-800">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Enter"
            {...register("name")}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
          />
          {errors.name && (
            <p className="text-xs text-red-600 mt-0.5">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-800">
            Enter your Review
          </label>
          <textarea
            placeholder="Description"
            rows={4}
            {...register("content")}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent resize-none"
          />
          {errors.content && (
            <p className="text-xs text-red-600 mt-0.5">
              {errors.content.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between ">
            <span className="text-lg font-semibold text-gray-900">Rating</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  className="text-2xl cursor-pointer"
                >
                  <span
                    className={
                      star <= rating ? "text-yellow-400" : "text-gray-300"
                    }
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>
            <div className="text-sm font-normal text-gray-700">
              {satisfactionLabel(rating)}
            </div>
          </div>
          {errors.rating && (
            <p className="text-xs text-red-600 mt-0.5">
              {errors.rating.message}
            </p>
          )}
        </div>

        <div className="pt-2 flex justify-center">
          <Button
            text={isSubmitting ? "Saving..." : "Save"}
            theme="blue"
            role="button"
            type="submit"
            className={cn(
              "px-10",
              isSubmitting && "opacity-60 cursor-not-allowed",
            )}
          />
        </div>
      </form>
    </Model>
  );
}
