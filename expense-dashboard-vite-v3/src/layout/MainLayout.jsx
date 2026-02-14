import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="app-layout" dir="ltr">
      <aside className="app-sidebar">
        <h2 className="app-sidebar-title">Finance</h2>
        <nav className="app-nav">
          <NavLink to="/categories" className={({ isActive }) => (isActive ? 'active' : '')}>
            Categories
          </NavLink>
          <NavLink to="/upload" className={({ isActive }) => (isActive ? 'active' : '')}>
            Data upload
          </NavLink>
          <NavLink to="/expenses/fixed" className={({ isActive }) => (isActive ? 'active' : '')}>
            Fixed expenses
          </NavLink>
          <NavLink to="/expenses/variable" className={({ isActive }) => (isActive ? 'active' : '')}>
            Variable expenses
          </NavLink>
          <NavLink to="/analytics" className={({ isActive }) => (isActive ? 'active' : '')}>
            Analytics
          </NavLink>
        </nav>
      </aside>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
