import morgan from 'morgan';

/**
 * Robust Logger Utility
 * Provides safe logging methods that won't crash the application.
 * Falls back to console if needed.
 */
export const logger = {
  info: (message, data = {}) => {
    try {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] INFO: ${message}`, data);
    } catch (err) {
      console.log('Logging failed:', message);
    }
  },

  error: (error, metadata = {}) => {
    try {
      const timestamp = new Date().toISOString();
      const logData = {
        timestamp,
        level: 'ERROR',
        message: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        ...metadata
      };
      
      console.error('ERROR LOG:', JSON.stringify(logData, null, 2));
    } catch (err) {
      console.error('LOGGER CRASH:', err);
      // Absolute fallback
      console.error('ORIGINAL ERROR:', error);
    }
  },

  warn: (message, data = {}) => {
    try {
      const timestamp = new Date().toISOString();
      console.warn(`[${timestamp}] WARN: ${message}`, data);
    } catch (err) {
      console.warn('Warning log failed:', message);
    }
  }
};

/**
 * Migration Helpers (deprecated, prefer logger.info/error)
 */
export const logError = logger.error;
export const logInfo = logger.info;

/**
 * Morgan Request Logger Middleware
 */
export const httpLogger = morgan('combined');

