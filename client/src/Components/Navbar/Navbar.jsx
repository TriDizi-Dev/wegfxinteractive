import React, { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { auth, database } from "../../Firebase/firebase";
import { get, ref } from "firebase/database"; // ✅ FIXED import
import Logo from "../../assets/image.png";
import LogoWhite from "../../assets/AllWebpAssets/image.png";
import { useLocation } from "react-router-dom";
import "./Navbar.css";
import { signOut } from "firebase/auth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

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

  const location = useLocation();

  const hideBackButtonPaths = ["/select-age-group", "/", "/sign-up"];
  const hideLogo = ["/", "/sign-up"];

  const shouldHideBackButton = hideBackButtonPaths.includes(location.pathname);
  const shouldHideLog = hideLogo.includes(location.pathname);

  return (
    <div className="Main_NavBar_Css">
      <div className="Main_Logo_Image">
        {location.pathname === "/select-age-group" ? (
          <img src={LogoWhite} alt="Name" />
        ) : (
          <img src={Logo} alt="Name" />
        )}
        <div>
          {!shouldHideBackButton && (
            <button
              className="back-arrow-btn"
              onClick={() => window.history.back()}
            >
              ← Back
            </button>
          )}
          {/* Other navbar content */}
        </div>
      </div>
      {!shouldHideLog && (
        <div className="quiz-user-info">
          <span
            style={{
              color: location.pathname === "/select-age-group" && "white",
            }}
          >
            {Userdata.name}
          </span>
          <div
            
            onClick={() => setShowLogout(!showLogout)}
          >
            <AccountCircleIcon className="user-avatar"/>
            {showLogout && (
              <div className="logout-popup">
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
