export default function Model() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p>Model content</p>
        <button className="mt-4 cursor-pointer px-4 py-2 bg-gray-800 text-white rounded">
          Close
        </button>
      </div>
    </div>
  );
}
