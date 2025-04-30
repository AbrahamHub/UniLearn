import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const HomePage = React.lazy(() => import('./pages/HomePage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const CourseListPage = React.lazy(() => import('./pages/CourseListPage'));
const CourseDetailPage = React.lazy(() => import('./pages/CourseDetailPage'));
const VideoPlayerPage = React.lazy(() => import('./pages/VideoPlayerPage'));
const UploadPage = React.lazy(() => import('./pages/UploadPage'));
const ReviewQueuePage = React.lazy(() => import('./pages/ReviewQueuePage'));
const MetricsPage = React.lazy(() => import('./pages/MetricsPage'));
const ExpertListPage = React.lazy(() => import('./pages/ExpertListPage'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/mis-cursos"
              element={
                <PrivateRoute>
                  <HomePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/cursos"
              element={
                <PrivateRoute>
                  <CourseListPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/curso/:id"
              element={
                <PrivateRoute>
                  <CourseDetailPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/curso/:courseId/video/:videoId"
              element={
                <PrivateRoute>
                  <VideoPlayerPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <PrivateRoute allowedRoles={['expert', 'admin']}>
                  <UploadPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/review"
              element={
                <PrivateRoute allowedRoles={['expert', 'admin']}>
                  <ReviewQueuePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/experts"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <ExpertListPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/metrics"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <MetricsPage />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/mis-cursos" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;