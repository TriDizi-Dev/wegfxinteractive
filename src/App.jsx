import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./Components/LogIn/login";
import Dashboard from "./Pages/AdminSidePages/Dashboard/Dashboard";
import QuestionCreation from "./Pages/AdminSidePages/QuestionsCreation/QuestionCreation";

function Layout() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/questionCreation" element={<QuestionCreation />}></Route>
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
