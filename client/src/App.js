import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useRecoilState } from "recoil";
import "./App.scss";
import Loader from "./components/global/loader/Loader";
import CustomSnackBar from "./components/global/snackBar/CustomSnackBar";
import AdminLayout from "./components/layout/AdminLayout";
import "./custom.scss";
import Dashboard from "./pages/Dashboard";
import ErrorPage from "./pages/ErrorPage";
import Login from "./pages/Login";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Reported from "./pages/Reported";
import Reporting from "./pages/Reporting";
import ReportingDetail from "./pages/ReportingDetail";
import TermsAndServices from "./pages/TermsAndServices";
import UserDetail from "./pages/UserDetail";
import Users from "./pages/Users";
import { isLoaderState, snakeBarState } from "./util/RecoilStore";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";

function App() {

  const [isLoaderInfo, setIsLoaderInfo] = useRecoilState(isLoaderState);
  const [snackBarInfo, setSnackBarInfo] = useRecoilState(snakeBarState);
  return (
    <>
      {isLoaderInfo && <Loader />}
      <div className="App">
        <Router>
          <Routes>
            <Route exact path={``} element={<Login />} />
            <Route path={`/admin`} element={<AdminLayout />}>
              <Route exact path="dashboard" element={<Dashboard />} />
              <Route exact path="users" element={<Users />} />
              <Route exact path="contact" element={<ContactUs />} />
              <Route exact path="reported" element={<Reported />} />
              <Route exact path="reporting" element={<Reporting />} />
              <Route exact path="reporting-detail" element={<ReportingDetail />} />
              <Route exact path="user-detail" element={<UserDetail />} />
              <Route exact path="privacy" element={<PrivacyPolicy />} />
              <Route exact path="about" element={<AboutUs />} />
              <Route exact path="terms" element={<TermsAndServices />} />
            </Route>
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Router>
      </div>

      <CustomSnackBar
        closeSnackPro={() => setSnackBarInfo({ snackStatus: false })}
        snackInfoPro={snackBarInfo}
      />
    </>
  );
}

export default App;
