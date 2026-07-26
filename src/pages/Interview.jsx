import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateInterviewQuestions } from "../services/groq";
import { evaluateInterview } from "../api/evaluate";

export default function Interview() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "",
    level: "Fresher",
    questions: 5,
  });

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const recognitionRef = useRef(null);


  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const startInterview = async () => {
    sessionStorage.removeItem("savedInterview");
  try {
    setLoading(true);

    const result = await generateInterviewQuestions(
      formData.role,
      formData.level,
      formData.questions
    );

    const questionList = result
      .split("\n")
      .filter((q) => q.trim() !== "")
      .map((q) =>
        q
          .replace(/^\d+\.\s*/, "")
          .replace(/^\*\*\d+\.\s*/, "")
          .replace(/\*\*/g, "")
      );

    setQuestions(questionList);
    setCurrentQuestion(0);
    setTimeLeft(60);
    setAnswers([]);
    setAnswer("");

  } catch (error) {
    console.error(error);
    alert("Failed to generate questions.");
  } finally {
    setLoading(false);
  }
};

  const previousQuestion = () => {
    const updated = [...answers];
    updated[currentQuestion] = answer;
    setAnswers(updated);

    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setTimeLeft(60);
      setAnswer(updated[currentQuestion - 1] || "");
    }
  };

  const nextQuestion = () => {
    const updated = [...answers];
    updated[currentQuestion] = answer;
    setAnswers(updated);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(60);
      setAnswer(updated[currentQuestion + 1] || "");
    }
  };

  const finishInterview = async () => {
  const updatedAnswers = [...answers];
  updatedAnswers[currentQuestion] = answer;

  try {
    const result = await evaluateInterview(
      questions,
      updatedAnswers
    );

    navigate("/result", {
      state: {
        result,
      },
    });

  } catch (error) {
    console.error(error);
    alert("Evaluation Failed");
  }
};
const startRecording = () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech Recognition is not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.interimResults = true;
  recognition.continuous = true;

  recognition.onresult = (event) => {
    let transcript = "";

    for (let i = 0; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }

    setAnswer(transcript);
  };

  recognition.onend = () => {
    setIsRecording(false);
  };

  recognition.start();

  recognitionRef.current = recognition;
  setIsRecording(true);
};

const stopRecording = () => {
  if (recognitionRef.current) {
    recognitionRef.current.stop();
    setIsRecording(false);
  }
};
useEffect(() => {
  if (questions.length === 0) return;

  const timer = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        clearInterval(timer);

        if (currentQuestion < questions.length - 1) {
          nextQuestion();
        } else {
          finishInterview();
        }

        return 60;
      }

      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);

}, [currentQuestion, questions.length]);

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center p-6">

      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-3xl">

        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          AI Interview Setup
        </h1>

        {questions.length === 0 && (
            
          <>
          
            <label className="block font-semibold mb-2">
              Job Role
            </label>

            <input
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="Software Engineer"
              className="w-full border rounded-lg p-3 mb-5"
            />

            <label className="block font-semibold mb-2">
              Experience
            </label>
            
           

            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mb-5"
            >
              <option>Fresher</option>
              <option>1-2 Years</option>
              <option>3-5 Years</option>
              <option>5+ Years</option>
            </select>

            <label className="block font-semibold mb-2">
              Number of Questions
            </label>
             

            <select
              name="questions"
              value={formData.questions}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mb-6"
            >
                <option>1</option>
                <option>2</option>
              <option>5</option>
              <option>10</option>
              <option>15</option>
            </select>

          

            <button
              onClick={startInterview}
              className="w-full bg-blue-600 text-white py-3 rounded-lg"
            >
              Start AI Interview
            </button>

            {loading && (
              <p className="text-blue-600 mt-4">
                Generating Questions...
              </p>
            )}
          </>
        )}

        {questions.length > 0 && (
          <>
           <div className="flex justify-between items-center mb-6">

  <div>
   
  </div>

  <div
    className={`px-6 py-3 rounded-full text-white text-xl font-bold shadow-lg ${
      timeLeft <= 10
        ? "bg-red-600 animate-pulse"
        : "bg-blue-600"
    }`}
  >
    ⏱ {timeLeft}s
  </div>

</div>

            <h2 className="text-xl font-bold text-blue-600">
              Question {currentQuestion + 1} of {questions.length}
            </h2>

            <div className="bg-gray-100 rounded-lg p-5 mt-4">
              <p className="text-lg">
                {questions[currentQuestion]}
              </p>
            </div>

            <div className="mt-6">

              <label className="font-semibold block mb-2">
                Your Answer
              </label>

              <textarea
                rows="7"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full border rounded-lg p-4"
                placeholder="Type your answer..."
              />

            </div>
            <div className="flex gap-4 mt-4">

  {!isRecording ? (
    <button
      onClick={startRecording}
      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
    >
      🎤 Start Recording
    </button>
  ) : (
    <button
      onClick={stopRecording}
      className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg"
    >
      ⏹ Stop Recording
    </button>
  )}

</div>

            <div className="flex justify-between mt-6">

              <button
                onClick={previousQuestion}
                disabled={currentQuestion === 0}
                className="bg-gray-300 px-6 py-2 rounded disabled:opacity-50"
              >
                Previous
              </button>

              {currentQuestion < questions.length - 1 ? (
                <button
                  onClick={nextQuestion}
                  className="bg-blue-600 text-white px-6 py-2 rounded"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={finishInterview}
                  className="bg-green-600 text-white px-6 py-2 rounded"
                >
                  Finish Interview
                </button>
              )}

            </div>

          </>
        )}

      </div>

    </div>
  );
}