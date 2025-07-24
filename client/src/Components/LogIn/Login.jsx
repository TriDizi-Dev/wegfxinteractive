import React, { useEffect, useState } from "react";
import image1 from "../../assets/Login/image1.svg";
import thinklogo from "../../assets/AllWebpAssets/Asset3.webp";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  fetchSignInMethodsForEmail,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { ref, set, get, database, auth } from "../../Firebase/firebase";
import { GrGoogle, GrView } from "react-icons/gr";
import { BiHide } from "react-icons/bi";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../Navbar/Navbar";
import googleImg from "../../assets/AllWebpAssets/Asset8.webp";

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
  const [successmsg, setsuccessmsg] = useState("");
  const navigate = useNavigate();

useEffect(() => {
  const checkRedirectResult = async () => {
    const redirected = sessionStorage.getItem("googleRedirect");
    if (redirected !== "true") return;

    try {
      const result = await getRedirectResult(auth);
      sessionStorage.removeItem("googleRedirect");

      if (result && result.user) {
        const user = result.user;
        const email = user.email;

        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.includes("password")) {
          setError("This email is already registered with Email/Password.");
          await signOut(auth);
          return;
        }

        const uid = user.uid;
        const userRef = ref(database, `users/${uid}`);
        const snapshot = await get(userRef);

        if (!snapshot.exists()) {
          const name = user.displayName || "User";
          await set(userRef, { name, email, role: "user" });
        }

        const token = await user.getIdToken();
        setStorageItem("authToken", token);
        setStorageItem("userType", "user");

        navigate("/select-age-group");
      }
    } catch (err) {
      console.error("Redirect login error:", err);
      setError("Google Sign-In Failed.");
    }
  };

  checkRedirectResult();
}, []);


  useEffect(() => {
    if (
      !redirectHandled &&
      sessionStorage.getItem("googleRedirect") === "true"
    ) {
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
            const name = result.user.displayName || "";
            await set(userRef, { name, email, role: "user" });
          }

          const token = await result.user.getIdToken();
          setStorageItem("authToken", token);
          setStorageItem("userType", "user");
          setTimeout(() => {
            navigate("/select-age-group");
          }, 1000);
          // const planRef = ref(database, `users/${uid}/plan`);
          // const planSnap = await get(planRef);
          // const now = Date.now();

          // if (planSnap.exists() && now < planSnap.val().endTime) {
          //   navigate("/select-age-group");
          // } else {
          //   navigate("/select-age-group");
          // }
        })
        .catch((err) => {
          console.error("Google Sign-In Failed:", err);
          setError("Google Sign-In Failed");
        });
    }
  }, [redirectHandled, navigate]);

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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        trimmedEmail,
        trimmedPassword
      );

      const snapshot = await get(
        ref(database, `users/${userCredential.user.uid}`)
      );
      if (snapshot.exists() && snapshot.val().role === "admin") {
        setError("Admins must log in through the Admin tab.");
        return;
      }

      const token = await userCredential.user.getIdToken();
      setStorageItem("authToken", token);
      setStorageItem("userType", "user");

      // const uid = userCredential.user.uid;
      // const planRef = ref(database, `users/${uid}/plan`);
      // const planSnap = await get(planRef);
      // const now = Date.now();
      setsuccessmsg("Login Successful!");

      setTimeout(() => {
        navigate("/select-age-group");
      }, 2000);
    } catch (err) {
      console.error(err);
      if (err.code === "auth/invalid-email") setError("Invalid email format.");
      else if (err.code === "auth/user-not-found") setError("User not found.");
      else if (err.code === "auth/wrong-password")
        setError("Incorrect password.");
      else setError("Login failed.");
    }
  };

  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, trimmedEmail);
      setMessage("Password reset email sent! Please check your inbox.");
    } catch (err) {
      console.error("Password reset error:", err);
      if (err.code === "auth/user-not-found") {
        setError("No user found with this email.");
      } else {
        setError("Failed to send password reset email.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);

      if (isMobile) {
        sessionStorage.setItem("googleRedirect", "true");
        await signInWithRedirect(auth, provider);
        return;
      }

      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const email = user.email;

      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.includes("password")) {
        setError("This email is already registered with Email/Password.");
        await signOut(auth);
        return;
      }

      const uid = user.uid;
      const userRef = ref(database, `users/${uid}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        const name = user.displayName || "User";
        await set(userRef, { name, email, role: "user" });
      }

      const token = await user.getIdToken();
      setStorageItem("authToken", token);
      setStorageItem("userType", "user");

      setTimeout(() => {
        navigate("/select-age-group");
      }, 1000);
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError("Google Sign-In Failed. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="login_box">
        <div className="login-leftside">
          <img src={image1} className="img1" />
        </div>

        <div className="login-rightside">
          <div className="head">
            <img src={thinklogo} className="logo" alt="Logo" />
            <h2>User Login</h2>
          </div>
          <form
            onSubmit={showChangePassword ? handleSendResetEmail : handleLogin}
          >
            <div className="form-login">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {!showChangePassword && (
              <div className="form-login">
                <label>Password</label>
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
            )}

            {showChangePassword && (
              <p className="info-message">
                We'll send a password reset link to your email.
              </p>
            )}

            <div>
              <div className="Login_submit_and_Create_account">
                <p className="Create_account">
                  Create an account?{" "}
                  <b className="login" onClick={() => navigate("/sign-up")}>
                    Sign Up
                  </b>
                </p>
                <button type="submit" className="btn-login">
                  {showChangePassword ? "Send Reset Link" : "Login"}
                </button>
              </div>
              <h3>
                {showChangePassword ? (
                  <span
                    className="sign"
                    onClick={() => {
                      setShowChangePassword(false);
                      setMessage("");
                    }}
                  >
                    Back to Login
                  </span>
                ) : (
                  <span
                    className="sign"
                    onClick={() => setShowChangePassword(true)}
                  >
                    Forget Password
                  </span>
                )}
              </h3>
            </div>
            <div className="ErrAndSucHandle">
              {error && <p className="error-message1">{error}</p>}
              {message && <p className="success-message">{message}</p>}
              {successmsg && <p className="success-message">{successmsg}</p>}
            </div>
            <div onClick={handleGoogleLogin} className="btn-google">
              <img src={googleImg} alt="googleImg" />
              {/* <GrGoogle className="btn-google" /> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
