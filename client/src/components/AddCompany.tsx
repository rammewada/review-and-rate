import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { z } from "zod";
import { Button } from "./Button";
import { cn } from "../utils/cn";
import { X } from "lucide-react";
import Model from "./Model";

const companySchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  foundedYear: z.string().min(1, "Founded Year is required"),
  logo: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Logo is required"),
});

type CompanyFormValues = z.infer<typeof companySchema>;

interface AddCompanyProps {
  open: boolean;
  onClose: () => void;
}

export default function AddCompanyModal({ open, onClose }: AddCompanyProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      foundedYear: "",
    },
  });

  if (!open) return null;

  const onSubmit = async (data: CompanyFormValues) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("address", data.address);
      formData.append("city", data.city);
      formData.append("foundedYear", data.foundedYear);
      formData.append("logo", data.logo[0]);

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/company`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      reset();
      onClose();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError("root.serverError", {
          message:
            err.response?.data?.message ||
            "Failed to create company. Please try again.",
        });
      } else {
        setError("root.serverError", {
          message: "Failed to create company. Please try again.",
        });
      }
    }
  };

  return (
    <Model>
      <div className="relative  h-full">
        <button
          type="button"
          onClick={onClose}
          className="absolute z-10 top-4 right-4 text-2xl leading-none text-gray-500 hover:text-gray-700 cursor-pointer "
        >
          <X />
        </button>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative z-1 px-8 pt-10 pb-8 space-y-6"
        >
          <h2 className="text-center text-2xl font-semibold text-gray-900 mb-4">
            Add Company
          </h2>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-800">
              Name*
            </label>
            <input
              type="text"
              placeholder="Company name"
              {...register("name")}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-0.5">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-800">
              Address*
            </label>
            <input
              type="text"
              placeholder="Address"
              {...register("address")}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            />
            {errors.address && (
              <p className="text-xs text-red-600 mt-0.5">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-800">
              City*
            </label>
            <input
              type="text"
              placeholder="City"
              {...register("city")}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            />
            {errors.city && (
              <p className="text-xs text-red-600 mt-0.5">
                {errors.city.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-800">
              Founded Year*
            </label>
            <input
              type="text"
              placeholder="DD-MM-YYYY"
              {...register("foundedYear")}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            />
            {errors.foundedYear && (
              <p className="text-xs text-red-600 mt-0.5">
                {errors.foundedYear.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-800">
              Logo*
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("logo")}
              className="w-full text-sm text-gray-700 file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
            {errors.logo && (
              <p className="text-xs text-red-600 mt-0.5">
                {errors.logo.message}
              </p>
            )}
          </div>

          {errors.root?.serverError && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {errors.root.serverError.message}
            </div>
          )}

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
      </div>
    </Model>
  );
}
