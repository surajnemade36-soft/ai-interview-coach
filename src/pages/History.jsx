import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function History() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setHistory([]);
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, "interviews"),
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const unsubscribeFirestore = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setHistory(data);
          setLoading(false);
        },
        (error) => {
          console.error(error);
          setLoading(false);
        }
      );

      return unsubscribeFirestore;
    });

    return () => unsubscribeAuth();
  }, []);

  const handleDelete = async (id) => {
    const ok = window.confirm(
      "Delete this interview?"
    );

    if (!ok) return;

    try {
      await deleteDoc(doc(db, "interviews", id));
    } catch (err) {
      console.error(err);
    }
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
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex flex-col items-center justify-center">

        <h1 className="text-4xl font-bold text-blue-700">
          No Interview History Found
        </h1>

        <button
          onClick={() => navigate("/")}
          className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl"
        >
          Start Interview
        </button>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 p-8">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-bold text-center text-blue-700 mb-10">
          📜 Interview History
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {history.map((item, index) => {

            const report = item.report || {};

            return (

              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition"
              >

                <h2 className="text-xl font-bold text-blue-600">
                  Interview #{history.length - index}
                </h2>

                <p className="text-gray-500 mt-2">
                  {item.createdAt
                    ? item.createdAt.toDate().toLocaleString()
                    : "No Date"}
                </p>

                <div className="mt-5 space-y-3">

                  <div className="flex justify-between bg-blue-100 p-3 rounded-lg">
                    <span>Overall</span>
                    <span className="font-bold">
                      {report.overallScore ?? 0}%
                    </span>
                  </div>

                  <div className="flex justify-between bg-green-100 p-3 rounded-lg">
                    <span>Technical</span>
                    <span className="font-bold">
                      {report.technical ?? 0}%
                    </span>
                  </div>

                  <div className="flex justify-between bg-yellow-100 p-3 rounded-lg">
                    <span>Communication</span>
                    <span className="font-bold">
                      {report.communication ?? 0}%
                    </span>
                  </div>

                  <div className="flex justify-between bg-purple-100 p-3 rounded-lg">
                    <span>Confidence</span>
                    <span className="font-bold">
                      {report.confidence ?? 0}%
                    </span>
                  </div>

                </div>

                <button
                  className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl"
                  onClick={() =>
                    navigate("/result", {
                      state: {
                        result: item.report,
                      },
                    })
                  }
                >
                  📄 View Report
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl"
                >
                  🗑 Delete Interview
                </button>

              </div>

            );
          })}

        </div>

      </div>

    </div>
  );
}