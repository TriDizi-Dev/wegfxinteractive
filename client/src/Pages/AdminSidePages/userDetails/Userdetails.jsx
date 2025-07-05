import React, { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { auth, database } from "../../../Firebase/firebase";
import moment from "moment";
import "./UserDetails.css";

const UserDetails = () => {
  const [users, setUsers] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const waitForAuth = () =>
          new Promise((resolve) => {
            const unsubscribe = auth.onAuthStateChanged((user) => {
              unsubscribe();
              resolve(user);
            });
          });

        const currentUser = await waitForAuth();

        if (!currentUser) {
          setError("You must be logged in to access this page.");
          setLoading(false);
          return;
        }

        const roleSnapshot = await get(
          ref(database, `users/${currentUser.uid}/role`)
        );

        const role = roleSnapshot.val();
        if (role !== "admin") {
          setError("Access denied. Only admins can view this page.");
          setLoading(false);
          return;
        }

        const usersRef = ref(database, "users");
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
          setUsers(snapshot.val());
        } else {
          setError("No user data found.");
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p className="loading">🔄 Loading user data...</p>;
  if (error) return <p className="error-message">⚠️ {error}</p>;

  return (
    <div className="admin-wrapper">
      <h1 className="admin-title">📋 User Activity Overview</h1>

      {Object.entries(users)
        .filter(([uid]) => uid !== auth.currentUser?.uid)
        .map(([uid, user]) => (
          <div key={uid} className="user-card">
            <h2 className="user-email" title={user.email}>
              📧 {user.email}
            </h2>

            <div className="info-grid">
              <div>
                <p>
                  <strong>👤 Role:</strong> {user.role || "N/A"}
                </p>
                <p>
                  <strong>💳 Plan Type:</strong> {user.plan?.type || "N/A"}
                </p>
                <p>
                  <strong>⏳ Start:</strong>{" "}
                  {user.plan?.startTime
                    ? moment(user.plan.startTime).format("LLL")
                    : "N/A"}
                </p>
                <p>
                  <strong>🕒 End:</strong>{" "}
                  {user.plan?.endTime
                    ? moment(user.plan.endTime).format("LLL")
                    : "N/A"}
                </p>
              </div>

              <div>
                <p>
                  <strong>📂 Categories Attempted:</strong>{" "}
                  {Object.keys(user.attemptedQuestions || {}).join(", ") ||
                    "None"}
                </p>
                <p>
                  <strong>🧮 Total Categories:</strong>{" "}
                  {Object.keys(user.attemptedQuestions || {}).length}
                </p>
                <p>
                  <strong>🔁 Total Quiz Attempts:</strong>{" "}
                  {Object.values(user.quizResults || {}).reduce(
                    (total, cat) => total + Object.keys(cat || {}).length,
                    0
                  )}
                </p>
              </div>
            </div>

            <div className="quiz-section">
              <h3>📊 Quiz Results:</h3>
              {user.quizResults ? (
                Object.entries(user.quizResults).map(([category, attempts]) => (
                  <div key={category} className="quiz-category-block">
                    <p className="quiz-category">📚 {category}</p>
                    <ul>
                      {Object.entries(attempts).map(([attemptId, result]) => (
                        <li key={attemptId}>
                          <strong>
                            {moment(result.date).format("DD MMM YYYY, h:mm A")}
                          </strong>{" "}
                          — ✅ {result.correctAnswers} /{" "}
                          {result.totalQuestions} correct, ❌ {result.wrongAnswers} wrong,
                          🧮 Total Score: {(result.correctAnswers)*10}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p>No quiz results found.</p>
              )}
            </div>

            <div className="quiz-section">
              <h3>📝 Attempted Questions:</h3>
              {user.attemptedQuestions ? (
                Object.entries(user.attemptedQuestions).map(
                  ([category, questions]) => (
                    <p key={category}>
                      📁 <strong>{category}:</strong>{" "}
                      {Object.keys(questions).length} questions attempted
                    </p>
                  )
                )
              ) : (
                <p>No questions attempted.</p>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default UserDetails;
