import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./Components/LogIn/Login";
import Dashboard from "./Pages/AdminSidePages/Dashboard/Dashboard";
import QuestionCreation from "./Pages/AdminSidePages/QuestionsCreation/QuestionCreation";
import QuestionsManage from "./Pages/AdminSidePages/ManageQuestions/ManageQuestion";
import SlectPlanpage from "./Pages/UsersidePages/SelectPlanPage/SlectPlanpage";
import QuizComponent from "./Pages/UsersidePages/QuizComponet/Quiz";
import UserDetails from "./Pages/AdminSidePages/userDetails/Userdetails";

// ✅ Import protection components
import {
  RoleBasedRoute,
  PlanBasedRoute,
  PrivateRoute,
} from "./Components/protectedRoute";

function Layout() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />

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
            <PlanBasedRoute>
              <QuizComponent />
            </PlanBasedRoute>
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
