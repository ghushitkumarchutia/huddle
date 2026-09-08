import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import ProtectedRoute from "./ProtectedRoute";

import LandingPage from "../pages/LandingPage";
import SignupPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";

import FeedPage from "../pages/FeedPage";
import ProfilePage from "../pages/ProfilePage";
import AccountSettingsPage from "../pages/AccountSettingsPage";
import SpaceListPage from "../pages/SpaceListPage";
import SpaceDetailPage from "../pages/SpaceDetailPage";
import PostDetailPage from "../pages/PostDetailPage";
import SearchPage from "../pages/SearchPage";
import NotificationsPage from "../pages/NotificationsPage";
import NotFoundPage from "../pages/NotFoundPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/signup' element={<SignupPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/forgot-password' element={<ForgotPasswordPage />} />
      <Route path='/reset-password/:token' element={<ResetPasswordPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path='/feed' element={<FeedPage />} />
          <Route path='/profile/:userId?' element={<ProfilePage />} />
          <Route path='/settings' element={<AccountSettingsPage />} />
          <Route path='/spaces' element={<SpaceListPage />} />
          <Route path='/spaces/:spaceId' element={<SpaceDetailPage />} />
          <Route path='/groups/:groupId' element={<FeedPage />} />
          <Route path='/posts/:postId' element={<PostDetailPage />} />
          <Route path='/search' element={<SearchPage />} />
          <Route path='/notifications' element={<NotificationsPage />} />
          <Route path='*' element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
