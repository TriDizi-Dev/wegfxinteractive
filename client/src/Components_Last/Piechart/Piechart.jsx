
import React, { useEffect, useState } from "react";
// import "../../assets/Pieimages/Picture1.png";
import "./Piechart.css"; // Make sure this path is correct for your CSS file
// import logo from '../../assets/Pieimages/Think.png';
import Think from "../../assets/Pieimages/Think1b.png"; // Import your logo image
import { auth, database } from "../../Firebase/firebase";
import { ref, get, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../Components/Navbar/Navbar";
function Pie() {
  const [ageGroup, setAgeGroup] = useState("Beginner");
  const [Userdata, setUserdata] = useState({});
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
                Welcome
              </h2>
              <p className="highlight-name">{Userdata?.name}</p>
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

            {/* Pie Chart Section */}
            <div className="pie-chart-section">
              <div className="pie-chart-container">
                {/* Using conic-gradient for a more accurate pie chart representation */}
                <div className="pie-chart">
                  <span className="pie-label english-label">English</span>
                  <span className="pie-label gk-label">GK</span>
                  <span className="pie-label maths-label">Maths</span>
                  <span className="pie-label social-label">Social</span>
                  <span className="pie-label science-label">Science</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Pie;
