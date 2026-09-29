import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import api from "../services/api";

function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setError("");

        const response = await api.get("/admin/transactions");

        setTransactions(response.data);
      } catch (err) {
        setError("Unable to load transactions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="page-header">
          <div>
            <h1>All Transactions</h1>
            <p className="subtitle">
              Review transactions across all PaisaWise users.
            </p>
          </div>
        </div>

        <LoadingSpinner message="Loading transactions..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>All Transactions</h1>
          <p className="subtitle">
            Review transactions across all PaisaWise users.
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
            <h2>Transactions</h2>
            <p className="muted">
              {transactions.length} transaction(s)
            </p>
          </div>
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
                  <th>User</th>
                  <th>Email</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>
                      <strong>
                        {transaction.userName}
                      </strong>
                    </td>

                    <td>
                      {transaction.userEmail}
                    </td>

                    <td>
                      {transaction.description}
                    </td>

                    <td>
                      <span className="category-badge">
                        {transaction.category}
                      </span>
                    </td>

                    <td>
                      <span
                        className={
                          transaction.type === "INCOME"
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default AdminTransactions;