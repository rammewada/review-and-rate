import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useCompanyFilter } from "../context/CompanyFilterContext";
import SearchIcons from "./icons";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { search, setSearch } = useCompanyFilter();

  return (
    <nav className="shadow-lg drop-shadow-gray-100 bg-white relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className=" flex items-center gap-2">
              <img src="/icon.png" alt="logo" className="h-8 w-auto" />
              <span className="inline-block font-sans text-2xl">
                <span>Review</span> <span className="text-gradient">&</span>{" "}
                <span className="text-gradient font-bold">Rate</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-80 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              <button className="absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer group-hover:scale-105 transition-all duration-300">
                <SearchIcons />
              </button>
            </div>
            <button className="text-black  px-4 py-2 rounded-md hover:bg-gray-200 cursor-pointer">
              SignUp
            </button>
            <button className="text-black  px-4 py-2 rounded-md hover:bg-gray-200 cursor-pointer">
              Login
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-black focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-3 bg-white border-t border-gray-100">
          <div className="relative ">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            <button className="absolute  top-1/2 -translate-y-1/2 right-2 cursor-pointer group-hover:scale-105 transition-all duration-300">
              <SearchIcons />
            </button>
          </div>
          <button className="block w-full text-left text-black px-4 py-2 rounded-md hover:bg-gray-200 cursor-pointer">
            SignUp
          </button>
          <button className="block w-full text-left text-black px-4 py-2 rounded-md hover:bg-gray-200 cursor-pointer">
            Login
          </button>
        </div>
      )}
    </nav>
  );
}
