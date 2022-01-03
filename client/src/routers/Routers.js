import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Main from "views/Main";

import SignUp from "views/SignUp";
import LogIn from "views/Login";
import Species from "views/Species";
import Report from "views/Report";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <>
          <Route exact={true} path={"/"} element={<Main />}></Route>
          <Route exact={true} path={"/sign-up"} element={<SignUp />}></Route>
          <Route exact={true} path={"/log-in"} element={<LogIn />}></Route>
          <Route exact={true} path={"/species"} element={<Species />}></Route>
          <Route exact={true} path={"/report"} element={<Report />}></Route>
          <Route path="*" element={<Navigate to="/" />} />
        </>
      </Routes>
    </Router>
  );
};

export default AppRouter;
