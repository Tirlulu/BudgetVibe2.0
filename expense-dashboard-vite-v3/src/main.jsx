import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(err) {
    return { hasError: true, error: err };
  }
  componentDidCatch(err, info) {
    console.error(err, info);
  }
  render() {
    if (this.state.hasError && this.state.error) {
      const err = this.state.error;
      return (
        <div style={{ padding: 24, color: '#eee', fontFamily: 'system-ui', maxWidth: 600 }}>
          <h1>Something went wrong</h1>
          <p style={{ color: '#fca5a5', marginBottom: 16 }}>{err?.message || String(err)}</p>
          <button
            type="button"
            className="primary"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootEl = document.getElementById('root');
if (!rootEl) {
  document.body.innerHTML = '<div style="padding:24px;color:#eee">Root element not found.</div>';
} else {
  const root = createRoot(rootEl);
  root.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
