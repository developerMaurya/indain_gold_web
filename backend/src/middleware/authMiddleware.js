import { JWTUtils } from '../utills/jwt.js';
import { errorResponse } from '../utills/apiResponse.js';
import { STATUS_CODES } from '../utills/statusCodes.js';
import { ROLES } from '../utills/enum.js';

export const authenticateToken = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return errorResponse(res, 'Access token required', STATUS_CODES.SUCCESS);

    try {
        req.auth = JWTUtils.verifyToken(token);
        next();
    } catch {
        return errorResponse(res, 'Invalid or expired token', STATUS_CODES.SUCCESS);
    }
};

export const optionalAuthenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (token) {
        try { req.auth = JWTUtils.verifyToken(token); }
        catch { req.auth = null; }
    } else {
        req.auth = null;
    }
    next();
};

export const authorizeAdmin = (req, res, next) => {
    if (req.auth?.Role === ROLES.ADMIN) {
        next();
    } else {
        return errorResponse(res, 'Access denied: Admins only', STATUS_CODES.UNAUTHRISED);
    }
};

export const authorizeUserOrAdmin = (req, res, next) => {
    const role = req.auth?.Role;
    console.log("role",role)
    if (role === ROLES.ADMIN || role === ROLES.USER) {
        next();
    } else {
        return errorResponse(res, 'Access denied: Unauthorized role', STATUS_CODES.UNAUTHRISED);
    }
};
