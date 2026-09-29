import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "./ConfirmModal";
import "../utils/Layout.css";

function Layout({ children }) {
  const { logout, role } = useAuth();
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] =
    useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const openLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };

  const closeMobileNav = () => {
    setMobileNavOpen(false);
  };

  const navClass = ({ isActive }) =>
    isActive ? "sidebar-link active" : "sidebar-link";

  return (
    <div className="app-layout">
      <button
        className={`sidebar-scrim ${mobileNavOpen ? "visible" : ""}`}
        type="button"
        aria-label="Close navigation"
        onClick={closeMobileNav}
      />

      <aside className={`sidebar ${mobileNavOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header">
          <div className="brand-mark" aria-hidden="true">P</div>
          <div className="brand-copy">
            <div className="logo">PaisaWise</div>
            <div className="logo-subtitle">Personal Finance</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            className={navClass}
            onClick={closeMobileNav}
          >
            <span aria-hidden="true">▦</span> Dashboard
          </NavLink>

          <NavLink
            to="/transactions"
            className={navClass}
            onClick={closeMobileNav}
          >
            <span aria-hidden="true">↔</span> Transactions
          </NavLink>

          <NavLink
            to="/budgets"
            className={navClass}
            onClick={closeMobileNav}
          >
            <span aria-hidden="true">◎</span> Budgets
          </NavLink>

          <NavLink
            to="/financial-insights"
            className={navClass}
            onClick={closeMobileNav}
          >
            <span aria-hidden="true">✦</span> Financial Insights
          </NavLink>

          <NavLink
            to="/profile"
            className={navClass}
            onClick={closeMobileNav}
          >
            <span aria-hidden="true">◉</span> Profile & Settings
          </NavLink>

          {role === "ADMIN" && (
            <>
              <div className="sidebar-section-title">
                Administration
              </div>

              <NavLink
                to="/admin"
                className={navClass}
                onClick={closeMobileNav}
              >
                <span aria-hidden="true">▣</span> Admin Dashboard
              </NavLink>

              <NavLink
                to="/admin/users"
                className={navClass}
                onClick={closeMobileNav}
              >
                <span aria-hidden="true">◌</span> Manage Users
              </NavLink>

              <NavLink
                to="/admin/transactions"
                className={navClass}
                onClick={closeMobileNav}
              >
                <span aria-hidden="true">☷</span> All Transactions
              </NavLink>

              <NavLink
                to="/admin/budgets"
                className={navClass}
                onClick={closeMobileNav}
              >
                <span aria-hidden="true">↗</span> All Budgets
              </NavLink>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <button
            className="logout-button"
            onClick={openLogoutModal}
          >
            <span aria-hidden="true">↪</span> Logout
          </button>
        </div>
      </aside>

      <button
        className="mobile-menu-button"
        type="button"
        aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={mobileNavOpen}
        onClick={() => setMobileNavOpen((open) => !open)}
      >
        {mobileNavOpen ? "×" : "☰"}
      </button>

      <main className="main-content">
        {children}
      </main>

      <ConfirmModal
        isOpen={showLogoutModal}
        title="Logout?"
        message="Are you sure you want to log out of your PaisaWise account?"
        confirmText="Logout"
        cancelText="Cancel"
        danger={true}
        onConfirm={handleLogout}
        onCancel={closeLogoutModal}
      />
    </div>
  );
}

export default Layout;