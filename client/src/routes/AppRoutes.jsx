import { Navigate, Route, Routes } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import EntryGate from "../pages/EntryGate";
import Home from "../pages/Home";
import LessonDetail from "../pages/LessonDetail";
import Practice from "../pages/Practice";
import Progress from "../pages/Progress";
import Login from "../pages/Login";
import Register from "../pages/Register";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<EntryGate />} />
      <Route path="/home" element={<Home />} />
      <Route path="/lessons/:slug" element={<LessonDetail />} />
      <Route path="/practice/:slug" element={<Practice />} />
      <Route
        path="/progress"
        element={
          <ProtectedRoute>
            <Progress />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
