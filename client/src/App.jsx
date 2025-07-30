import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Kids from "./Components_Last/Kids/Kids";
import Price from "./Components_Last/Price/Price";
import LoginPage from "./Components/LogIn/Login";
import SignupPage from "./Components/LogIn/Signup";
import Dashboard from "./Pages/AdminSidePages/Dashboard/Dashboard";
import QuestionCreation from "./Pages/AdminSidePages/QuestionsCreation/QuestionCreation";
import QuestionsManage from "./Pages/AdminSidePages/ManageQuestions/ManageQuestion";
import SlectPlanpage from "./Pages/UsersidePages/SelectPlanPage/SlectPlanpage";
import QuizComponent from "./Pages/UsersidePages/QuizComponet/Quiz";
import UserDetails from "./Pages/AdminSidePages/userDetails/Userdetails";

//✅ Import protection components
import {
  RoleBasedRoute,
  PlanBasedRoute,
  PrivateRoute,
} from "./Components/protectedRoute";
import { useAuth } from "./Components/AuthContext";
import PaymentSuccess from "./Pages/UsersidePages/PaymentSucces/paymentsucces";
import AdminLoginPage from "./Components/LogIn/AdminLogin";
import { useEffect } from "react";
// import backgroundImage from "../src/assets/Pieimages/Baackground_last.jpg";
import backgroundImage from "../src/assets/AllWebpAssets/Asset13.webp";
import backgroundImageQuiz from "../src/assets/home/bg.jpg";
// import backfroundImageKids from "../src/assets/Pieimages/kidsimage.jpg";
// import backfroundImageKids from "../src/assets/AllWebpAssets/Asset10.webp";
import PieChart from "./Components_Last/Piechart/Piechart";
import backgroundimagplan from "./assets/Pieimages/Baackground_last1.png";
import backfroundImageKids from "./assets/AllWebpAssets/Asset10.webp";
import ManageCoupons from "./Pages/AdminSidePages/ManageCoupons/ManageCoupons";

function Layout() {
  const { loading } = useAuth();

  const location = useLocation();
  console.log(location.pathname, "location.pathname");

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const imagePaths = ["/", "/sign-up"];

    // Reset body styles first
    document.body.style.backgroundImage = "";
    document.body.style.height = "";

    if (imagePaths.includes(location.pathname)) {
      document.body.style.backgroundImage = `url(${backgroundImage})`;
    } else if (location.pathname === "/quiz") {
      document.body.style.backgroundImage = `url(${backgroundImageQuiz})`;
    } else if (location.pathname === "/select-age-group") {
      document.body.style.backgroundImage = `url(${backfroundImageKids})`;
    } else if (location.pathname === "/report") {
      document.body.style.height = isMobile ? "120vh" : "";
      document.body.style.backgroundImage = `url(${backgroundimagplan})`;
    } else if (location.pathname === "/plans") {
      document.body.style.height = isMobile ? "135vh" : "";
      document.body.style.backgroundImage = `url(${backgroundimagplan})`;
    } else {
      document.body.style.background = `radial-gradient(circle at top left, #ede7f6, #d6d0f5, #e0dcff)`;
      document.body.style.backgroundColor = "#ffffff";
    }

    // Common background styles
    if (document.body.style.backgroundImage) {
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundPosition = "center";
    }
  }, [location.pathname]);

  if (loading) return <div>🔄 Loading...</div>;
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/sign-up" element={<SignupPage />} />

        {/* ✅ Admin Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <RoleBasedRoute requiredRole="admin">
              <Dashboard />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/manageQuestion"
          element={
            <RoleBasedRoute requiredRole="admin">
              <QuestionsManage />
            </RoleBasedRoute>
          }
        />
        <Route path="/manage-coupons" element={<RoleBasedRoute requiredRole="admin"><ManageCoupons /></RoleBasedRoute>} />

        <Route
          path="/questionCreation"
          element={
            <RoleBasedRoute requiredRole="admin">
              <QuestionCreation />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/questionCreation/:id"
          element={
            <RoleBasedRoute requiredRole="admin">
              <QuestionCreation />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/userDetails"
          element={
            <RoleBasedRoute requiredRole="admin">
              <UserDetails />
            </RoleBasedRoute>
          }
        />

        {/* ✅ Plan Protected User Routes */}
        <Route
          path="/quiz"
          element={
            // <PlanBasedRoute>
              <QuizComponent />
            // </PlanBasedRoute>
          }
        />

        {/* ✅ Logged-in Users only (e.g., plan selection page) */}
        <Route
          path="/slectPlanpage"
          element={
            <PrivateRoute>
              <SlectPlanpage />
            </PrivateRoute>
          }
        />
        <Route
          path="/payment-success"
          element={
            <PrivateRoute>
              <PaymentSuccess />
            </PrivateRoute>
          }
        />
        <Route
          path="/report"
          element={
            <PrivateRoute>
              <PieChart />
            </PrivateRoute>
          }
        />
        <Route
          path="/select-age-group"
          element={
            <PrivateRoute>
              <Kids />
            </PrivateRoute>
          }
        />
        <Route
          path="/plans"
          element={
            <PrivateRoute>
              <Price />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
