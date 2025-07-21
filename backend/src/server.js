const express = require('express');
const cors = require("cors");
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const sanitize = require('./middleware/sanitize');
const limiter = require('./middleware/rateLimit');
const { errorHandler } = require('./middleware/errorMiddleware');
const routes = require('./routes');
const logger = require('./utils/logger');




// Load environment variables
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Enable CORS
app.use(cors({ origin: "*", credentials: true }));
// Body parser
app.use(express.json());

// Security middlewares
sanitize(app);
app.use(limiter);

// Test route
app.get('/', (req, res) => res.send('✅ API is running...'));

// Mount routes
app.use('/api', routes);

// Error handler (last middleware)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
