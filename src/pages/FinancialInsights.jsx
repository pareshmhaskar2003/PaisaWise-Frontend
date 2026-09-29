import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import api from "../services/api";
import "../utils/FinancialInsights.css";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function FinancialInsights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setError("");

        const response = await api.get("/financial-insights");

        setInsights(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load financial insights."
        );

        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  const formatCurrency = (value) => {
    return Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const totalIncome = Number(
    insights?.totalIncome || 0
  );

  const totalExpense = Number(
    insights?.totalExpense || 0
  );

  const savings = Number(
    insights?.savings || 0
  );

  const savingsRate = Number(
    insights?.savingsRate || 0
  );

  const monthlyData = insights?.monthlyData || [];

  if (loading) {
    return (
      <Layout>
        <div className="page-header">
          <div>
            <h1>Financial Insights</h1>

            <p className="subtitle">
              Understand your spending and savings habits.
            </p>
          </div>
        </div>

        <LoadingSpinner message="Analyzing your income, expenses and savings..." />
      </Layout>
    );
  }

  if (error || !insights) {
    return (
      <Layout>
        <div className="insights-error">
          <div className="insights-error-icon">
            ⚠️
          </div>

          <h2>
            Unable to load financial insights
          </h2>

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
          <h1>Financial Insights</h1>

          <p className="subtitle">
            Understand your spending and savings habits.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="insights-summary-grid">
        <div className="insight-card income-card">
          <div className="insight-card-top">
            <span className="insight-icon">
              ↑
            </span>

            <span className="insight-label">
              Total Income
            </span>
          </div>

          <h2 className="income-value">
            ₹{formatCurrency(totalIncome)}
          </h2>

          <p>
            Total income recorded
          </p>
        </div>

        <div className="insight-card expense-card">
          <div className="insight-card-top">
            <span className="insight-icon">
              ↓
            </span>

            <span className="insight-label">
              Total Expenses
            </span>
          </div>

          <h2 className="expense-value">
            ₹{formatCurrency(totalExpense)}
          </h2>

          <p>
            Total expenses recorded
          </p>
        </div>

        <div className="insight-card savings-card">
          <div className="insight-card-top">
            <span className="insight-icon">
              ₹
            </span>

            <span className="insight-label">
              Savings
            </span>
          </div>

          <h2
            className={
              savings < 0
                ? "expense-value"
                : "income-value"
            }
          >
            ₹{formatCurrency(savings)}
          </h2>

          <p>
            Income minus expenses
          </p>
        </div>

        <div className="insight-card rate-card">
          <div className="insight-card-top">
            <span className="insight-icon">
              %
            </span>

            <span className="insight-label">
              Savings Rate
            </span>
          </div>

          <h2
            className={
              savingsRate < 0
                ? "expense-value"
                : "rate-value"
            }
          >
            {savingsRate.toFixed(2)}%
          </h2>

          <p>
            Percentage of income saved
          </p>
        </div>
      </div>

      {/* Quick Financial Summary */}
      <div className="insights-highlight-grid">
        <div className="insights-highlight-card">
          <div className="highlight-icon">
            📈
          </div>

          <div>
            <span>
              Monthly Data
            </span>

            <strong>
              {monthlyData.length} months
            </strong>

            <p>
              Financial activity included in your analysis.
            </p>
          </div>
        </div>

        <div className="insights-highlight-card">
          <div className="highlight-icon">
            💰
          </div>

          <div>
            <span>
              Highest Spending
            </span>

            <strong>
              {insights.highestSpendingCategory ||
                "No data"}
            </strong>

            {insights.highestSpendingCategory && (
              <p>
                ₹
                {formatCurrency(
                  insights.highestSpendingAmount
                )}
              </p>
            )}

            {!insights.highestSpendingCategory && (
              <p>
                No expense data available yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Income vs Expense */}
      <div className="insights-card-section">
        <div className="insights-section-header">
          <div>
            <h2>
              Income vs Expenses
            </h2>

            <p>
              Compare your income and expenses over the last
              6 months.
            </p>
          </div>
        </div>

        {monthlyData.length > 0 ? (
          <div className="insights-chart">
            <ResponsiveContainer
              width="100%"
              height={320}
            >
              <BarChart data={monthlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis dataKey="month" />

                <YAxis
                  tickFormatter={(value) =>
                    `₹${Number(value).toLocaleString(
                      "en-IN"
                    )}`
                  }
                />

                <Tooltip
                  formatter={(value) =>
                    `₹${formatCurrency(value)}`
                  }
                />

                <Legend />

                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#16a34a"
                  radius={[6, 6, 0, 0]}
                />

                <Bar
                  dataKey="expense"
                  name="Expenses"
                  fill="#dc2626"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="insights-empty">
            <span>📊</span>

            <p>
              No monthly data available.
            </p>
          </div>
        )}
      </div>

      {/* Savings Trend */}
      <div className="insights-card-section">
        <div className="insights-section-header">
          <div>
            <h2>
              Savings Trend
            </h2>

            <p>
              Track how your monthly savings are changing.
            </p>
          </div>
        </div>

        {monthlyData.length > 0 ? (
          <div className="insights-chart">
            <ResponsiveContainer
              width="100%"
              height={320}
            >
              <LineChart data={monthlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis dataKey="month" />

                <YAxis
                  tickFormatter={(value) =>
                    `₹${Number(value).toLocaleString(
                      "en-IN"
                    )}`
                  }
                />

                <Tooltip
                  formatter={(value) =>
                    `₹${formatCurrency(value)}`
                  }
                />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="savings"
                  name="Savings"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="insights-empty">
            <span>💰</span>

            <p>
              No savings trend available.
            </p>
          </div>
        )}
      </div>

      {/* Highest Spending */}
      <div className="insights-card-section">
        <div className="insights-section-header">
          <div>
            <h2>
              Highest Spending Category
            </h2>

            <p>
              Your largest expense category based on recorded
              transactions.
            </p>
          </div>
        </div>

        {insights.highestSpendingCategory ? (
          <div className="spending-highlight">
            <div className="spending-highlight-icon">
              🛍️
            </div>

            <div>
              <span>
                Highest spending category
              </span>

              <h3>
                {insights.highestSpendingCategory}
              </h3>

              <strong>
                ₹
                {formatCurrency(
                  insights.highestSpendingAmount
                )}
              </strong>
            </div>
          </div>
        ) : (
          <div className="insights-empty">
            <span>📊</span>

            <p>
              No expense data available yet.
            </p>
          </div>
        )}
      </div>

      {/* Financial Advice */}
      <div className="insights-card-section advice-section">
        <div className="insights-section-header">
          <div>
            <h2>
              💡 Financial Advice
            </h2>

            <p>
              Guidance based on your recorded financial
              activity.
            </p>
          </div>
        </div>

        <div className="insights-advice">
          <div className="advice-icon">
            💡
          </div>

          <p>
            {insights.financialAdvice ||
              "Keep tracking your finances regularly to receive personalized insights."}
          </p>
        </div>
      </div>

      {/* Monthly Overview */}
      <div className="insights-card-section">
        <div className="insights-section-header">
          <div>
            <h2>
              Monthly Overview
            </h2>

            <p>
              Detailed breakdown of your monthly financial
              activity.
            </p>
          </div>
        </div>

        {monthlyData.length > 0 ? (
          <div className="insights-table-wrapper">
            <table className="insights-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Income</th>
                  <th>Expenses</th>
                  <th>Savings</th>
                </tr>
              </thead>

              <tbody>
                {monthlyData.map(
                  (month, index) => (
                    <tr
                      key={`${month.month}-${index}`}
                    >
                      <td>
                        <strong>
                          {month.month}
                        </strong>
                      </td>

                      <td className="income-text">
                        ₹
                        {formatCurrency(
                          month.income
                        )}
                      </td>

                      <td className="expense-text">
                        ₹
                        {formatCurrency(
                          month.expense
                        )}
                      </td>

                      <td
                        className={
                          Number(
                            month.savings || 0
                          ) < 0
                            ? "expense-text"
                            : "income-text"
                        }
                      >
                        ₹
                        {formatCurrency(
                          month.savings
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="insights-empty">
            <span>📅</span>

            <p>
              No monthly data available.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default FinancialInsights;