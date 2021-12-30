import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Main from "views/Main";

import SignUp from "views/SignUp";
import LogIn from "views/Login";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <>
          <Route exact={true} path={"/"} element={<Main />}></Route>
          <Route exact={true} path={"/sign-up"} element={<SignUp />}></Route>
          <Route exact={true} path={"/log-in"} element={<LogIn />}></Route>
          <Route path="*" element={<Navigate to="/" />} />
        </>
      </Routes>
    </Router>
  );
};

export default AppRouter;
