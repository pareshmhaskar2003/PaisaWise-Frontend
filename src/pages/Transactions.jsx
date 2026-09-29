import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import ConfirmModal from "../components/ConfirmModal";
import api from "../services/api";
import "../utils/Transactions.css";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const [form, setForm] = useState({
    amount: "",
    description: "",
    category: "FOOD",
    type: "EXPENSE",
    transactionDate: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    type: "ALL",
    category: "ALL",
    fromDate: "",
    toDate: "",
  });

  const resetForm = () => {
    setForm({
      amount: "",
      description: "",
      category: "FOOD",
      type: "EXPENSE",
      transactionDate: "",
    });

    setEditingId(null);
    setValidationErrors({});
  };

  const fetchTransactions = async () => {
    try {
      const response = await api.get("/transactions/my");

      setTransactions(response.data);
      setError("");
    } catch (err) {
      setError("Unable to load transactions.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: "",
      });
    }

    setError("");
  };

  const validateForm = () => {
    const errors = {};

    const amount = Number(form.amount);
    const description = form.description.trim();

    if (!form.amount) {
      errors.amount = "Amount is required.";
    } else if (Number.isNaN(amount)) {
      errors.amount = "Please enter a valid amount.";
    } else if (amount <= 0) {
      errors.amount = "Amount must be greater than 0.";
    }

    if (!description) {
      errors.description = "Description is required.";
    } else if (description.length < 2) {
      errors.description =
        "Description must contain at least 2 characters.";
    } else if (description.length > 100) {
      errors.description =
        "Description cannot exceed 100 characters.";
    }

    if (!form.category) {
      errors.category = "Please select a category.";
    }

    if (!form.type) {
      errors.type = "Please select a transaction type.";
    }

    if (!form.transactionDate) {
      errors.transactionDate = "Please select a date.";
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const transactionData = {
        amount: Number(form.amount),
        description: form.description.trim(),
        category: form.category,
        type: form.type,
        transactionDate: form.transactionDate,
      };

      if (editingId) {
        await api.put(
          `/transactions/${editingId}`,
          transactionData
        );
      } else {
        await api.post(
          "/transactions",
          transactionData
        );
      }

      resetForm();

      await fetchTransactions();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save transaction."
      );

      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (transaction) => {
    if (saving || deleting) {
      return;
    }

    setEditingId(transaction.id);

    setForm({
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category,
      type: transaction.type,
      transactionDate: transaction.transactionDate,
    });

    setValidationErrors({});
    setError("");

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
    setError("");
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

    try {
      setDeleting(true);
      setError("");

      await api.delete(
        `/transactions/${deleteId}`
      );

      await fetchTransactions();

      if (editingId === deleteId) {
        resetForm();
      }

      setDeleteId(null);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete transaction."
      );

      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const cancelEdit = () => {
    if (saving) {
      return;
    }

    resetForm();
  };

  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const filteredTransactions = transactions.filter(
    (transaction) => {
      const description =
        transaction.description?.toLowerCase() || "";

      const search =
        filters.search.trim().toLowerCase();

      const matchesSearch =
        description.includes(search);

      const matchesType =
        filters.type === "ALL" ||
        transaction.type === filters.type;

      const matchesCategory =
        filters.category === "ALL" ||
        transaction.category === filters.category;

      const matchesFromDate =
        !filters.fromDate ||
        transaction.transactionDate >=
          filters.fromDate;

      const matchesToDate =
        !filters.toDate ||
        transaction.transactionDate <=
          filters.toDate;

      return (
        matchesSearch &&
        matchesType &&
        matchesCategory &&
        matchesFromDate &&
        matchesToDate
      );
    }
  );

  const clearFilters = () => {
    setFilters({
      search: "",
      type: "ALL",
      category: "ALL",
      fromDate: "",
      toDate: "",
    });
  };

  const handleFromDateChange = (value) => {
    setFilters({
      ...filters,
      fromDate: value,
      toDate:
        filters.toDate &&
        value &&
        filters.toDate < value
          ? ""
          : filters.toDate,
    });
  };

  const handleToDateChange = (value) => {
    setFilters({
      ...filters,
      toDate: value,
      fromDate:
        filters.fromDate &&
        value &&
        filters.fromDate > value
          ? ""
          : filters.fromDate,
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="page-header">
          <div>
            <h1>Transactions</h1>
            <p className="subtitle">
              Track your income and expenses.
            </p>
          </div>
        </div>

        <LoadingSpinner message="Loading your transactions..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>Transactions</h1>

          <p className="subtitle">
            Track your income and expenses.
          </p>
        </div>
      </div>

      {/* Add / Edit Transaction */}
      <div className="form-card">
        <h2>
          {editingId
            ? "Edit Transaction"
            : "Add Transaction"}
        </h2>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="transaction-form"
          noValidate
        >
          {/* Amount */}
          <div className="form-group">
            <label>Amount</label>

            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              step="0.01"
              min="0.01"
              placeholder="Enter amount"
              disabled={saving}
            />

            {validationErrors.amount && (
              <span className="field-error">
                {validationErrors.amount}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>

            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="e.g. Grocery shopping"
              maxLength="100"
              disabled={saving}
            />

            {validationErrors.description && (
              <span className="field-error">
                {validationErrors.description}
              </span>
            )}
          </div>

          {/* Category */}
          <div className="form-group">
            <label>Category</label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              disabled={saving}
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

            {validationErrors.category && (
              <span className="field-error">
                {validationErrors.category}
              </span>
            )}
          </div>

          {/* Type */}
          <div className="form-group">
            <label>Type</label>

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              disabled={saving}
            >
              <option value="EXPENSE">
                Expense
              </option>
              <option value="INCOME">
                Income
              </option>
            </select>

            {validationErrors.type && (
              <span className="field-error">
                {validationErrors.type}
              </span>
            )}
          </div>

          {/* Date */}
          <div className="form-group">
            <label>Date</label>

            <input
              type="date"
              name="transactionDate"
              value={form.transactionDate}
              onChange={handleChange}
              disabled={saving}
            />

            {validationErrors.transactionDate && (
              <span className="field-error">
                {validationErrors.transactionDate}
              </span>
            )}
          </div>

          {/* Buttons */}
          <div className="form-actions">
            <button
              type="submit"
              disabled={saving}
            >
              {saving
                ? editingId
                  ? "Updating..."
                  : "Adding..."
                : editingId
                ? "Update Transaction"
                : "Add Transaction"}
            </button>

            {editingId && (
              <button
                type="button"
                className="secondary-button"
                onClick={cancelEdit}
                disabled={saving}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Transactions Table */}
      <div className="table-card">
        <div className="table-header">
          <div>
            <h2>My Transactions</h2>

            <p className="muted">
              {filteredTransactions.length} of{" "}
              {transactions.length} transaction(s)
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="transaction-filters">
          <input
            type="text"
            placeholder="Search description..."
            value={filters.search}
            onChange={(e) =>
              handleFilterChange(
                "search",
                e.target.value
              )
            }
            disabled={saving}
          />

          <select
            value={filters.type}
            onChange={(e) =>
              handleFilterChange(
                "type",
                e.target.value
              )
            }
            disabled={saving}
          >
            <option value="ALL">
              All Types
            </option>

            <option value="EXPENSE">
              Expenses
            </option>

            <option value="INCOME">
              Income
            </option>
          </select>

          <select
            value={filters.category}
            onChange={(e) =>
              handleFilterChange(
                "category",
                e.target.value
              )
            }
            disabled={saving}
          >
            <option value="ALL">
              All Categories
            </option>

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

          <div className="filter-date">
            <label>From</label>

            <input
              type="date"
              value={filters.fromDate}
              max={filters.toDate || undefined}
              onChange={(e) =>
                handleFromDateChange(
                  e.target.value
                )
              }
              disabled={saving}
            />
          </div>

          <div className="filter-date">
            <label>To</label>

            <input
              type="date"
              value={filters.toDate}
              min={filters.fromDate || undefined}
              onChange={(e) =>
                handleToDateChange(
                  e.target.value
                )
              }
              disabled={saving}
            />
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={clearFilters}
            disabled={saving}
          >
            Clear Filters
          </button>
        </div>

        {/* Table */}
        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <p>No transactions found.</p>

            <span>
              {transactions.length === 0
                ? "Add your first transaction above."
                : "Try changing your filters."}
            </span>
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
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map(
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
                          ₹
                          {Number(
                            transaction.amount
                          ).toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </strong>
                      </td>

                      <td>
                        {transaction.transactionDate}
                      </td>

                      <td>
                        <button
                          disabled={saving}
                          onClick={() =>
                            handleEdit(
                              transaction
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="danger-button"
                          disabled={saving}
                          onClick={() =>
                            openDeleteModal(
                              transaction.id
                            )
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteId !== null}
        title="Delete Transaction?"
        message="This transaction will be permanently deleted. This action cannot be undone."
        confirmText={
          deleting
            ? "Deleting..."
            : "Delete Transaction"
        }
        cancelText="Cancel"
        danger={true}
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
      />
    </Layout>
  );
}

export default Transactions;