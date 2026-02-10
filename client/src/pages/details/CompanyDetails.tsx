import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AddReviewModal from "./AddReviewModal";

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
          `http://localhost:4000/api/company/${id}`
        );
        const data: Company | undefined = res?.data?.data?.company;
        if (!data) {
          setError("Company not found");
          setCompany(null);
        } else {
          setCompany(data);
        }
      } catch (err) {
        const message =
          err && typeof err === "object" && "message" in err
            ? String((err as { message?: string }).message)
            : "Failed to fetch company details";
        setError(message);
        setCompany(null);
      } finally {
        setLoading(false);
      }
    }

    fetchCompany();
  }, [id]);

  const formattedFoundedDate = useMemo(() => {
    if (!company?.foundedYear) return null;
    // Example format: "Founded on 01-01-2016" – we only have year,
    // so just show year to keep it realistic
    return `Founded on ${company.foundedYear}`;
  }, [company]);

  const renderLogo = (logo: string | undefined) => {
    if (!logo) return "";
    const normalized = logo.replace(/\\/g, "/");
    if (/^https?:\/\//i.test(normalized)) return normalized;
    return `http://localhost:4000/${normalized}`;
  };

  const formatReviewDateTime = (
    iso: string
  ): { date: string; time: string } | null => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;

    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();

    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");

    return {
      date: `${day}-${month}-${year}`,
      time: `${hours}:${minutes}`,
    };
  };

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
        {/* Header card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                {company.logo ? (
                  <img
                    src={renderLogo(company.logo)}
                    alt={company.name}
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <span className="text-3xl font-semibold text-gray-400">
                    {company.name?.[0] ?? "C"}
                  </span>
                )}
              </div>

              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                  {company.name}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  {company.address}
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-gray-900">
                      {company.ratingsAverage?.toFixed(1) ?? "0.0"}
                    </span>
                    <span className="text-yellow-400 text-lg">
                      {renderStars(company.ratingsAverage || 0)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {company.ratingsQuantity ?? 0} Reviews
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              {formattedFoundedDate && (
                <p className="text-xs md:text-sm text-gray-500">
                  {formattedFoundedDate}
                </p>
              )}

              <button
                className="custom-gradient text-white text-sm md:text-base font-medium px-4 py-2 rounded-md shadow-md hover:opacity-90 transition"
                onClick={() => setShowAddReview(true)}
              >
                + Add Review
              </button>
            </div>
          </div>
        </div>

        {/* Reviews section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              Result Found: {reviews.length}
            </p>
          </div>

          <div className="space-y-6">
            {reviews.map((review) => {
              const dateTime = formatReviewDateTime(review.createdAt);
              return (
                <div
                  key={review._id}
                  className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b last:border-b-0 pb-4 last:pb-0"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      <span className="text-sm font-semibold text-gray-700">
                        {review.name?.[0] ?? "U"}
                      </span>
                    </div>

                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        <span className="font-semibold text-gray-900">
                          {review.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          {dateTime
                            ? `${dateTime.date}, ${dateTime.time}`
                            : ""}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                        {review.content}
                      </p>
                    </div>
                  </div>

                  <div className="flex md:justify-end">
                    <span className="text-yellow-400 text-lg">
                      {renderStars(review.rating || 0)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <AddReviewModal
        companyId={company.id || company._id}
        open={showAddReview}
        onClose={() => setShowAddReview(false)}
      />
    </section>
  );
}
