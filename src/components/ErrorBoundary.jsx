import { Component } from "react";
import "../utils/ErrorBoundary.css";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error(
      "PaisaWise application error:",
      error,
      errorInfo
    );
  }

  handleReload = () => {
    window.location.reload();
  };

  handleDashboard = () => {
    window.location.href = "/dashboard";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-card">
            <div className="error-boundary-icon">
              ⚠️
            </div>

            <h1>Something went wrong</h1>

            <p>
              PaisaWise encountered an unexpected error.
              Please try again.
            </p>

            <div className="error-boundary-actions">
              <button
                onClick={this.handleReload}
              >
                Try Again
              </button>

              <button
                className="secondary-button"
                onClick={this.handleDashboard}
              >
                Go to Dashboard
              </button>
            </div>

            {import.meta.env.DEV &&
              this.state.error && (
                <details className="error-boundary-details">
                  <summary>
                    Technical details
                  </summary>

                  <pre>
                    {this.state.error.stack ||
                      this.state.error.message}
                  </pre>
                </details>
              )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;