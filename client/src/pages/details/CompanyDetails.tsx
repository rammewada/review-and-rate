import { Activity, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AddReviewModal from "../../components/AddReviewModal";
import { Button } from "../../components/Button";
import { MapPin } from "lucide-react";

interface Review {
  _id: string;
  name: string;
  content: string;
  rating: number;
  createdAt: string;
}

interface Company {
  _id: string;
  id: string;
  name: string;
  address: string;
  foundedYear: number;
  logo: string;
  city: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  slug: string;
  reviews: Review[];
}

export default function CompanyDetails() {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddReview, setShowAddReview] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchCompany() {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/company/${id}`,
        );
        const data: Company | undefined = res?.data?.data?.company;
        if (!data) {
          setError("Company not found");
          setCompany(null);
        } else {
          setCompany(data);
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              "Failed to fetch companies. Please try again.",
          );
        } else {
          setError("Failed to fetch companies. Please try again.");
        }
        setCompany(null);
      } finally {
        setLoading(false);
      }
    }

    fetchCompany();
  }, [id, showAddReview]);

  const renderStars = (rating: number) => {
    const full = Math.round(rating || 0);
    return "★".repeat(full).padEnd(5, "☆");
  };

  if (loading) {
    return (
      <section className="py-6">
        <div className="max-w-5xl mx-auto text-center">Loading company...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-6">
        <div className="max-w-5xl mx-auto text-center text-red-600">
          {error}
        </div>
      </section>
    );
  }

  if (!company) {
    return null;
  }

  const reviews = company.reviews || [];

  return (
    <section className="py-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-md drop-shadow-sm p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex md:items-center gap-4 md:gap-5 w-full md:w-auto">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-md bg-gray-100 flex  items-center justify-center overflow-hidden shrink-0">
                <img
                  src={
                    import.meta.env.VITE_BASE_URL +
                    "/" +
                    company.logo.replace(/\\/g, "/")
                  }
                  alt={company.name}
                  className="object-contain w-full h-full"
                />
              </div>

              <div>
                <h1 className="text-lg md:text-2xl font-semibold text-black">
                  {company.name}
                </h1>
                <p className="mt-1  text-xs md:text-sm text-gray-500">
                  <span className="inline-block shrink-0 pr-1 translate-y-0.5">
                    <MapPin size={15} />
                  </span>
                  {company.address}
                </p>

                <div className="mt-2 md:mt-3 flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm md:text-base  font-semibold text-black">
                      {company.ratingsAverage?.toFixed(1) ?? "0.0"}
                    </span>
                    <span className="text-yellow-400 text-sm md:text-lg">
                      {"★".repeat(Math.round(company.ratingsAverage || 0))}{" "}
                    </span>
                  </div>
                  <span className="text-xs md:text-base font-semibold text-black">
                    {company.ratingsQuantity ?? 0} Reviews
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start w-full md:w-auto gap-3 mt-2 md:mt-0">
              <p className="text-xs md:text-sm text-gray-500 order-1 md:order-none">
                Founded on -{" "}
                {new Date(company.foundedYear).toLocaleString("en-IN", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>

              <Button
                theme="blue"
                text="+ Add Review"
                onClick={() => setShowAddReview(true)}
                role="button"
                className=""
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-md drop-shadow-sm p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              Result Found: {reviews.length}
            </p>
          </div>

          <div className="space-y-6">
            {reviews.map((review) => {
              return (
                <div
                  key={review._id}
                  className="flex flex-col md:flex-row md:items-start md:justify-between gap-4  pb-4 "
                >
                  <div className="flex items-start gap-4 w-full">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      <span className="text-sm font-semibold text-gray-700">
                        {review.name[0]}
                      </span>
                    </div>

                    <div className=" w-full ">
                      <div className="flex justify-between items-center ">
                        <div className="flex flex-col  gap-1 ">
                          <h3 className="font-semibold text-gray-900">
                            {review.name}
                          </h3>
                          <p className="text-xs text-gray-400 ">
                            {new Date(review.createdAt)
                              .toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                              .replace("/", "-")
                              .replace("/", "-")}
                          </p>
                        </div>
                        <div className="     flex justify-end">
                          <span className="text-yellow-400 text-lg">
                            {renderStars(review.rating || 0)}
                          </span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 max-w-4xl leading-relaxed">
                        {review.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Activity mode={showAddReview ? "visible" : "hidden"}>
        <AddReviewModal
          companyId={company.id || company._id}
          open={showAddReview}
          onClose={() => setShowAddReview(false)}
        />
      </Activity>
    </section>
  );
}
