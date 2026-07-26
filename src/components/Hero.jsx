import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="text-center py-24 px-6">
      <h1 className="text-6xl font-bold text-gray-800">
        Ace Your Next Interview 🚀
      </h1>

      <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
        Practice HR and Technical Interviews using Artificial Intelligence.
        Get instant feedback, interview scores, and personalized suggestions.
      </p>

      <Link
        to="/interview"
        className="inline-block mt-10 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-lg"
      >
        Get Started
      </Link>
    </section>
  );
}

export default Hero;