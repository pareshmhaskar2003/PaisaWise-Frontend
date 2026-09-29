import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import api from "../services/api";

function AdminBudgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        setError("");

        const response = await api.get("/admin/budgets");

        setBudgets(response.data);
      } catch (err) {
        setError("Unable to load budgets.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="page-header">
          <div>
            <h1>All Budgets</h1>
            <p className="subtitle">
              Review budgets created by PaisaWise users.
            </p>
          </div>
        </div>

        <LoadingSpinner message="Loading budgets..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>All Budgets</h1>
          <p className="subtitle">
            Review budgets created by PaisaWise users.
          </p>
        </div>
      </div>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      <div className="table-card">
        <div className="table-header">
          <div>
            <h2>Budgets</h2>
            <p className="muted">
              {budgets.length} budget(s)
            </p>
          </div>
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
                  <th>User</th>
                  <th>Email</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Month</th>
                  <th>Year</th>
                </tr>
              </thead>

              <tbody>
                {budgets.map((budget) => (
                  <tr key={budget.id}>
                    <td>
                      <strong>
                        {budget.userName}
                      </strong>
                    </td>

                    <td>
                      {budget.userEmail}
                    </td>

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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default AdminBudgets;