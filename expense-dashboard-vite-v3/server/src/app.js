import express from 'express';
import cors from 'cors';
import categoryRoutes from './routes/categoryRoutes.js';
import importRoutes from './routes/importRoutes.js';
import expensesRoutes from './routes/expensesRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import statusRoutes from './routes/statusRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import resetRoutes from './routes/resetRoutes.js';

const app = express();
app.use(cors());

// Skip JSON body parsing for file upload so multer can read the multipart body.
app.use((req, res, next) => {
  if (req.originalUrl === '/api/import/credit-card' && req.method === 'POST') return next();
  express.json()(req, res, next);
});

app.use('/api/categories', categoryRoutes);
app.use('/api/import', importRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/reset-data', resetRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err?.message ?? err);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

export default app;
