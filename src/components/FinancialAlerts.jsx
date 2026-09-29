import { useEffect, useState } from "react";
import api from "../services/api";

function FinancialAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [dismissedAlerts, setDismissedAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await api.get("/financial-alerts");
        setAlerts(response.data);
      } catch (err) {
        console.error("Unable to load financial alerts.", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const visibleAlerts = alerts.filter(
    (alert, index) => !dismissedAlerts.includes(`${alert.type}-${index}`)
  );

  const dismissAlert = (alertKey) => {
    setDismissedAlerts((current) => [...current, alertKey]);
  };

  if (loading || visibleAlerts.length === 0) {
    return null;
  }

  return (
    <section
      className="financial-alerts"
      aria-labelledby="financial-alerts-title"
      aria-live="polite"
    >
      <div className="financial-alerts-header">
        <div>
          <div className="financial-alerts-heading">
            <span className="financial-alerts-bell" aria-hidden="true">
              !
            </span>
            <div>
              <h2 id="financial-alerts-title">Needs your attention</h2>
              <p className="muted">
                A few updates could affect your spending plan.
              </p>
            </div>
          </div>
        </div>

        <span className="alert-count">
          {visibleAlerts.length} {visibleAlerts.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="financial-alert-list">
        {visibleAlerts.map((alert) => {
          const alertKey = `${alert.type}-${alerts.indexOf(alert)}`;
          const severity = alert.severity?.toLowerCase() || "warning";
          const isDanger = severity === "danger";

          return (
          <div
            className={`financial-alert financial-alert-${severity}`}
            key={alertKey}
            role={isDanger ? "alert" : "status"}
          >
            <div className="financial-alert-icon" aria-hidden="true">
              {isDanger ? "!" : "i"}
            </div>

            <div className="financial-alert-content">
              <div className="financial-alert-title-row">
                <strong>{alert.title}</strong>
                <span className="financial-alert-severity">
                  {severity}
                </span>
              </div>
              <p>{alert.message}</p>
            </div>

            <button
              className="financial-alert-dismiss"
              type="button"
              onClick={() => dismissAlert(alertKey)}
              aria-label={`Dismiss ${alert.title}`}
            >
              Dismiss
            </button>
          </div>
          );
        })}
      </div>
    </section>
  );
}

export default FinancialAlerts;