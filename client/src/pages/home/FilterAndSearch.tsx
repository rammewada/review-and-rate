import { Activity } from "react";
import AddCompanyModal from "../../components/AddCompany";
import { Button } from "../../components/Button";
import SearchIcons from "../../components/icons";
import { useCompanyFilter } from "../../context/CompanyFilterContext";

export default function FilterAndSearch() {
  const {
    search,
    setSearch,
    topRated,
    setTopRated,
    showAddCompany,
    setShowAddCompany,
  } = useCompanyFilter();

  const handleSortChange = (value: string) => {
    setTopRated(value === "topRated");
  };

  const sortValue = topRated ? "topRated" : "name";

  return (
    <section className="max-w-5xl mx-auto border-b border-gray-100 bg-white">
      <div className="  py-4 md:py-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="">
          <label className="block text-xs md:text-sm text-gray-500 mb-1">
            Search
          </label>
          <div className="flex flex-wrap gap-1 md:gap-3 justify-between">
            <div className="relative max-w-md  flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Graffersid, Indore, Madhya Pradesh"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className=" border w-[230px] md:w-md border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 "
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <SearchIcons />
                </div>
              </div>
            </div>
            <Button
              theme="blue"
              text="Find Company"
              type="button"
              className="text-nowrap"
            />
          </div>
        </div>
        <div className="flex gap-x-4 justify-between">
          <div className="">
            <Button
              theme="blue"
              text="+ Add Company"
              type="button"
              onClick={() => setShowAddCompany(true)}
            />
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-xs md:text-sm text-gray-600">Sort:</span>
            <select
              value={sortValue}
              onChange={(e) => handleSortChange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
            >
              <option value="name">Name</option>
              <option value="topRated">Top Rated</option>
            </select>
          </div>
        </div>
      </div>
      <Activity mode={showAddCompany ? "visible" : "hidden"}>
        <AddCompanyModal
          open={showAddCompany}
          onClose={() => setShowAddCompany(false)}
        />
      </Activity>
    </section>
  );
}
