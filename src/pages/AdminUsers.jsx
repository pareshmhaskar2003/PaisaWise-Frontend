import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import api from "../services/api";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingUserId, setTogglingUserId] =
    useState(null);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setError("");

      const response = await api.get("/admin/users");

      setUsers(response.data);
    } catch (err) {
      setError("Unable to load users.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggle = async (id) => {
    if (togglingUserId !== null) {
      return;
    }

    try {
      setError("");
      setTogglingUserId(id);

      await api.put(`/admin/users/${id}/toggle`);

      await fetchUsers();
    } catch (err) {
      setError("Unable to update user status.");
      console.error(err);
    } finally {
      setTogglingUserId(null);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="page-header">
          <div>
            <h1>Manage Users</h1>
            <p className="subtitle">
              View and manage registered PaisaWise users.
            </p>
          </div>
        </div>

        <LoadingSpinner message="Loading users..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>Manage Users</h1>
          <p className="subtitle">
            View and manage registered PaisaWise users.
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
            <h2>Users</h2>
            <p className="muted">
              {users.length} user(s)
            </p>
          </div>
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
                {users.map((user) => {
                  const isToggling =
                    togglingUserId === user.id;

                  return (
                    <tr key={user.id}>
                      <td>
                        <strong>{user.name}</strong>
                      </td>

                      <td>{user.email}</td>

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
                        <button
                          onClick={() =>
                            handleToggle(user.id)
                          }
                          disabled={
                            togglingUserId !== null
                          }
                        >
                          {isToggling
                            ? "Updating..."
                            : user.enabled
                            ? "Disable"
                            : "Enable"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default AdminUsers;