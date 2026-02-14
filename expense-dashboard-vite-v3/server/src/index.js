import app from './app.js';

// Default 3001 to avoid conflict with other apps on 3000; frontend dev proxy targets this port.
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
