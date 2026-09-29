import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import ConfirmModal from "../components/ConfirmModal";
import api from "../services/api";
import "../utils/Budgets.css";

function Budgets() {
  const currentDate = new Date();
  const defaultBudgetPeriod = {
    month: String(currentDate.getMonth() + 1),
    year: String(currentDate.getFullYear()),
  };

  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    category: "FOOD",
    amount: "",
    ...defaultBudgetPeriod,
  });

  const [editingId, setEditingId] = useState(null);

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBudgets = async () => {
    try {
      setError("");

      const response = await api.get("/budget-insights");

      setBudgets(response.data);
    } catch (err) {
      setError("Unable to load budget insights.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const amount = Number(form.amount);

    if (!form.category) {
      setError("Please select a category.");
      return;
    }

    if (!amount || amount <= 0) {
      setError(
        "Budget amount must be greater than zero."
      );
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await api.put(`/budgets/${editingId}`, {
          category: form.category,
          amount,
          month: Number(form.month),
          year: Number(form.year),
        });
      } else {
        await api.post("/budgets", {
          category: form.category,
          amount,
          month: Number(form.month),
          year: Number(form.year),
        });
      }

      setForm({
        category: "FOOD",
        amount: "",
        ...defaultBudgetPeriod,
      });

      setEditingId(null);

      await fetchBudgets();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save budget."
      );

      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (budget) => {
    if (saving || deleting) {
      return;
    }

    setEditingId(budget.budgetId);

    setForm({
      category: budget.category,
      amount: budget.budgetAmount,
      month: String(budget.month),
      year: String(budget.year),
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const openDeleteModal = (id) => {
    if (saving) {
      return;
    }

    setDeleteId(id);
  };

  const closeDeleteModal = () => {
    if (deleting) {
      return;
    }

    setDeleteId(null);
  };

  const handleDelete = async () => {
    if (!deleteId) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      await api.delete(`/budgets/${deleteId}`);

      setDeleteId(null);

      await fetchBudgets();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete budget."
      );

      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const cancelEdit = () => {
    if (saving || deleting) {
      return;
    }

    setEditingId(null);

    setForm({
      category: "FOOD",
      amount: "",
      ...defaultBudgetPeriod,
    });
  };

  const formatCurrency = (value) => {
    return Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="page-header">
          <div>
            <h1>Budgets</h1>
            <p className="subtitle">
              Set spending limits and monitor your progress.
            </p>
          </div>
        </div>

        <LoadingSpinner message="Loading your budgets..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>Budgets</h1>
          <p className="subtitle">
            Set spending limits and monitor your progress.
          </p>
        </div>
      </div>

      <div className="form-card">
        <h2>
          {editingId ? "Edit Budget" : "Create Budget"}
        </h2>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="budget-form"
        >
          <div className="form-group">
            <label htmlFor="budget-category">
              Category
            </label>

            <select
              id="budget-category"
              name="category"
              value={form.category}
              onChange={handleChange}
              disabled={saving || deleting}
            >
              <option value="FOOD">Food</option>
              <option value="TRANSPORT">
                Transport
              </option>
              <option value="SHOPPING">
                Shopping
              </option>
              <option value="ENTERTAINMENT">
                Entertainment
              </option>
              <option value="BILLS">Bills</option>
              <option value="HEALTH">Health</option>
              <option value="EDUCATION">
                Education
              </option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="budget-amount">
              Budget Amount
            </label>

            <input
              id="budget-amount"
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="Enter budget amount"
              required
              disabled={saving || deleting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="budget-month">Month</label>

            <select
              id="budget-month"
              name="month"
              value={form.month}
              onChange={handleChange}
              disabled={saving || deleting}
              required
            >
              {Array.from({ length: 12 }, (_, index) => (
                <option key={index + 1} value={index + 1}>
                  {new Date(2000, index).toLocaleString("en", {
                    month: "long",
                  })}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="budget-year">Year</label>

            <input
              id="budget-year"
              type="number"
              name="year"
              value={form.year}
              onChange={handleChange}
              min="2020"
              required
              disabled={saving || deleting}
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={saving || deleting}
            >
              {saving
                ? editingId
                  ? "Updating..."
                  : "Creating..."
                : editingId
                ? "Update Budget"
                : "Create Budget"}
            </button>

            {editingId && (
              <button
                type="button"
                className="secondary-button"
                onClick={cancelEdit}
                disabled={saving || deleting}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="budgets-section">
        <div className="section-header">
          <div>
            <h2>Budget Overview</h2>
            <p className="muted">
              Monitor your spending against each budget.
            </p>
          </div>
        </div>

        {budgets.length === 0 ? (
          <div className="empty-state">
            <p>No budgets available.</p>
            <span>
              Create your first budget above.
            </span>
          </div>
        ) : (
          <div className="budget-grid">
            {budgets.map((budget) => {
              const percentage = Math.min(
                Number(budget.percentageUsed),
                100
              );

              return (
                <div
                  className={`budget-card ${
                    budget.overBudget
                      ? "budget-card-over"
                      : ""
                  }`}
                  key={budget.budgetId}
                >
                  <div className="budget-card-header">
                    <div>
                      <h3>{budget.category}</h3>

                      <span className="category-badge">
                        Budget
                      </span>
                    </div>

                    <div className="budget-actions">
                      <button
                        onClick={() =>
                          handleEdit(budget)
                        }
                        disabled={saving || deleting}
                      >
                        Edit
                      </button>

                      <button
                        className="danger-button"
                        onClick={() =>
                          openDeleteModal(
                            budget.budgetId
                          )
                        }
                        disabled={saving || deleting}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="budget-amount-row">
                    <div>
                      <span className="budget-label">
                        Budget
                      </span>

                      <strong>
                        ₹
                        {formatCurrency(
                          budget.budgetAmount
                        )}
                      </strong>
                    </div>

                    <div>
                      <span className="budget-label">
                        Spent
                      </span>

                      <strong>
                        ₹
                        {formatCurrency(
                          budget.spentAmount
                        )}
                      </strong>
                    </div>
                  </div>

                  <div className="budget-progress">
                    <div className="budget-progress-header">
                      <span>
                        {Number(
                          budget.percentageUsed
                        ).toFixed(2)}
                        % used
                      </span>

                      <span>
                        {budget.overBudget
                          ? "Over budget"
                          : "On track"}
                      </span>
                    </div>

                    <div className="progress-track">
                      <div
                        className={`progress-bar ${
                          budget.overBudget
                            ? "progress-danger"
                            : "progress-normal"
                        }`}
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="budget-footer">
                    <span>
                      {budget.overBudget
                        ? "Exceeded by"
                        : "Remaining"}
                    </span>

                    <strong
                      className={
                        budget.overBudget
                          ? "over-budget-text"
                          : "remaining-text"
                      }
                    >
                      ₹
                      {formatCurrency(
                        Math.abs(
                          Number(
                            budget.remainingAmount
                          )
                        )
                      )}
                    </strong>
                  </div>

                  {budget.overBudget && (
                    <div className="budget-warning">
                      ⚠️ You have exceeded this budget.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteId !== null}
        title="Delete Budget?"
        message="This budget will be permanently deleted. This action cannot be undone."
        confirmText={
          deleting ? "Deleting..." : "Delete Budget"
        }
        cancelText="Cancel"
        danger={true}
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
      />
    </Layout>
  );
}

export default Budgets;