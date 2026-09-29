import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav>
      <h2>PaisaWise</h2>

      <div>
        <Link to="/dashboard">Dashboard</Link>{" "}
        <Link to="/transactions">Transactions</Link>{" "}
        <Link to="/budgets">Budgets</Link>{" "}
        <Link to="/financial-insights">Financial Insights</Link>{" "}

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;