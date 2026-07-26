import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { saveInterview } from "../utils/storage";
import jsPDF from "jspdf";

export default function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const result = state?.result;

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center">
          <h1 className="text-3xl font-bold text-red-600">
            No Report Found
          </h1>

          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  let report;

  try {
    const cleaned =
      typeof result === "string"
        ? result
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim()
        : result;

    report =
      typeof cleaned === "string"
        ? JSON.parse(cleaned)
        : cleaned;
  } catch (err) {
    console.error(err);

    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl text-red-600">
          Invalid JSON Returned From AI
        </h1>
      </div>
    );
  }

  const saveReport = async (report, user) => {
    try {
      await addDoc(collection(db, "interviews"), {
        uid: user.uid,
        email: user.email,
        report,
        createdAt: serverTimestamp(),
      });

      console.log("Interview saved successfully");
    } catch (error) {
      console.error("Firestore Error:", error);
    }
  };

  useEffect(() => {

  const saveData = async () => {

    const alreadySaved = sessionStorage.getItem("savedInterview");

    if (alreadySaved) {
      return;
    }

    await saveReport(report);

    saveInterview(report);

    sessionStorage.setItem(
      "savedInterview",
      "true"
    );

  };

  saveData();

}, []);

    const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("AI Interview Report", 20, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);

    doc.text(`Overall Score : ${report.overallScore}%`, 20, 40);
    doc.text(`Technical : ${report.technical}%`, 20, 50);
    doc.text(`Communication : ${report.communication}%`, 20, 60);
    doc.text(`Confidence : ${report.confidence}%`, 20, 70);

    doc.setFont("helvetica", "bold");
    doc.text("AI Feedback", 20, 90);

    doc.setFont("helvetica", "normal");

    let y = 105;

    report.feedback.forEach((item, index) => {
      doc.text(`${index + 1}. ${item}`, 20, y);
      y += 10;

      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("AI_Interview_Report.pdf");
  };

  const ScoreCard = ({ title, value, color }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition duration-300">

      <h3 className="text-gray-500 font-semibold">
        {title}
      </h3>

      <h2 className={`text-4xl font-bold mt-3 ${color}`}>
        {value}%
      </h2>

      <div className="w-full h-3 bg-gray-200 rounded-full mt-5">

        <div
          className="h-3 rounded-full bg-blue-600"
          style={{
            width: `${value}%`,
          }}
        />

      </div>

    </div>
  );

    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 p-8">

      <div className="max-w-6xl mx-auto">

        <div className="bg-white rounded-3xl shadow-2xl p-10 text-center">

          <h1 className="text-5xl font-extrabold text-blue-700">
            🎉 Interview Completed
          </h1>

          <p className="text-gray-500 mt-3 text-lg">
            AI Interview Performance Report
          </p>

          <div className="mt-10">

            <div className="w-44 h-44 rounded-full bg-gradient-to-r from-green-400 to-blue-500 mx-auto flex items-center justify-center shadow-xl">

              <div className="w-36 h-36 bg-white rounded-full flex items-center justify-center">

                <span className="text-5xl font-bold text-blue-700">
                  {report.overallScore}%
                </span>

              </div>

            </div>

            <h2 className="mt-6 text-2xl font-bold">
              Overall Score
            </h2>

          </div>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">

          <ScoreCard
            title="Technical"
            value={report.technical}
            color="text-blue-600"
          />

          <ScoreCard
            title="Communication"
            value={report.communication}
            color="text-green-600"
          />

          <ScoreCard
            title="Confidence"
            value={report.confidence}
            color="text-purple-600"
          />

          <ScoreCard
            title="Overall"
            value={report.overallScore}
            color="text-red-600"
          />

        </div>

        <div className="bg-white rounded-3xl shadow-xl mt-10 p-8">

          <h2 className="text-3xl font-bold mb-6">
            💡 AI Feedback
          </h2>

          <div className="space-y-4">

            {report.feedback &&
              report.feedback.map((item, index) => (

                <div
                  key={index}
                  className="flex gap-3 bg-green-50 border-l-4 border-green-500 rounded-xl p-4"
                >

                  <span className="text-green-600 text-xl">
                    ✅
                  </span>

                  <p className="text-gray-700">
                    {item}
                  </p>

                </div>

              ))}

          </div>

        </div>

        <div className="flex flex-wrap justify-center gap-5 mt-10">

          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl shadow-lg"
          >
            🏠 Home
          </button>

          <button
            onClick={() => navigate("/interview")}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl shadow-lg"
          >
            🎤 Take Another Interview
          </button>

          <button
            onClick={() => navigate("/history")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl shadow-lg"
          >
            📜 History
          </button>

          <button
            onClick={() => navigate("/analytics")}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl shadow-lg"
          >
            📊 Analytics
          </button>

          <button
            onClick={downloadPDF}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl shadow-lg"
          >
            📄 Download PDF
          </button>

        </div>

      </div>

    </div>
  );
}