import './i18n.js';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { Button } from './ui/index.js';
import i18n from './i18n.js';
import './globals.css';

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
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
          <div className="max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="mb-2 text-lg font-semibold text-slate-900">{i18n.t('common.somethingWrong')}</h1>
            <p className="mb-6 text-sm text-red-500">{err?.message || String(err)}</p>
            <Button
              type="button"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              {i18n.t('common.tryAgain')}
            </Button>
          </div>
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
