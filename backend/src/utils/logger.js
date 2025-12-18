import morgan from 'morgan';

export const logger = morgan('combined');

export const logError = (error, req = null) => {
  const timestamp = new Date().toISOString();
  const logData = {
    timestamp,
    error: error.message,
    stack: error.stack,
  };

  if (req) {
    logData.method = req.method;
    logData.url = req.url;
    logData.ip = req.ip;
  }

  console.error('Error Log:', JSON.stringify(logData, null, 2));
};

export const logInfo = (message, data = {}) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`, data);
};

