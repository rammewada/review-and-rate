import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

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

  useEffect(() => {
    async function fetchCompanies() {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:4000/api/company");

        const data: Company[] = res?.data?.data?.companies || [];
        setCompanies(data);
      } catch (err: any) {
        setError(err?.message || "Failed to fetch companies");
      } finally {
        setLoading(false);
      }
    }

    fetchCompanies();
  }, []);

  const renderImage = (logo: string) => {
    const normalized = logo.replace(/\\/g, "/");
    if (/^https?:\/\//i.test(normalized)) return normalized;
    return `http://localhost:4000/${normalized}`;
  };

  return (
    <section className="py-6">
      <div className="max-w-5xl mx-auto">
        {loading && (
          <div className="text-center py-8">Loading companies...</div>
        )}
        {error && <div className="text-red-600 text-center py-4">{error}</div>}

        {!loading && !error && (
          <div className="space-y-6">
            {companies.map((c) => (
              <div
                key={c._id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-4 md:p-6 rounded-lg shadow-md gap-4 md:gap-0"
              >
                <div className="flex items-center w-full md:w-auto">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mr-4 shrink-0">
                    <img
                      src={renderImage(c.logo)}
                      alt={c.name}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{c.name}</h3>
                    <p className="text-sm text-gray-500">{c.address}</p>
                    <div className="mt-2 flex items-center">
                      <span className="font-semibold mr-2">
                        {c.ratingsAverage ? c.ratingsAverage.toFixed(1) : "0.0"}
                      </span>
                      <span className="text-yellow-400 text-sm">
                        {"★".repeat(Math.round(c.ratingsAverage || 0))}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start w-full md:w-auto">
                  <p className="text-sm text-gray-600 mb-0 md:mb-4">
                    Founded: {c.foundedYear}
                  </p>

                  <Link
                    to={`/company/${c.id}`}
                    className="px-4 py-2 bg-gray-800 text-white text-sm md:text-base rounded hover:bg-gray-700 transition"
                  >
                    Detail Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
