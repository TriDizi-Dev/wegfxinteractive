 import { BrowserRouter, Route, Routes } from "react-router-dom";
 import Pie from "./Components_Last/Piechart/Piechart";
 import Kids from "./Components_Last/Kids/Kids";
  import Price from "./Components_Last/Price/Price";
import LoginPage from "./Components/LogIn/Login";
import SignupPage from "./Components/LogIn/Signup"
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

function Layout() {
  const { loading } = useAuth();

  if (loading) return <div>🔄 Loading...</div>;
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/sign-up" element={<SignupPage/>}/>

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
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/pie" element={<Pie />} />
        <Route path="/select-age-group" element={<Kids />} />
        <Route path="/plans" element={<Price />} />

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


