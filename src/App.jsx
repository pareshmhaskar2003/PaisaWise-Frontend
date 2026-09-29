import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import FinancialInsights from "./pages/FinancialInsights";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminTransactions from "./pages/AdminTransactions";
import AdminBudgets from "./pages/AdminBudgets";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import "./App.css";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/budgets"
          element={
            <ProtectedRoute>
              <Budgets />
            </ProtectedRoute>
          }
        />

        <Route
          path="/financial-insights"
          element={
            <ProtectedRoute>
              <FinancialInsights />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <RoleRoute allowedRole="ADMIN">
              <AdminDashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <RoleRoute allowedRole="ADMIN">
              <AdminUsers />
            </RoleRoute>
          }
        />

        <Route
          path="/admin/transactions"
          element={
            <RoleRoute allowedRole="ADMIN">
              <AdminTransactions />
            </RoleRoute>
          }
        />

        <Route
          path="/admin/budgets"
          element={
            <RoleRoute allowedRole="ADMIN">
              <AdminBudgets />
            </RoleRoute>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;