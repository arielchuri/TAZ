// Entry point for the TAZ Express server.
// Mounts the matcher routes and starts listening on port 3001.

const express = require('express');
const cors = require('cors');
const matcherRoutes = require('./routes/matcher');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// All Give & Take API routes live under /api
app.use('/api', matcherRoutes);

app.listen(PORT, () => {
  console.log(`TAZ server running on http://localhost:${PORT}`);
});
