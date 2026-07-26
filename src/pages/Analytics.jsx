import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";

export default function Analytics() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        loadAnalytics(user);
      } else {
        setHistory([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadAnalytics = async (user) => {
    try {
      const q = query(
        collection(db, "interviews"),
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      console.log("Documents Found:", snapshot.size);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setHistory(data);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-3xl font-bold">
        Loading...
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100">
        <h1 className="text-4xl font-bold">
          📊 No Analytics Available
        </h1>

        <button
          onClick={() => navigate("/")}
          className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-xl"
        >
          Start Interview
        </button>
      </div>
    );
  }

  const overall = history.map(
    (item) => Number(item.report?.overallScore || 0)
  );

  const average = Math.round(
    overall.reduce((a, b) => a + b, 0) / overall.length
  );

  const highest = Math.max(...overall);
  const lowest = Math.min(...overall);
  const latest = overall[0];

    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 p-8">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold text-center text-blue-700 mb-10">
          📊 Analytics Dashboard
        </h1>

        {/* Summary Cards */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <h2 className="text-gray-500">Total Interviews</h2>

            <h1 className="text-5xl font-bold text-blue-600 mt-4">
              {history.length}
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <h2 className="text-gray-500">Average Score</h2>

            <h1 className="text-5xl font-bold text-green-600 mt-4">
              {average}%
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <h2 className="text-gray-500">Highest Score</h2>

            <h1 className="text-5xl font-bold text-purple-600 mt-4">
              {highest}%
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <h2 className="text-gray-500">Latest Score</h2>

            <h1 className="text-5xl font-bold text-red-600 mt-4">
              {latest}%
            </h1>
          </div>

        </div>

                {/* Performance */}

        <div className="bg-white rounded-2xl shadow-xl mt-10 p-8">

          <h2 className="text-3xl font-bold mb-8">
            📈 Performance
          </h2>

          {history.map((item, index) => {

            const score = Number(item.report?.overallScore || 0);

            return (

              <div
                key={item.id}
                className="mb-8"
              >

                <div className="flex justify-between mb-2">

                  <span className="font-semibold">
                    Interview #{history.length - index}
                  </span>

                  <span className="font-bold text-blue-700">
                    {score}%
                  </span>

                </div>

                <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden">

                  <div
                    className={`h-5 rounded-full ${
                      score >= 80
                        ? "bg-green-500"
                        : score >= 60
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{
                      width: `${score}%`,
                    }}
                  />

                </div>

              </div>

            );

          })}

        </div>

                {/* Recent Interviews */}

        <div className="bg-white rounded-2xl shadow-xl mt-10 p-8">

          <h2 className="text-3xl font-bold mb-6">
            📋 Recent Interviews
          </h2>

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-3">
                  Interview
                </th>

                <th className="text-left py-3">
                  Date
                </th>

                <th className="text-left py-3">
                  Score
                </th>

              </tr>

            </thead>

            <tbody>

              {history.map((item, index) => (

                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="py-4">
                    Interview #{history.length - index}
                  </td>

                  <td>
                    {item.createdAt
                      ? item.createdAt.toDate().toLocaleString()
                      : "N/A"}
                  </td>

                  <td className="font-bold text-blue-600">
                    {item.report?.overallScore || 0}%
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

                {/* Statistics */}

        <div className="bg-white rounded-2xl shadow-xl mt-10 p-8">

          <h2 className="text-3xl font-bold mb-6">
            📊 Statistics
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            <div className="bg-green-100 rounded-xl p-6 text-center">

              <h3 className="text-xl font-semibold">
                Highest Score
              </h3>

              <p className="text-4xl font-bold text-green-700 mt-3">
                {highest}%
              </p>

            </div>

            <div className="bg-red-100 rounded-xl p-6 text-center">

              <h3 className="text-xl font-semibold">
                Lowest Score
              </h3>

              <p className="text-4xl font-bold text-red-700 mt-3">
                {lowest}%
              </p>

            </div>

            <div className="bg-blue-100 rounded-xl p-6 text-center">

              <h3 className="text-xl font-semibold">
                Average Score
              </h3>

              <p className="text-4xl font-bold text-blue-700 mt-3">
                {average}%
              </p>

            </div>

          </div>

        </div>

        <div className="text-center mt-10">

          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl"
          >
            🏠 Back Home
          </button>

        </div>

      </div>

    </div>
  );
}