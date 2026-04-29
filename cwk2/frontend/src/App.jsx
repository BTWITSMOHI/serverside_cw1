import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import RequestReset from "./pages/RequestReset";
import ResetPassword from "./pages/ResetPassword";

import Overview from "./pages/Overview";
import Programme from "./pages/Programme";
import Graduation from "./pages/Graduation";
import Industry from "./pages/Industry";
import Usage from "./pages/Usage";

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/request-reset" element={<RequestReset />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Overview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/programme"
          element={
            <ProtectedRoute>
              <Programme />
            </ProtectedRoute>
          }
        />

        <Route
          path="/graduation"
          element={
            <ProtectedRoute>
              <Graduation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/industry"
          element={
            <ProtectedRoute>
              <Industry />
            </ProtectedRoute>
          }
        />

        <Route
          path="/usage"
          element={
            <ProtectedRoute>
              <Usage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}