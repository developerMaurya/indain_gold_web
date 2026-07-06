import { errorResponse } from './apiResponse.js';
import { STATUS_CODES } from './statusCodes.js';
import { MESSAGES } from './message.js';

export const tryCatchHandler = (controller) => {
    return async (req, res, next) => {
        try {
            await controller(req, res, next);
        } catch (error) {
            console.error('Error in controller:', error);
            errorResponse(res, error || error.message, STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };
};