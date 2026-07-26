import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600"
        >
          AI Interview Coach
        </Link>

        <Link
          to="/interview"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          Start Interview
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;