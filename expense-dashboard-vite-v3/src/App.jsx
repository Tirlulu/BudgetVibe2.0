import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layout/MainLayout.jsx';
import CategoriesPage from './pages/CategoriesPage.jsx';
import DataUploadPage from './pages/DataUploadPage.jsx';
import FixedExpensesPage from './pages/FixedExpensesPage.jsx';
import VariableExpensesPage from './pages/VariableExpensesPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/categories" replace />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="upload" element={<DataUploadPage />} />
          <Route path="expenses/fixed" element={<FixedExpensesPage />} />
          <Route path="expenses/variable" element={<VariableExpensesPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/categories" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
