import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  FolderTree,
  UploadCloud,
  Layers,
  Repeat,
  TrendingUp,
  PieChart,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher.jsx';
import DataStatusIndicator from '../components/DataStatusIndicator.jsx';

const navItems = [
  { to: '/', key: 'nav.dashboard', icon: LayoutDashboard, end: true },
  { to: '/categories', key: 'nav.categories', icon: FolderTree, end: false },
  { to: '/upload', key: 'nav.dataUpload', icon: UploadCloud, end: false },
  { to: '/categorize', key: 'nav.uncategorized', icon: Layers, end: false },
  { to: '/expenses/fixed', key: 'nav.fixedExpenses', icon: Repeat, end: false },
  { to: '/expenses/variable', key: 'nav.variableExpenses', icon: TrendingUp, end: false },
  { to: '/analytics', key: 'nav.analytics', icon: PieChart, end: false },
  { to: '/settings', key: 'nav.settings', icon: Settings, end: false },
];

function NavLinkClass({ isActive }) {
  return `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
    isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100/50 hover:text-gray-900'
  }`;
}

function NavLinks({ onNavigate, showLabels = true }) {
  const { t } = useTranslation();
  return (
    <>
      {navItems.map(({ to, key, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={NavLinkClass}
          onClick={typeof onNavigate === 'function' ? onNavigate : undefined}
          aria-label={t(key)}
        >
          <Icon className="h-5 w-5 shrink-0" aria-hidden />
          {showLabels && <span>{t(key)}</span>}
        </NavLink>
      ))}
    </>
  );
}

export default function Navbar() {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100"
        role="banner"
      >
        <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6">
          {/* Start: Logo */}
          <div className="flex shrink-0 items-center">
            <Link
              to="/"
              className="bg-gradient-to-r from-indigo-600 to-primary-500 bg-clip-text text-lg font-semibold text-transparent hover:opacity-90 transition-opacity"
            >
              Expense
            </Link>
          </div>

          {/* Center: Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-1 flex-1 justify-center"
            aria-label={t('nav.finance')}
          >
            <NavLinks showLabels />
          </nav>

          {/* End: Utils + Mobile menu button */}
          <div className="flex items-center gap-3 ms-auto md:ms-0">
            <div className="hidden sm:flex items-center gap-3">
              <DataStatusIndicator />
              <LanguageSwitcher />
            </div>
            <button
              type="button"
              className="md:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100/50 transition-all duration-200"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? t('aria.closeMenu') : t('aria.openMenu')}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-slate-900/40"
          aria-hidden
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile panel */}
      <div
        className={`md:hidden fixed top-16 start-0 end-0 z-40 bg-white border-b border-gray-100 shadow-lg transition-transform duration-200 ease-out ${
          mobileOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <nav className="flex flex-col gap-1 p-4 max-h-[calc(100vh-4rem)] overflow-y-auto" aria-label={t('nav.finance')}>
          <NavLinks onNavigate={() => setMobileOpen(false)} showLabels />
        </nav>
        <div className="sm:hidden flex items-center justify-center gap-4 py-3 px-4 border-t border-gray-100">
          <DataStatusIndicator />
          <LanguageSwitcher />
        </div>
      </div>
    </>
  );
}
