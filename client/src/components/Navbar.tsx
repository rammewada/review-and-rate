export default function Navbar() {
  return (
    <nav className="shadow-lg drop-shadow-gray-100">
      <div className=" max-w-7xl  mx-auto py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/icon.png" alt="logo" />
            <span className="inline-block font-sans text-2xl ">
              <span>Review</span> <span className="text-gradient">&</span>{" "}
              <span className="text-gradient font-bold">Rate</span>
            </span>
          </div>
          <div className="flex">
            <div>
              <input
                type="text"
                placeholder="Search..."
                className="border border-gray-300 rounded-md px-3 py-1 mr-2  w-md"
              />
            </div>
            <button className="text-black from-purple-500 to-indigo-600  px-4 py-1 rounded-md hover:bg-gray-200 transition-all duration-300 cursor-pointer">
              SignUp
            </button>
            <button className="text-black from-purple-500 to-indigo-600  px-4 py-1 rounded-md hover:bg-gray-200 transition-all duration-300 cursor-pointer">
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
