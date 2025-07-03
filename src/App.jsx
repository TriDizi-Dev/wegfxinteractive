import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./Components/LogIn/login";
import Dashboard from "./Pages/AdminSidePages/Dashboard/Dashboard";
import QuestionCreation from "./Pages/AdminSidePages/QuestionsCreation/QuestionCreation";
import QuestionsManage from "./Pages/AdminSidePages/ManageQuestions/ManageQuestion";
import SlectPlanpage from "./Pages/UsersidePages/SelectPlanPage/SlectPlanpage";
import QuizComponent from "./Pages/UsersidePages/QuizComponet/Quiz";

function Layout() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/manageQuestion" element={<QuestionsManage />}></Route>
        <Route path="/questionCreation" element={<QuestionCreation />} />
        <Route path="/questionCreation/:id" element={<QuestionCreation />} />
        <Route path="/slectPlanpage" element={<SlectPlanpage />} />
        <Route path="/quiz" element={<QuizComponent />} />
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
