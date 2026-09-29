import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import "../utils/NotFound.css";

function NotFound() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="not-found-page">
        <div className="not-found-card">
          <div className="not-found-code">
            404
          </div>

          <h1>Page Not Found</h1>

          <p>
            The page you're looking for doesn't exist
            or may have been moved.
          </p>

          <div className="not-found-actions">
            <button
              onClick={() => navigate("/dashboard")}
            >
              🏠 Go to Dashboard
            </button>

            <button
              className="secondary-button"
              onClick={() => navigate(-1)}
            >
              ↩️ Go Back
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default NotFound;