// Success Response Handler
import { DateTimeService } from "./datetime";
export const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
    const response = {
        success: true,
        message,
        statusCode,
        timestamp: DateTimeService.getCurrentDateTime().toISOString()
    };

    if (data !== null) {
        response.data = data;
        if (Array.isArray(data)) {
            response.count = data.length;
        }
    }

    return res.status(statusCode).json(response);
};

// Error Response Handler
export const errorResponse = (res, message = 'Internal Server Error', statusCode = 500, error = null) => {
    const response = {
        success: false,
        message,
        statusCode,
        timestamp: DateTimeService.getCurrentDateTime().toISOString()
    };

    if (error && process.env.NODE_ENV === 'development') {
        response.error = error.message;
    }

    return res.status(statusCode).json(response);
};

// Not Found Response
export const notFoundResponse = (res, message = 'Resource not found') => {
    return errorResponse(res, message, 200);
};

// Validation Error Response
export const validationErrorResponse = (res, message = 'Validation failed', errors = []) => {
    const response = {
        success: false,
        message,
        statusCode: 200,
        timestamp: DateTimeService.getCurrentDateTime().toISOString(),
        errors
    };

    return res.status(200).json(response);
};