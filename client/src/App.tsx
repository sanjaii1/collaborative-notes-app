import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./pages/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import AllNotesPage from "./pages/AllNotesPage";
import SharedPage from "./pages/SharedPage";
import FavoritesPage from "./pages/FavoritesPage";
import TrashPage from "./pages/TrashPage";
import TagsPage from "./pages/TagsPage";
import ActivityPage from "./pages/ActivityPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
// import AllNotes from "./components/"

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/" element={<DashboardLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="notes" element={<AllNotesPage />} />
        <Route path="shared" element={<SharedPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="trash" element={<TrashPage />} />
        <Route path="tags" element={<TagsPage />} />
        <Route path="activity" element={<ActivityPage />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  </Router>
);

export default App;
