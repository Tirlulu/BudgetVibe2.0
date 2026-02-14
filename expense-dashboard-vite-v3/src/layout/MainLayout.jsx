import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="pt-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
