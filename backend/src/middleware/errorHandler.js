import { MESSAGES } from '../utills/message.js';
import { STATUS_CODES } from '../utills/statusCodes.js';

export const errorHandler = (err, req, res) => {
    // export const errorHandler = (err, req, res, next) => {
    console.error('Error Stack:', err.stack);

    const statusCode = err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;
    const message = err.message || MESSAGES.ERROR.SERVER;

    res.status(statusCode).json({
        success: false,
        message,
        statusCode,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

export const notFoundHandler = (req, res) => {
    res.status(STATUS_CODES.SUCCESS).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        statusCode: STATUS_CODES.SUCCESS
    });
};