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
import DoReport from "views/DoReport";
import ReportDetail from "views/ReportDetails";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <>
          <Route path={"/"} element={<Main />}></Route>
          <Route path={"/sign-up"} element={<SignUp />}></Route>
          <Route path={"/log-in"} element={<LogIn />}></Route>
          <Route path={"/species"} element={<Species />}></Route>
          <Route path={"/report"} element={<Report />}></Route>
          <Route path={"/do-report"} element={<DoReport />}></Route>
          <Route path="/report-details:id" element={<ReportDetail />}></Route>
          <Route path="*" element={<Navigate to="/" />} />
        </>
      </Routes>
    </Router>
  );
};

export default AppRouter;
