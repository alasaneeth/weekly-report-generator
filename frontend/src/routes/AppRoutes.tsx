import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import ReportFormPage from '../features/reports/pages/ReportFormPage';
import ReportHistoryPage from '../features/reports/pages/ReportHistoryPage';
import ReportDetailPage from '../features/reports/pages/ReportDetailPage';
import ManagerReviewListPage from '../features/reports/pages/ManagerReviewListPage';
import ManagerReviewDetailPage from '../features/reports/pages/ManagerReviewDetailPage';
import ProjectsManagementPage from '../features/projects/pages/ProjectsManagementPage';
import InsightsDashboardPage from '../features/dashboard/pages/InsightsDashboardPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/reports/new" element={<ReportFormPage />} />
          <Route path="/reports/history" element={<ReportHistoryPage />} />
          <Route path="/reports/:id" element={<ReportDetailPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['Manager']} />}>
          <Route path="/manager/reports" element={<ManagerReviewListPage />} />
          <Route path="/manager/reports/:id" element={<ManagerReviewDetailPage />} />
          <Route path="/projects" element={<ProjectsManagementPage />} />
          <Route path="/insights" element={<InsightsDashboardPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
