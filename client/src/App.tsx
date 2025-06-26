import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
// import AllNotes from "./components/"

export default function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* <Route path="/notes" element={<AllNotes />} />
      <Route path="/shared" element={<Shared />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/trash" element={<Trash />} />
      <Route path="/tags" element={<Tags />} />
      <Route path="/activity" element={<Activity />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
