import React, { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../Components/AuthContext";
import "./Quiz.css";
import backgroundImg from "../../../assets/home/bg.jpg";
import logo from "../../../assets/home/logo.gif";
import think from "../../../assets/home/Think.png";
import ribbon from "../../../assets/home/congratulation.png";
import trophy from "../../../assets/home/trophy.png";
import { auth, database } from "../../../Firebase/firebase";

const QuizComponent = () => {
  const { currentUser, loading: authLoading } = useAuth();

  const [userEmail, setUserEmail] = useState("");
  const [ageRange, setAgeRange] = useState(""); // Placeholder for future use
  const [userName, setUserName] = useState("");
  const [category, setCategory] = useState("Maths");
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [feedback, setFeedback] = useState("");
  const [quizOver, setQuizOver] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  console.log(currentUser, "currentUsercurrentUser");
    const [Userdata, setUserdata] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (user) {
        const uid = user.uid;
        const userRef = ref(database, `users/${uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserdata(data || {});
        }
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    // Fetch user info
    setUserEmail(currentUser.email);
    // setUserName(currentUser.displayName || "Raj Kumar");

    // Fetch categories
    get(ref(database, "questions")).then((snapshot) => {
      const catSet = new Set();
      const questionsArray = [];
      snapshot.forEach((snap) => {
        const q = snap.val();
        if (q.question_type) catSet.add(q.question_type);
        if (q.question_type === "Maths") {
          questionsArray.push({ ...q, id: snap.key });
        }
      });
      setCategories([...catSet]);
      setQuestions(questionsArray);
      setLoading(false);
    });
  }, [currentUser]);

  const fetchQuestions = async (cat) => {
    setLoading(true);
    const snap = await get(ref(database, "questions"));
    const list = [];
    snap.forEach((c) => {
      const d = c.val();
      if (d.question_type === cat) list.push({ ...d, id: c.key });
    });
    setCategory(cat);
    setQuestions(list);
    setCurrentIndex(0);
    setSelectedOption("");
    setFeedback("");
    setScore(0);
    setQuizOver(false);
    setLoading(false);
  };

  const handleAnswer = (option) => {
    if (selectedOption) return;
    const current = questions[currentIndex];
    const isCorrect = option === current.answer;
    setSelectedOption(option);
    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) setScore((prev) => prev + 1);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption("");
      setFeedback("");
    } else {
      setQuizOver(true);
    }
  };

  const handleRestart = () => {
    fetchQuestions("Maths");
  };

  if (authLoading) return <div>Loading...</div>;
  if (!currentUser) return <Navigate to="/" />;

  return (
    <div
      className="quiz-wrapper"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      {/* HEADER */}
      <div className="quiz-header">
        <img src={logo} alt="logo" className="quiz-logo" />
        <div className="quiz-header-center">
          <img src={think} alt="Think" className="think-logo" />
          <div className="quiz-header-text">
            <h2>Future - Ready Thinkers</h2>
            <p>{Userdata?.ageGroup || 0} years</p>
          </div>
        </div>
        <div className="quiz-user-info">
          <div className="user-avatar"></div>
          <span>{Userdata.name}</span>
        </div>
      </div>

      {/* CATEGORY BUTTONS */}
      <div className="quiz-categories">
        {categories.map((cat, i) => (
          <button
            key={i}
            className={`quiz-tab ${cat === category ? "active" : ""}`}
            onClick={() => fetchQuestions(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      {loading ? (
        <div className="quiz-loading">Loading...</div>
      ) : quizOver ? (
        <div className="quiz-congrats">
          <img src={ribbon} className="congrats-banner" alt="congrats" />
          <img src={trophy} className="trophy-image" alt="trophy" />
          <h2>You Completed the Objectives</h2>
          <p className="user-name">Name : {Userdata.name}</p>
          <p className="score">
            Score : {score * 10} / {questions.length * 10}
          </p>
          <button className="restart-btn" onClick={handleRestart}>
            Restart
          </button>
        </div>
      ) : (
        <div className="quiz-question-box">
          <h3>
            Q{currentIndex + 1}: {questions[currentIndex]?.question}
          </h3>
          <div className="quiz-options">
            {["option1", "option2", "option3", "option4"].map((opt, i) => (
              <button
                key={i}
                className={`quiz-option-btn ${
                  selectedOption === questions[currentIndex][opt]
                    ? questions[currentIndex][opt] ===
                      questions[currentIndex].answer
                      ? "correct"
                      : "wrong"
                    : ""
                }`}
                onClick={() => handleAnswer(questions[currentIndex][opt])}
                disabled={!!selectedOption}
              >
                {String.fromCharCode(65 + i)}. {questions[currentIndex][opt]}
              </button>
            ))}
          </div>
          <button
            className="quiz-next-btn"
            onClick={handleNext}
            disabled={!selectedOption}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizComponent;

//sai vamshi
