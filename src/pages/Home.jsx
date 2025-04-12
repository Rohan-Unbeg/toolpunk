import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Hero Section */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 text-center">
        Toolpunk.com
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-8 text-center max-w-2xl">
        Free, kickass tools for Indian students, pros, and hustlers. Start with our Project Idea Generator!
      </p>

      {/* Call to Action */}
      <Link
        to="/projects"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Get Project Ideas Now
      </Link>

      {/* Future Tools Teaser */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800">Project Idea Generator</h3>
          <p className="text-gray-600 mt-2">
            Struggling with college projects? Get 3 free ideas daily or go unlimited for ₹100/month.
          </p>
          <Link to="/projectgenerator" className="text-blue-600 mt-4 inline-block hover:underline">
            Try Now →
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md opacity-50">
          <h3 className="text-xl font-semibold text-gray-800">More Tools Coming Soon</h3>
          <p className="text-gray-600 mt-2">
            PNR checkers, resume builders, and more—stay tuned for epic shit!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;