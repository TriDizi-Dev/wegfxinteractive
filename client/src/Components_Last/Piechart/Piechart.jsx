import React, { useEffect, useState } from "react";
// import "../../assets/Pieimages/Picture1.png";
import "./Piechart.css"; // Make sure this path is correct for your CSS file
// import logo from '../../assets/Pieimages/Think.png';
import Think from "../../assets/Pieimages/Think1b.png"; // Import your logo image
import { auth, database } from "../../Firebase/firebase";
import { ref, get, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../Components/Navbar/Navbar";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// const questionData = [
//   { name: "English", value: 45 },
//   { name: "GK", value: 20 },
//   { name: "Maths", value: 15 },
//   { name: "Social", value: 10 },
//   { name: "Science", value: 10 },
// ];


function PiePage() {
  const [ageGroup, setAgeGroup] = useState("Beginner");
  const [Userdata, setUserdata] = useState({});
  const [outerRadius, setOuterRadius] = useState(180);
  const [questionData, setQuestionData] = useState([]);

useEffect(() => {
  const fetchQuestions = async () => {
    try {
      const questionsRef = ref(database, "questions");
      const snapshot = await get(questionsRef);

      if (snapshot.exists()) {
        const questions = snapshot.val();

        const subjectCount = {};

        // Count the number of questions per question_type
        Object.values(questions).forEach((q) => {
          const type = q.question_type;
          if (type) {
            subjectCount[type] = (subjectCount[type] || 0) + 1;
          }
        });

        // Convert the count to the format needed by the Pie chart
        const chartData = Object.entries(subjectCount).map(([name, value]) => ({
          name,
          value,
        }));

        setQuestionData(chartData);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  fetchQuestions();
}, []);
const COLORS = ["#6a1b9a", "#e74c3c", "#3498db", "#5dade2", "#2ecc71", "#C00000"];

const CustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontWeight: "bold", fontSize: "13px" }}
    >
      {questionData[index].name}
    </text>
  );
};

  useEffect(() => {
    const updateRadius = () => {
      if (window.innerWidth < 768) {
        setOuterRadius(150); // smaller radius for mobile
      } else {
        setOuterRadius(180); // default for desktop
      }
    };

    updateRadius(); // set initially
    window.addEventListener("resize", updateRadius); // update on resize

    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  const navigate = useNavigate("");
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
  const handleAgeGroupChange = (event) => {
    setAgeGroup(event.target.value);
  };

  const handleStartClick = () => {
    console.log(`Starting with age group: ${ageGroup}`);
    navigate("/quiz");
    // Add navigation or other logic here
  };

  return (
    <div>
      <Navbar />

      <div className="pie">
        <div className="app-container">
          {/* Main Content */}
          <main className="app-main-content">
            {/* Welcome Section */}
            <div className="welcome-section">
              <div className="think-logo">
                {/* <h1 className="think-text">Think</h1> */}
                <img src={Think} alt="Think" className="think-logo-image" />
              </div>

              <h2 className="welcome-message">
                <span className="star-icon1">✰</span>
                <span className="star-icon2">✰</span>
                {/* <span className="star-icon">⭐️</span> */}
                Welcome&nbsp;<b className="highlight-name">{Userdata?.name}</b>
              </h2>
              {/* <p className="highlight-name"></p> */}
              <p className="ready-message">Ready to conquer today?</p>
              <p className="learning-message">Let's make learning awesome!</p>

              <div className="foundation-section">
                <p className="foundation-title">{Userdata?.ageGroup?.title}</p>
                <p className="age-range">Age {Userdata?.ageGroup?.age} years</p>
                <div className="input-group">
                  <button className="start-button" onClick={handleStartClick}>
                    Start
                  </button>
                </div>
              </div>
            </div>
            {/* <div className="pie-chart-section"> */}
            {/* <div className="pie-chart-container">
                {" "}
                <div className="pie-chart">
                  <span className="pie-label english-label">English</span>
                  <span className="pie-label gk-label">GK</span>
                  <span className="pie-label maths-label">Maths</span>
                  <span className="pie-label social-label">Social</span>
                  <span className="pie-label science-label">Science</span>
                </div>
              </div> */}
            <div className="pie-chart-section">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={questionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={outerRadius}
                    labelLine={false}
                    label={CustomLabel}
                    dataKey="value"
                  >
                    {questionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* </div> */}
          </main>
        </div>
      </div>
    </div>
  );
}

export default PiePage;
