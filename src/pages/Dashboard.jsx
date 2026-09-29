import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import FinancialAlerts from "../components/FinancialAlerts";
import LoadingSpinner from "../components/LoadingSpinner";
import api from "../services/api";
import "../utils/Dashboard.css";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

function Dashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setError("");

        const response = await api.get("/dashboard");

        setDashboard(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load dashboard."
        );

        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const formatCurrency = (value) => {
    const number = Number(value || 0);

    return number.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const spendingData =
    dashboard?.spendingByCategory?.map((item) => ({
      name: item.category,
      value: Number(item.amount || 0),
    })) || [];

  const chartColors = [
    "#de6b3f",
    "#1f8a70",
    "#e9a23b",
    "#3b82a0",
    "#d95776",
    "#7b61a8",
  ];

  const selectedCategory = spendingData.find(
    (item) => item.name === activeCategory
  );

  const totalIncome = Number(
    dashboard?.totalIncome || 0
  );

  const totalExpense = Number(
    dashboard?.totalExpense || 0
  );

  const balance = Number(
    dashboard?.balance || 0
  );

  if (loading) {
    return (
      <Layout>
        <div className="page-header">
          <div>
            <h1>Dashboard</h1>

            <p className="subtitle">
              Here's your financial overview.
            </p>
          </div>
        </div>

        <LoadingSpinner message="Preparing your financial overview..." />
      </Layout>
    );
  }

  if (error || !dashboard) {
    return (
      <Layout>
        <div className="dashboard-error">
          <div className="dashboard-error-icon">
            ⚠️
          </div>

          <h2>Unable to load dashboard</h2>

          <p>
            {error ||
              "Something went wrong while loading your financial data."}
          </p>

          <button
            onClick={() => window.location.reload()}
          >
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
          <h1>Dashboard</h1>

          <p className="subtitle">
            Here's your financial overview.
          </p>
        </div>
      </div>

      {/* Financial Alerts */}
      <FinancialAlerts />

      {/* Summary Cards */}
      <div className="dashboard-summary-grid">

        {/* Income */}
        <div className="dashboard-card summary-card">
          <div className="summary-card-top">
            <span className="summary-icon income-icon">
              ↑
            </span>

            <span className="summary-label">
              Income
            </span>
          </div>

          <p className="card-value transaction-income">
            ₹{formatCurrency(totalIncome)}
          </p>

          <p className="muted">
            Total income recorded
          </p>
        </div>

        {/* Expenses */}
        <div className="dashboard-card summary-card">
          <div className="summary-card-top">
            <span className="summary-icon expense-icon">
              ↓
            </span>

            <span className="summary-label">
              Expenses
            </span>
          </div>

          <p className="card-value transaction-expense">
            ₹{formatCurrency(totalExpense)}
          </p>

          <p className="muted">
            Total expenses recorded
          </p>
        </div>

        {/* Balance */}
        <div className="dashboard-card summary-card">
          <div className="summary-card-top">
            <span className="summary-icon balance-icon">
              ₹
            </span>

            <span className="summary-label">
              Balance
            </span>
          </div>

          <p
            className={`card-value ${
              balance < 0
                ? "transaction-expense"
                : "transaction-income"
            }`}
          >
            ₹{formatCurrency(balance)}
          </p>

          <p className="muted">
            Income minus expenses
          </p>
        </div>

        {/* Highest Spending */}
        <div className="dashboard-card summary-card">
          <div className="summary-card-top">
            <span className="summary-icon spending-icon">
              ★
            </span>

            <span className="summary-label">
              Highest Spending
            </span>
          </div>

          {dashboard.highestSpendingCategory ? (
            <>
              <p className="card-value">
                ₹
                {formatCurrency(
                  dashboard.highestSpendingAmount
                )}
              </p>

              <p className="muted">
                {dashboard.highestSpendingCategory}
              </p>
            </>
          ) : (
            <p className="empty-message compact-empty">
              No expense data available.
            </p>
          )}
        </div>
      </div>

      {/* Spending Overview */}
      <div className="dashboard-card spending-card">
        <div className="card-header">
          <div>
            <h2>Spending by Category</h2>

            <p className="muted">
              See where your money is going.
            </p>
          </div>

          <button
            className="secondary-button"
            onClick={() =>
              navigate("/transactions")
            }
          >
            View Transactions
          </button>
        </div>

        {spendingData.length > 0 ? (
          <div className="spending-overview">

            {/* Category List */}
            <div className="category-spending-list" aria-label="Spending categories">
              {dashboard.spendingByCategory.map(
                (item, index) => (
                  <button
                    className="category-spending-item"
                    key={item.category}
                    type="button"
                    aria-pressed={activeCategory === item.category}
                    onMouseEnter={() => setActiveCategory(item.category)}
                    onFocus={() => setActiveCategory(item.category)}
                    onClick={() => setActiveCategory(
                      activeCategory === item.category ? null : item.category
                    )}
                  >
                    <div>
                      <span className="category-color-dot" style={{ backgroundColor: chartColors[index % chartColors.length] }} />
                      <strong>
                        {item.category}
                      </strong>

                      <span>
                        ₹
                        {formatCurrency(
                          item.amount
                        )}
                      </span>
                    </div>
                  </button>
                )
              )}
            </div>

            {/* Pie Chart */}
            <div className="spending-chart">
              <div className="chart-focus-label" aria-live="polite">
                {selectedCategory ? (
                  <>
                    <strong>{selectedCategory.name}</strong>
                    <span>₹{formatCurrency(selectedCategory.value)} spent</span>
                  </>
                ) : (
                  <span>Hover or select a category</span>
                )}
              </div>

              <ResponsiveContainer
                width="100%"
                height={300}
              >
                <PieChart>
                  <Pie
                    data={spendingData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                    onMouseEnter={(_, index) => setActiveCategory(
                      spendingData[index]?.name || null
                    )}
                    onMouseLeave={() => setActiveCategory(null)}
                  >
                    {spendingData.map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={chartColors[index % chartColors.length]}
                          fillOpacity={
                            activeCategory && activeCategory !== entry.name
                              ? 0.35
                              : 1
                          }
                          stroke="#ffffff"
                          strokeWidth={activeCategory === entry.name ? 4 : 2}
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip
                    formatter={(value) =>
                      `₹${formatCurrency(value)}`
                    }
                  />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="dashboard-empty">
            <div className="empty-icon">
              📊
            </div>

            <p>No spending data available yet.</p>

            <span>
              Add some expense transactions to see
              your spending breakdown.
            </span>

            <button
              className="secondary-button"
              onClick={() =>
                navigate("/transactions")
              }
            >
              Add Transaction
            </button>
          </div>
        )}
      </div>

      {/* Financial Advice */}
      <div className="dashboard-card advice-card">
        <div className="card-header">
          <div>
            <h2>💡 Financial Advice</h2>

            <p className="muted">
              Personalized guidance based on your
              activity.
            </p>
          </div>
        </div>

        <div className="advice-content">
          <span className="advice-icon">
            💡
          </span>

          <p>
            {dashboard.financialAdvice ||
              "Keep tracking your finances regularly to receive personalized insights."}
          </p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="dashboard-card recent-transactions-card">
        <div className="card-header">
          <div>
            <h2>Recent Transactions</h2>

            <p className="muted">
              Your latest financial activity.
            </p>
          </div>

          <button
            className="secondary-button"
            onClick={() =>
              navigate("/transactions")
            }
          >
            View All
          </button>
        </div>

        {dashboard?.recentTransactions?.length > 0 ? (
          <div className="recent-transactions-list">
            {dashboard.recentTransactions
              .slice(0, 5)
              .map((transaction) => (
                <div
                  className="recent-transaction"
                  key={transaction.id}
                >
                  <div className="recent-transaction-info">
                    <strong>
                      {transaction.description ||
                        "Transaction"}
                    </strong>

                    <span>
                      {transaction.category}{" "}
                      •{" "}
                      {transaction.transactionDate}
                    </span>
                  </div>

                  <div
                    className={
                      transaction.type ===
                      "INCOME"
                        ? "transaction-income"
                        : "transaction-expense"
                    }
                  >
                    {transaction.type ===
                    "INCOME"
                      ? "+"
                      : "-"}
                    ₹
                    {formatCurrency(
                      transaction.amount
                    )}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="dashboard-empty">
            <div className="empty-icon">
              💳
            </div>

            <p>
              No recent transactions available.
            </p>

            <span>
              Your latest transactions will appear
              here.
            </span>

            <button
              className="secondary-button"
              onClick={() =>
                navigate("/transactions")
              }
            >
              Add Transaction
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Dashboard;