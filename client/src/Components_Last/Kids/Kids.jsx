import React, { useEffect, useState } from "react";
import "./Kids.css";
import girl from "../../assets/Pieimages/girl.png";
import boy1 from "../../assets/Pieimages/boy1.png";
import boy2 from "../../assets/Pieimages/boy2.png";
import Think from "../../assets/Pieimages/Think1.png";
import { useNavigate } from "react-router-dom";
import { auth, database } from "../../Firebase/firebase";
import { ref, get, update } from "firebase/database";

function Kids() {
  const [userName, setUserName] = useState("");
  const [uid, setUid] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch current user's name and uid
  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (user) {
        const uid = user.uid;
        setUid(uid);
        const userRef = ref(database, `users/${uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserName(data.name || "");
        }
      }
    };
    fetchUser();
  }, []);

  // ✅ Update user's age group and redirect
  const handleAgeGroupSelect = async (ageGroup) => {
    if (!uid) return;
    const userRef = ref(database, `users/${uid}`);
    await update(userRef, { ageGroup }); // only update ageGroup, keep other data
    navigate("/plans"); // 👈 change this route if needed
  };

  return (
    <div className="kids">
      <header className="header1">
        <div className="company-logo">
          <p>A Purple'd Advertising Company</p>
        </div>
        <div className="user-profile2">
          <span>{userName || "User"}</span>
          <div className="avatar-circle">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="avatar-icon"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </div>
      </header>

      <div className="main-content">
        <img src={Think} alt="Think1" />
        <h2 className="tagline">
          Empowering <span className="highlight-blue">kids</span> to step out
          boldly into the future!
        </h2>

        <div className="thinker-sections">
          <div
            className="thinker-card"
            onClick={() => handleAgeGroupSelect("Age 5–8")}
          >
            <img
              src={girl}
              alt="Foundation Thinker"
              className="thinker-image"
            />
            <h3 className="thinker-title foundation-color">
              Foundation Thinkers
            </h3>
            <p className="thinker-age">Age 5–8 years</p>
            <p className="thinker-description">
              Build strong roots of confidence and curiosity
            </p>
          </div>

          <div
            className="thinker-card"
            onClick={() => handleAgeGroupSelect("Age 9–12")}
          >
            <img
              src={boy1}
              alt="Explorative Thinker"
              className="thinker-image"
            />
            <h3 className="thinker-title explorative-color">
              Explorative Thinkers
            </h3>
            <p className="thinker-age">Age 9–12 years</p>
            <p className="thinker-description">
              Discover talents, sharpen thinking, and express freely
            </p>
          </div>

          <div
            className="thinker-card"
            onClick={() => handleAgeGroupSelect("Age 13–16")}
          >
            <img
              src={boy2}
              alt="Future-Ready Thinker"
              className="thinker-image"
            />
            <h3 className="thinker-title future-ready-color">
              Future - Ready Thinkers
            </h3>
            <p className="thinker-age">Age 13–16 years</p>
            <p className="thinker-description">
              Prepare for real-world challenges with confidence & clarity
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Kids;
