import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import ProtectedRoute from "./ProtectedRoute";

import LandingPage from "../pages/LandingPage";
import SignupPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";

// Protected Pages
import FeedPage from "../pages/FeedPage";
import ProfilePage from "../pages/ProfilePage";
import AccountSettingsPage from "../pages/AccountSettingsPage";
import SpaceListPage from "../pages/SpaceListPage";
import SpaceDetailPage from "../pages/SpaceDetailPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/signup' element={<SignupPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/forgot-password' element={<ForgotPasswordPage />} />
      <Route path='/reset-password/:token' element={<ResetPasswordPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          {/* Feed is the default authenticated view for now */}
          <Route path='/feed' element={<FeedPage />} />
          <Route path='/profile/:userId?' element={<ProfilePage />} />
          <Route path='/settings' element={<AccountSettingsPage />} />
          <Route path='/spaces' element={<SpaceListPage />} />
          <Route path='/spaces/:spaceId' element={<SpaceDetailPage />} />
          <Route path='/groups/:groupId' element={<FeedPage />} />
          <Route path='*' element={<Navigate to='/feed' replace />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
