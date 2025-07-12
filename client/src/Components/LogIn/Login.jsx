import React, { useEffect, useState } from "react";
// import image1 from "../../assets/Login/image1.jpg";
import image2 from "../../assets/Login/image2.png";
import image3 from "../../assets/Login/image3.png";
import image4 from "../../assets/Login/image4.png";
import image6 from "../../assets/Login/Picture12.png"
import image5 from "../../assets/Login/Picture10.png"
import { useLocation, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  fetchSignInMethodsForEmail,
  signOut,
  updatePassword,
} from "firebase/auth";
import { ref, set, get, database, auth } from "../../Firebase/firebase";
import { GrView } from "react-icons/gr";
import { BiHide } from "react-icons/bi";
import "./Login.css";

const setStorageItem = (key, value) => {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    localStorage.setItem(key, value);
  }
};

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [redirectHandled, setRedirectHandled] = useState(false);
  const navigate = useNavigate();





  // ✅ Handle Google Redirect login (kept for future use)
  /*
  if (!redirectHandled && sessionStorage.getItem("googleRedirect") === "true") {
    setRedirectHandled(true);
    sessionStorage.removeItem("googleRedirect");

    getRedirectResult(auth)
      .then(async (result) => {
        if (!result?.user) return;
        const uid = result.user.uid;
        const email = result.user.email;

        const userRef = ref(database, `users/${uid}`);
        const snapshot = await get(userRef);

        if (!snapshot.exists()) {
          await set(userRef, { email, role: "user" });
        }

        const token = await result.user.getIdToken();
        setStorageItem("authToken", token);
        setStorageItem("userType", "user");

        const planRef = ref(database, `users/${uid}/plan`);
        const planSnap = await get(planRef);
        const now = Date.now();

        if (planSnap.exists() && now < planSnap.val().endTime) {
          navigate("/quiz");
        } else {
          navigate("/slectPlanpage");
        }
      })
      .catch((err) => {
        console.error("Google Sign-In Failed:", err);
        setError("Google Sign-In Failed");
      });
  }
  */

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Email and password are required.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);

      const snapshot = await get(ref(database, `users/${userCredential.user.uid}`));
      if (snapshot.exists() && snapshot.val().role === "admin") {
        setError("Admins must log in through the Admin tab.");
        return;
      }

      const token = await userCredential.user.getIdToken();
      setStorageItem("authToken", token);
      setStorageItem("userType", "user");

      const uid = userCredential.user.uid;
      const planRef = ref(database, `users/${uid}/plan`);
      const planSnap = await get(planRef);
      const now = Date.now();

      if (planSnap.exists() && now < planSnap.val().endTime) {
        navigate("/quiz");
      } else {
        // navigate("/slectPlanpage");
        navigate("/select-age-group");
      }
    } catch (err) {
      console.error(err);
      if (err.code === "auth/invalid-email") setError("Invalid email format.");
      else if (err.code === "auth/user-not-found") setError("User not found.");
      else if (err.code === "auth/wrong-password") setError("Incorrect password.");
      else setError("Login failed.");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const trimmedEmail = email.trim();
    const newPass = password.trim();

    if (!trimmedEmail || !newPass) {
      setError("Email and new password are required.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, newPass);
      await updatePassword(userCredential.user, newPass);
      await signOut(auth);

      setMessage("Password changed successfully. Please log in.");
      setShowChangePassword(false);
    } catch (err) {
      console.error("Password change error:", err);
      setError("Failed to change password.");
    }
  };

  // ✅ Google Login handler (commented for future use)
  /*
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
        sessionStorage.setItem("googleRedirect", "true");
        await signInWithRedirect(auth, provider);
      } else {
        const result = await signInWithPopup(auth, provider);
        const email = result.user.email;

        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.includes("password")) {
          setError("This email is already registered with Email/Password.");
          await signOut(auth);
          return;
        }

        const uid = result.user.uid;
        const userRef = ref(database, `users/${uid}`);
        const snapshot = await get(userRef);

        if (!snapshot.exists()) {
          await set(userRef, { email, role: "user" });
        }

        const token = await result.user.getIdToken();
        setStorageItem("authToken", token);
        setStorageItem("userType", "user");

        const planRef = ref(database, `users/${uid}/plan`);
        const planSnap = await get(planRef);
        const now = Date.now();

        if (planSnap.exists() && now < planSnap.val().endTime) {
          navigate("/quiz");
        } else {
          navigate("/slectPlanpage");
        }
      }
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError("Google Sign-In Failed.");
    }
  };
  */

  return (
    <div className="login_container">
      {/* <img src={image1} alt="Background" className="login_background" /> */}
      <div className="login_box">
        <div className="login-leftside">
          <img src={image2} alt="Cartoon" className="boy_image " />
          <img src={image3} className="image_shape" alt="Illustration" />
          <h2>
            {/* Unleash the <img src={image6} className="img6"/> */}
            Unlesh the
            <img  src={image5} className="img5"/><span className="star-text">Star</span> Within!
          </h2>
          <p>
            Boost your child’s confidence and social skills to unlock lifelong success.
          </p>
        </div>

        <div className="login-rightside">
          <div className="head">
            <img src={image4} className="logo" alt="Logo" />
            {/* <h2>{showChangePassword ? "Change Password" : "User Login"}</h2> */}
            <h2>{"User Login"}</h2>
          </div>

          <form onSubmit={showChangePassword ? handlePasswordUpdate : handleLogin}>
            <div className="form-login">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-login">
              <label>{showChangePassword ? "New Password" : "Password"}</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password"
                >
                  {showPassword ? <GrView /> : <BiHide />}
                </button>
              </div>
            </div>

            <div>
              <p>
                Create an account?{" "}
                <b className="login" onClick={() => navigate("/sign-up")}>
                  Sign Up
                </b>
              </p>
              <h3>
                {showChangePassword ? (
                  <span className="sign" onClick={() => setShowChangePassword(false)}>
                    Back to Login
                  </span>
                ) : (
                  <span className="sign" onClick={() => setShowChangePassword(true)}>
                    Forget Password
                  </span>
                )}
              </h3>
            </div>

            {error && <p className="error-message1">{error}</p>}
            {message && <p className="success-message">{message}</p>}

            <button type="submit" className="btn-login">
              {showChangePassword ? "Change Password" : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
