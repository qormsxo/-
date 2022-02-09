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
import Report from "views/report/Report";
import DoReport from "views/report/DoReport";
import ReportDetail from "views/report/ReportDetails";
import AdminReportDetail from "views/report/AdminReportDetails";
import ProfilePage from "views/ProfilePage";
import ProfileUpdate from "views/ProfileUpdate";
import ReportStatus from "views/report/ReportStatus";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <>
          <Route path={"/"} element={<Main />}></Route> {/* 메인 */}
          <Route path={"/sign-up"} element={<SignUp />}></Route>{" "}
          {/* 회원가입 */}
          <Route path={"/log-in"} element={<LogIn />}></Route> {/* 로그인 */}
          <Route path={"/species"} element={<Species />}></Route>{" "}
          {/* 멸종위기종 조회 */}
          <Route path={"/report"} element={<Report />}></Route>{" "}
          {/* 제보 조회 */}
          <Route path={"/do-report"} element={<DoReport />}></Route>{" "}
          {/* 제보 하기 */}
          <Route
            path={"/report-status"}
            element={<ReportStatus />}
          ></Route>{" "}
          {/* 제보 현황 */}
          <Route
            path="/report-details:id"
            element={<ReportDetail />}
          ></Route>{" "}
          {/* 제보 상세정보 */}
          <Route
            path="/report-details/admin:id"
            element={<AdminReportDetail />}
          ></Route>{" "}
          {/* 어드민상세정보 */}
          <Route path={"/profile"} element={<ProfilePage />}></Route>{" "}
          {/* 프로필 조회 */}
          <Route
            path={"/profile-update"}
            element={<ProfileUpdate />}
          ></Route>{" "}
          {/* 프로필 수정*/}
          <Route path="*" element={<Navigate to="/" />} />
        </>
      </Routes>
    </Router>
  );
};

export default AppRouter;
