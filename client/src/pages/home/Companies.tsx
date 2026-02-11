import { useEffect, useState } from "react";
import axios from "axios";
import { useCompanyFilter } from "../../context/CompanyFilterContext";
import { Button } from "../../components/Button";
import { MapPin } from "lucide-react";

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
}

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { search, topRated, showAddCompany } = useCompanyFilter();

  useEffect(() => {
    async function fetchCompanies() {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/company`,
          {
            params: {
              search: search || undefined,
              topRated: topRated || undefined,
            },
          },
        );

        const data: Company[] = res?.data?.data?.companies || [];
        setCompanies(data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              "Failed to fetch companies. Please try again.",
          );
        } else {
          setError("Failed to fetch companies. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchCompanies();
  }, [search, topRated, showAddCompany]);

  return (
    <section className="py-6">
      <div className="max-w-5xl mx-auto">
        {loading && (
          <div className="text-center py-8">Loading companies...</div>
        )}
        {error && <div className="text-red-600 text-center py-4">{error}</div>}

        {!loading && !error && companies.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No companies found.
          </div>
        )}

        <p className=" text-gray-500 pb-2 text-xs">
          Result Found: {companies.length}
        </p>
        {!loading && !error && companies.length > 0 && (
          <div className="space-y-6">
            {companies.map((company) => (
              <div
                key={company._id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-4 md:p-4 rounded-md drop-shadow-sm gap-4 md:gap-0"
              >
                <div className="flex md:items-center w-full md:w-auto">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden mr-4 shrink-0">
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
                    <h3 className="text-lg font-semibold">{company.name}</h3>
                    <p className="text-sm text-gray-500">
                      <span className="inline-block shrink-0 pr-1 translate-y-0.5">
                        <MapPin size={15} />
                      </span>
                      {company.address}
                    </p>
                    <div className="mt-2 flex items-center">
                      <span className="font-semibold mr-2">
                        {company.ratingsAverage
                          ? company.ratingsAverage.toFixed(1)
                          : "0.0"}
                      </span>
                      <span className=" text-sm flex items-center gap-2">
                        <span className="text-yellow-400 inline-block">
                          {"★".repeat(
                            Math.round(company.ratingsAverage || 0),
                          )}{" "}
                        </span>
                        <span className="font-medium inline-block">
                          {company.ratingsQuantity} Reviews
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start w-full md:w-auto">
                  <p className="text-xs text-gray-600 mb-0 md:mb-4">
                    Founded on -{" "}
                    {new Date(company.foundedYear).toLocaleString("en-IN", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>

                  <Button
                    theme="dark"
                    text="Detail Review"
                    link={`/company/${company.id}`}
                    role="link"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
