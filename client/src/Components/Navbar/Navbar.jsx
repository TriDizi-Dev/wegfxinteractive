import React, { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { auth, database } from "../../Firebase/firebase";
import { get, ref } from "firebase/database"; // ✅ FIXED import
import Logo from "../../assets/image.png";
import "./Navbar.css";
import { signOut } from "firebase/auth";

export const Navbar = () => {
  const [Userdata, setUserdata] = useState({});
  const [showLogout, setShowLogout] = useState(false);

  console.log(Userdata, "UserdataUserdata");

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (user) {
        const uid = user.uid;
        const userRef = ref(database, `users/${uid}`); // ✅ Make sure 'database' is from getDatabase()
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserdata(data || {});
        }
      }
    };
    fetchUser();
  }, []);
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Optional: redirect to login page or show message
      window.location.href = "/"; // Or your login route
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="Main_NavBar_Css">
      <div className="Main_Logo_Image">
        <img src={Logo} alt="Name" />
        <button
          className="back-arrow-btn"
          onClick={() => window.history.back()}
        >
          ← Back
        </button>
      </div>

      <div className="quiz-user-info">
        <span>{Userdata.name}</span>
        <div className="user-avatar" onClick={() => setShowLogout(!showLogout)}>
          <CgProfile />
          {showLogout && (
            <div className="logout-popup">
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
