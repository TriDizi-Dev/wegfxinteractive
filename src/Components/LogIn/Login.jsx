import React, { useEffect, useState } from "react";
import "./Login.css";
import { auth, database } from "../../Firebase/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { ref, set, get } from "firebase/database";
import { GrView } from "react-icons/gr";
import { BiHide } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [userType, setUserType] = useState("user");
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // 🔁 Handle Google Redirect Result
  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (result) {
          const uid = result.user.uid;
          const userRef = ref(database, `users/${uid}`);
          const snapshot = await get(userRef);

          if (!snapshot.exists()) {
            await set(userRef, {
              email: result.user.email,
              role: "user",
            });
          }

          sessionStorage.setItem("authToken", await result.user.getIdToken());
          sessionStorage.setItem("userType", "user");

          const planRef = ref(database, `users/${uid}/plan`);
          const planSnap = await get(planRef);
          const now = Date.now();

          if (planSnap.exists() && now < planSnap.val().endTime) {
            navigate("/quiz");
          } else {
            navigate("/slectPlanpage");
          }
        }
      })
      .catch((error) => {
        console.error("Google redirect error:", error);
        setError("Google Sign-In Failed (Redirect)");
      });
  }, []);

  const handleLoginOrSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let userCredential;

      if (userType === "admin") {
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const uid = userCredential.user.uid;
        const snapshot = await get(ref(database, `users/${uid}`));

        if (snapshot.exists() && snapshot.val().role === "admin") {
          sessionStorage.setItem(
            "authToken",
            await userCredential.user.getIdToken()
          );
          sessionStorage.setItem("userType", "admin");
          navigate("/dashboard");
        } else {
          setError("You are not authorized as admin.");
        }
        return;
      }

      // User Signup/Login
      if (isSignup) {
        try {
          userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          const uid = userCredential.user.uid;
          await set(ref(database, `users/${uid}`), {
            email,
            role: "user",
          });
        } catch (signupErr) {
          if (signupErr.code === "auth/email-already-in-use") {
            setError("User already exists. Please log in.");
          } else if (signupErr.code === "auth/weak-password") {
            setError("Password should be at least 6 characters.");
          } else {
            console.error(signupErr);
            setError("Signup failed. Try again.");
          }
          return;
        }
      } else {
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const uid = userCredential.user.uid;
        const snapshot = await get(ref(database, `users/${uid}`));

        if (snapshot.exists() && snapshot.val().role === "admin") {
          setError("Admins must log in through the Admin tab.");
          return;
        }
      }

      sessionStorage.setItem(
        "authToken",
        await userCredential.user.getIdToken()
      );
      sessionStorage.setItem("userType", "user");

      const uid = userCredential.user.uid;
      const planRef = ref(database, `users/${uid}/plan`);
      const planSnap = await get(planRef);

      if (planSnap.exists()) {
        const planData = planSnap.val();
        const now = Date.now();
        if (now < planData.endTime) {
          navigate("/quiz");
        } else {
          navigate("/slectPlanpage");
        }
      } else {
        navigate("/slectPlanpage");
      }
    } catch (err) {
      console.error(err);
      setError(
        isSignup
          ? "Signup failed. Try again."
          : "Login failed. Check credentials."
      );
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();

      if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
        // On mobile use redirect
        await signInWithRedirect(auth, provider);
      } else {
        // Desktop popup
        const result = await signInWithPopup(auth, provider);
        const uid = result.user.uid;

        const userRef = ref(database, `users/${uid}`);
        const snapshot = await get(userRef);

        if (!snapshot.exists()) {
          await set(userRef, {
            email: result.user.email,
            role: "user",
          });
        }

        sessionStorage.setItem("authToken", await result.user.getIdToken());
        sessionStorage.setItem("userType", "user");

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
      setError("Google Sign-In Failed");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* User/Admin Toggle */}
        <div className="user-type-toggle">
          <label>
            <input
              type="radio"
              value="user"
              checked={userType === "user"}
              onChange={() => {
                setUserType("user");
                setIsSignup(false);
              }}
            />
            User
          </label>
          <label>
            <input
              type="radio"
              value="admin"
              checked={userType === "admin"}
              onChange={() => {
                setUserType("admin");
                setIsSignup(false);
              }}
            />
            Admin
          </label>
        </div>

        <h2>
          {userType === "admin"
            ? "Admin Login"
            : isSignup
            ? "User Signup"
            : "User Login"}
        </h2>

        <form onSubmit={handleLoginOrSignup}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
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

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="btn-login">
            {userType === "admin"
              ? "Login as Admin"
              : isSignup
              ? "Sign Up"
              : "Login"}
          </button>
        </form>

        {userType === "user" && (
          <>
            <div className="signup-toggle">
              <button
                type="button"
                onClick={() => setIsSignup(!isSignup)}
                className="toggle-button"
              >
                {isSignup ? "Switch to Login" : "Switch to Signup"}
              </button>
            </div>

            <div className="or-divider">OR</div>

            <button className="btn-google" onClick={handleGoogleLogin}>
              Continue with Google
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
