import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Main from "./Main";
import SignUp from "./SignUp";
import Courses from "./Courses";
import Assignments from "./Assignments";
import Grades from "./Grades";
import Account from './Account'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/main" element={<Main />} />
        <Route path="/courses" element={<Courses/>} />
        <Route path="assignments" element={<Assignments/>}/>
        <Route path="/grades" element={<Grades/>}/>
        <Route path="/account" element={<Account/>}/>
      </Routes>
    </Router>
  );
}

export default App;