// QuizComponent.jsx
import React, { useEffect, useState } from "react";
import { ref, get, child, set, push, onValue } from "firebase/database";
import { auth, database } from "../../../Firebase/firebase";
import "./Quiz.css";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

const QuizComponent = () => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [quizOver, setQuizOver] = useState(false);
  const [score, setScore] = useState(0);
  const [resultsSaved, setResultsSaved] = useState(false);
  const [history, setHistory] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  const [planEndTime, setPlanEndTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/"); // Navigate to home or login page
      })
      .catch((error) => {
        console.error("Sign out failed:", error);
      });
  };

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const planRef = ref(database, `users/${uid}/plan`);
    get(planRef).then((snapshot) => {
      if (snapshot.exists()) {
        const planData = snapshot.val();
        setPlanEndTime(planData.endTime);
      }
    });
  }, []);

  useEffect(() => {
    if (!planEndTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const distance = planEndTime - now;

      if (distance <= 0) {
        clearInterval(interval);
        setTimeLeft("Plan Expired");
        navigate("/slectPlanpage");
        return;
      }

      const totalHours = Math.floor(distance / (1000 * 60 * 60));

      if (totalHours >= 24) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
        setTimeLeft(`${days} day(s) ${hours} hour(s) left`);
      } else {
        const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((distance / (1000 * 60)) % 60);
        const seconds = Math.floor((distance / 1000) % 60);
        setTimeLeft(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [planEndTime]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snapshot = await get(ref(database, "questions"));
        const categorySet = new Set();
        if (snapshot.exists()) {
          snapshot.forEach((childSnap) => {
            const data = childSnap.val();
            if (data.question_type) categorySet.add(data.question_type);
          });
        }
        setCategories([...categorySet]);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const userRef = ref(database, `users/${uid}`);
    get(userRef).then((snap) => {
      if (snap.exists()) {
        setUserEmail(snap.val().email);
      }
    });
  }, []);

  const fetchQuestions = async (selectedCategory) => {
    setLoading(true);
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    try {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, "questions"));
      const attemptedRef = child(
        dbRef,
        `users/${uid}/attemptedQuestions/${selectedCategory}`
      );
      let attemptedSnapshot = await get(attemptedRef);

      const attempted = attemptedSnapshot.exists()
        ? Object.values(attemptedSnapshot.val())
        : [];
      const all = [];
      snapshot.forEach((childSnap) => {
        const q = { ...childSnap.val(), id: childSnap.key };
        if (q.question_type === selectedCategory && !attempted.includes(q.id)) {
          all.push(q);
        }
      });

      if (all.length === 0) {
        await set(attemptedRef, {});
        attemptedSnapshot = await get(attemptedRef);
        const retryList = [];
        snapshot.forEach((childSnap) => {
          const q = { ...childSnap.val(), id: childSnap.key };
          if (q.question_type === selectedCategory) {
            retryList.push(q);
          }
        });
        const reshuffled = retryList
          .sort(() => 0.5 - Math.random())
          .slice(0, 30);
        setQuestions(reshuffled);
      } else {
        const shuffled = all.sort(() => 0.5 - Math.random()).slice(0, 30);
        setQuestions(shuffled);
      }

      setCurrentIndex(0);
      setScore(0);
      setSelectedOption("");
      setQuizOver(false);
      setFeedback("");
      setResultsSaved(false);
    } catch (error) {
      console.error("Failed to load questions", error);
    }

    setLoading(false);
  };

  const handleAnswer = async (option) => {
    if (selectedOption) return;
    setSelectedOption(option);
    const isCorrect = option === questions[currentIndex]?.answer;
    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) setScore((prev) => prev + 1);

    const uid = auth.currentUser?.uid;
    const questionId = questions[currentIndex]?.id;
    if (uid && questionId && category) {
      await set(
        ref(
          database,
          `users/${uid}/attemptedQuestions/${category}/${questionId}`
        ),
        questionId
      );
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption("");
      setFeedback("");
    } else {
      setQuizOver(true);
    }
  };

  useEffect(() => {
    const saveResults = async () => {
      if (!quizOver || resultsSaved) return;
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      try {
        const resultRef = push(
          ref(database, `users/${uid}/quizResults/${category}`)
        );
        await set(resultRef, {
          totalQuestions: questions.length,
          correctAnswers: score,
          wrongAnswers: questions.length - score,
          totalScore: score * 10,
          date: new Date().toISOString(),
        });
        setResultsSaved(true);
        fetchHistory();
      } catch (err) {
        console.error("Error saving quiz results:", err);
      }
    };
    saveResults();
  }, [quizOver, resultsSaved]);

  const fetchHistory = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    try {
      const snap = await get(ref(database, `users/${uid}/quizResults`));
      if (snap.exists()) {
        const data = snap.val();
        const results = [];
        Object.entries(data).forEach(([cat, records]) => {
          Object.entries(records).forEach(([id, rec]) => {
            results.push({ category: cat, ...rec });
          });
        });
        setHistory(results.sort((a, b) => new Date(b.date) - new Date(a.date)));
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    fetchQuestions(cat);
  };

  if (!category) {
    return (
      <>
        <div className="quiz-timer">
          Plan Expires In: <span>{timeLeft}</span>
        </div>
        <div className="quiz-header">
          <div className="quiz-user">👤 {userEmail}</div>
          <button className="signout-btn" onClick={handleLogout}>
            🚪 Sign Out
          </button>
        </div>

        <div className="quiz-container">
          <h2>Select a Category</h2>
          <div className="category-buttons">
            {categories.length === 0 ? (
              <p>Loading categories...</p>
            ) : (
              categories.map((cat) => (
                <button key={cat} onClick={() => handleCategorySelect(cat)}>
                  {cat}
                </button>
              ))
            )}
          </div>
        </div>
        {history.length > 0 && (
          <div className="quiz-history">
            <h3 className="history-title">📚 Your Quiz History</h3>
            <div className="history-list">
              {history.map((res, idx) => (
                <div className="history-item" key={idx}>
                  <div className="history-date">
                    <span>{new Date(res.date).toLocaleString()}</span>
                    <span className="score">{res.totalScore} pts</span>
                  </div>
                  <div className="history-details">
                    <span className="category">{res.category}</span>
                    <span className="score">
                      {res.correctAnswers}/{res.totalQuestions} correct
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  }

  if (loading) return <div className="quiz-loader">Loading...</div>;

  if (quizOver) {
    return (
      <div className="quiz-complete">
        <div className="quiz-timer">
          Plan Expires In: <span>{timeLeft}</span>
        </div>
        <div className="user-score-header">
          <span className="username">{userEmail}</span>
        </div>
        <h2>Quiz Completed 🎉</h2>
        {/* <p>
          <strong>User:</strong> {userEmail}
        </p> */}
        <p>
          <strong>Category:</strong> {category}
        </p>
        <p>
          <strong>Total Questions:</strong> {questions.length}
        </p>
        <p>
          <strong>Correct Answers:</strong> {score}
        </p>
        <p>
          <strong>Wrong Answers:</strong> {questions.length - score}
        </p>
        <p>
          <strong>Total Score:</strong> {score * 10} pts
        </p>

        <button
          onClick={() => {
            setCategory("");
            setQuestions([]);
            setCurrentIndex(0);
          }}
        >
          Take Another Quiz
        </button>
      </div>
    );
  }

  const q = questions[currentIndex];
  const options = [q?.option1, q?.option2, q?.option3, q?.option4];

  return (
    <div className="quiz-container">
      <div className="quiz-timer">
        Plan Expires In: <span>{timeLeft}</span>
      </div>
      {/* Back Button */}
      <button
        className="back-button"
        onClick={() => {
          setCategory("");
          setQuestions([]);
          setCurrentIndex(0);
          setSelectedOption("");
          setQuizOver(false);
          setFeedback("");
        }}
      >
        ←
      </button>

      <div className="user-score-header">
        <span className="username">{userEmail}</span>
        <span className="score">{score * 10} pts</span>
      </div>

      <h3 className="question-title">
        ({currentIndex + 1}/{questions?.length}) {q?.question}
      </h3>

      <div className="options-container">
        {options.map((opt, index) => (
          <button
            key={index}
            className={`option-btn ${
              selectedOption
                ? opt === q.answer
                  ? "correct"
                  : opt === selectedOption
                  ? "wrong"
                  : ""
                : ""
            }`}
            onClick={() => handleAnswer(opt)}
            disabled={!!selectedOption}
          >
            {opt}
          </button>
        ))}
      </div>

      {feedback && (
        <div className={`feedback-message ${feedback}`}>
          {feedback === "correct" ? "Correct! 🎉" : "Wrong ❌"}
        </div>
      )}
      <div className="next-question-btn_main">
        <button
          className="next-question-btn"
          onClick={handleNextQuestion}
          disabled={!selectedOption}
        >
          Next Question
        </button>
      </div>
    </div>
  );
};

export default QuizComponent;
