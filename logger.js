const winston = require('winston');

// Create a logger instance
const logger = winston.createLogger({
  level: 'error', // Only log errors and more severe messages
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // Log in JSON format
  ),
  transports: [
    // Error logs to a file, rotating daily
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    
    // Optionally, use rotating logs for better file management (uncomment to use)
    // new winston.transports.DailyRotateFile({
    //   filename: 'logs/error-%DATE%.log',
    //   datePattern: 'YYYY-MM-DD',
    //   maxSize: '20m',
    //   maxFiles: '14d'
    // })
  ]
});

// Export the logger
module.exports = logger;
