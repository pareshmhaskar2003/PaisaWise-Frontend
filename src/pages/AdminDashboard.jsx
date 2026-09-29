import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import api from "../services/api";
import "../utils/AdminDashboard.css";

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchAdminData = async () => {
    try {
      setError("");

      const [
        dashboardResponse,
        usersResponse,
        transactionsResponse,
        budgetsResponse,
      ] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/users"),
        api.get("/admin/transactions"),
        api.get("/admin/budgets"),
      ]);

      setDashboard(dashboardResponse.data);
      setUsers(usersResponse.data);
      setTransactions(transactionsResponse.data);
      setBudgets(budgetsResponse.data);
    } catch (err) {
      console.error("Admin dashboard error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load admin dashboard data."
      );
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const toggleUser = async (id) => {
    try {
      setError("");

      await api.put(`/admin/users/${id}/toggle`);

      await fetchAdminData();
    } catch (err) {
      console.error("Toggle user error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to update user."
      );
    }
  };

  if (!dashboard && !error) {
    return (
      <Layout>
        <div className="page-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p className="subtitle">
              Monitor users, transactions, budgets, and
              overall platform activity.
            </p>
          </div>
        </div>

        <LoadingSpinner message="Loading admin dashboard..." />
      </Layout>
    );
  }

  if (error && !dashboard) {
    return (
      <Layout>
        <div className="error-state">
          <h2>Something went wrong</h2>
          <p>{error}</p>

          <button onClick={fetchAdminData}>
            Try Again
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Admin Dashboard</h1>

          <p className="subtitle">
            Monitor users, transactions, budgets, and overall
            platform activity.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Platform Summary */}
      <div className="admin-summary-grid">
        <div className="summary-card">
          <p>Total Users</p>

          <h2>
            {dashboard.totalUsers}
          </h2>

          <span>
            Registered users
          </span>
        </div>

        <div className="summary-card">
          <p>Total Transactions</p>

          <h2>
            {dashboard.totalTransactions}
          </h2>

          <span>
            All transactions
          </span>
        </div>

        <div className="summary-card">
          <p>Total Budgets</p>

          <h2>
            {dashboard.totalBudgets}
          </h2>

          <span>
            Created budgets
          </span>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="admin-finance-grid">
        <div className="summary-card">
          <p>Total Income</p>

          <h2>
            ₹{dashboard.totalIncome}
          </h2>

          <span>
            Across all users
          </span>
        </div>

        <div className="summary-card">
          <p>Total Expense</p>

          <h2>
            ₹{dashboard.totalExpense}
          </h2>

          <span>
            Across all users
          </span>
        </div>
      </div>

      {/* Admin Management */}
      <div className="admin-actions-card">
        <h2>
          Admin Management
        </h2>

        <p className="muted">
          Manage users and monitor financial activity
          across the PaisaWise platform.
        </p>

        <div className="admin-action-buttons">
          <button
            onClick={() => navigate("/admin/users")}
          >
            Manage Users
          </button>

          <button
            onClick={() =>
              navigate("/admin/transactions")
            }
          >
            View Transactions
          </button>

          <button
            onClick={() =>
              navigate("/admin/budgets")
            }
          >
            View Budgets
          </button>
        </div>
      </div>

      {/* Quick User Overview */}
      <div className="table-card">
        <div className="table-header">
          <div>
            <h2>
              Recent Users
            </h2>

            <p className="muted">
              Total registered users: {users.length}
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/admin/users")
            }
          >
            View All
          </button>
        </div>

        {users.length === 0 ? (
          <div className="empty-state">
            <p>No users found.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.slice(0, 5).map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong>
                        {user.name}
                      </strong>
                    </td>

                    <td>
                      {user.email}
                    </td>

                    <td>
                      <span className="category-badge">
                        {user.role}
                      </span>
                    </td>

                    <td>
                      <span
                        className={
                          user.enabled
                            ? "income-badge"
                            : "expense-badge"
                        }
                      >
                        {user.enabled
                          ? "ACTIVE"
                          : "DISABLED"}
                      </span>
                    </td>

                    <td>
                      {user.role !== "ADMIN" && (
                        <button
                          onClick={() =>
                            toggleUser(user.id)
                          }
                        >
                          {user.enabled
                            ? "Disable"
                            : "Enable"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transaction Overview */}
      <div className="table-card">
        <div className="table-header">
          <div>
            <h2>
              Transaction Overview
            </h2>

            <p className="muted">
              Total transactions:{" "}
              {transactions.length}
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/admin/transactions")
            }
          >
            View All
          </button>
        </div>

        {transactions.length === 0 ? (
          <div className="empty-state">
            <p>No transactions found.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {transactions.slice(0, 5).map(
                  (transaction) => (
                    <tr key={transaction.id}>
                      <td>
                        <strong>
                          {transaction.description}
                        </strong>
                      </td>

                      <td>
                        <span className="category-badge">
                          {transaction.category}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            transaction.type ===
                            "INCOME"
                              ? "income-badge"
                              : "expense-badge"
                          }
                        >
                          {transaction.type}
                        </span>
                      </td>

                      <td>
                        <strong>
                          ₹{transaction.amount}
                        </strong>
                      </td>

                      <td>
                        {transaction.transactionDate}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Budget Overview */}
      <div className="table-card">
        <div className="table-header">
          <div>
            <h2>
              Budget Overview
            </h2>

            <p className="muted">
              Total budgets: {budgets.length}
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/admin/budgets")
            }
          >
            View All
          </button>
        </div>

        {budgets.length === 0 ? (
          <div className="empty-state">
            <p>No budgets found.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Month</th>
                  <th>Year</th>
                </tr>
              </thead>

              <tbody>
                {budgets.slice(0, 5).map(
                  (budget) => (
                    <tr key={budget.id}>
                      <td>
                        <span className="category-badge">
                          {budget.category}
                        </span>
                      </td>

                      <td>
                        <strong>
                          ₹{budget.amount}
                        </strong>
                      </td>

                      <td>
                        {budget.month}
                      </td>

                      <td>
                        {budget.year}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default AdminDashboard;