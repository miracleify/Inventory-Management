// src/server.js
const app = require('./app');
const config = require('../config/config');
const { initializeTables } = require('../config/database'); // <-- destructuring it from exports

const PORT = config.port || 3000;

initializeTables()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ Failed to initialize database tables:", err);
    process.exit(1);
  });
