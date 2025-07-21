import React, { useEffect, useState } from "react";
import { ref, get, set } from "firebase/database";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../Components/AuthContext";
import "./Quiz.css";
import backgroundImg from "../../../assets/home/bg.jpg";
import logo from "../../../assets/home/logo.gif";
import think from "../../../assets/AllWebpAssets/Asset3.webp";
import ribbon from "../../../assets/home/congratulation.png";
import trophy from "../../../assets/home/trophy.png";
import { auth, database } from "../../../Firebase/firebase";
import { CgProfile } from "react-icons/cg";
import { Navbar } from "../../../Components/Navbar/Navbar";
import Foundation from "../../../assets/AllWebpAssets/Asset5.webp";
import Explosive from "../../../assets/AllWebpAssets/Asset6.webp";
import FutureReaady from "../../../assets/AllWebpAssets/Asset7.webp";
import congrates from "../../../assets/AllWebpAssets/Asset16.webp";

const QuizComponent = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const [category, setCategory] = useState("Maths");
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [feedback, setFeedback] = useState("");
  const [quizOver, setQuizOver] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
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

  // const fetchQuestions = async (cat) => {
  //   setLoading(true);
  //   const snap = await get(ref(database, "questions"));
  //   const list = [];
  //   snap.forEach((c) => {
  //     const d = c.val();
  //     if (d.question_type === cat) list.push({ ...d, id: c.key });
  //   });
  //   setCategory(cat);
  //   setQuestions(list);
  //   setCurrentIndex(0);
  //   setSelectedOption("");
  //   setFeedback("");
  //   setScore(0);
  //   setQuizOver(false);
  //   setLoading(false);
  // };

  const fetchQuestions = async (cat) => {
    setLoading(true);

    const uid = currentUser?.uid;
    if (!uid) return;

    const allSnap = await get(ref(database, "questions"));
    const fullList = [];

    // 1. Get all questions of the selected category
    allSnap.forEach((snap) => {
      const q = snap.val();
      if (q.question_type === cat) {
        fullList.push({ ...q, id: snap.key });
      }
    });

    // 2. Fetch attempted question IDs from Firebase
    const trackingRef = ref(database, `users/${uid}/quizTracking/${cat}`);
    const trackingSnap = await get(trackingRef);
    const attemptedIds = trackingSnap.exists()
      ? trackingSnap.val().attempted || []
      : [];

    // 3. Filter out attempted questions
    let unattempted = fullList.filter((q) => !attemptedIds.includes(q.id));

    // 4. If fewer than 30 unattempted, reset attempts and reshuffle
    if (unattempted.length < 30) {
      unattempted = [...fullList];
      await set(trackingRef, { attempted: [] }); // Reset tracking
    }

    // 5. Shuffle and pick 30
    const shuffled = [...unattempted].sort(() => 0.5 - Math.random());
    const selected30 = shuffled.slice(0, 30);

    // 6. Update Firebase with newly attempted question IDs
    const newAttemptedIds = [...attemptedIds, ...selected30.map((q) => q.id)];
    await set(trackingRef, { attempted: newAttemptedIds });

    // 7. Set state
    setCategory(cat);
    setQuestions(selected30);
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

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption("");
      setFeedback("");
    } else {
      setQuizOver(true);
      await updateQuizStats();
    }
  };

  const handleRestart = () => {
    // fetchQuestions("Maths");
    fetchQuestions(category);
  };

  const updateQuizStats = async () => {
    if (!currentUser || !category) return;

    const uid = currentUser.uid;
    const statsRef = ref(database, `users/${uid}/quizStats/${category}`);

    const newCorrect = score;
    const newAttempted = questions.length;

    try {
      // ✅ Always overwrite with latest values
      await set(statsRef, {
        correct: newCorrect,
        attempted: newAttempted,
      });

      console.log("✅ Stats updated with latest attempt.");
    } catch (err) {
      console.error("❌ Failed to update quiz stats:", err);
    }
  };

  let MainImage;
  if (Userdata?.ageGroup?.title === "Foundation Thinkers") {
    MainImage = Foundation;
  } else if (Userdata?.ageGroup?.title === "Explorative Thinkers") {
    MainImage = Explosive;
  } else if (Userdata?.ageGroup?.title === "Future - Ready Thinkers") {
    MainImage = FutureReaady;
  } else {
    return null;
  }

  if (authLoading) return <div>Loading...</div>;
  if (!currentUser) return <Navigate to="/" />;

  return (
    <div className="quiz-wrapper">
      <Navbar />

      {/* Header */}
      <div className="quiz-header-center">
        <img src={MainImage} alt="Think" />
        {/* <div className="think-logo_Quiz">
          <img src={think} alt="Think" />
        </div>
        <div className="quiz-header-text">
          <h2>{Userdata?.ageGroup?.title}</h2>
          <p>Age {Userdata?.ageGroup?.age || 0} years</p>
        </div> */}
      </div>

      {/* Categories */}
      <div className="quiz-categories">
        {categories.map((cat, i) => (
          <button
            key={i}
            className={`quiz-tab color-${i % 6} ${
              cat === category ? "active" : ""
            }`}
            onClick={() => fetchQuestions(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Quiz Content */}
      {loading ? (
        <div className="quiz-loading">Loading...</div>
      ) : quizOver ? (
        <div className="quiz-congrats">
          <img src={congrates} className="congrats-banner" alt="congrats" />
          <div className="Quiz_Complete_Buttom_Section">
            <div>
              <h2>You Completed the Objectives</h2>
              <p className="user-name">Name : {Userdata.name}</p>
              <p className="score">
                Score : {score * 10} / {questions.length * 10}
              </p>
            </div>
            <div>
              <img src={trophy} className="trophy-image" alt="trophy" />
            </div>
          </div>
          <button className="restart-btn" onClick={handleRestart}>
            Restart
          </button>
        </div>
      ) : (
        <div className="quiz-question-box">
          <h3>
            Q{currentIndex + 1}: {questions[currentIndex]?.question}
          </h3>

          {/* Options */}
          <div className="quiz-options">
            {["option1", "option2", "option3", "option4"].map((opt, i) => {
              const isCorrectOption =
                questions[currentIndex][opt] === questions[currentIndex].answer;
              const isSelected =
                selectedOption === questions[currentIndex][opt];

              const optionClass = selectedOption
                ? isCorrectOption
                  ? "correct"
                  : isSelected
                  ? "wrong"
                  : ""
                : "";

              return (
                <button
                  key={i}
                  className={`quiz-option-btn ${optionClass}`}
                  onClick={() => handleAnswer(questions[currentIndex][opt])}
                  disabled={!!selectedOption}
                >
                  <span className="option-label">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  <span className="option-text">
                    {questions[currentIndex][opt]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {selectedOption && (
            <div className="quiz-feedback-text">
              {feedback === "correct" ? (
                <p className="feedback-correct">✅ Correct Answer!</p>
              ) : (
                <p className="feedback-wrong">
                  ❌ Wrong Answer. The correct answer is:{" "}
                  <strong>{questions[currentIndex].answer}</strong>
                </p>
              )}
            </div>
          )}

          {/* Next Button */}
          <div className="Quiz_Next_Button">
            <button
              className="quiz-next-btn"
              onClick={handleNext}
              disabled={!selectedOption}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizComponent;
