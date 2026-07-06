import { ReactCipher } from '../utils/stringCipher.js';
import { errorResponse } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../utils/statusCodes.js';

export const decryptPayload = (req, res, next) => {
    // Check if body is encrypted in a 'payload' field
    if (req.body && req.body.payload && typeof req.body.payload === 'string') {
        try {
            const encryptedPayloadValue = req.body.payload;
            const decryptedData = ReactCipher.decrypt(encryptedPayloadValue);

            if (!decryptedData) {
                console.log('📦 Encrypted Payload:', encryptedPayloadValue);
                console.error('❌ Decryption Failed: Result is empty or invalid.');
                return errorResponse(res, 'Invalid or corrupted encrypted payload', STATUS_CODES.BAD_REQUEST);
            }

            try {
                const parsedData = JSON.parse(decryptedData);
                req.body = parsedData;
                console.log('📦 Payload:', encryptedPayloadValue, `\n🔓 Decrypted:`, req.body);
            } catch (parseError) {
                console.error('❌ JSON Parse Error:', parseError.message);
                req.body = decryptedData;
                console.log('📦 Payload:', encryptedPayloadValue, `\n🔓 Decrypted (as string):`, decryptedData);
            }

            next();
        } catch (error) {
            console.error('❌ Decryption Error:', error.message);
            return errorResponse(res, 'Failed to decrypt payload', STATUS_CODES.BAD_REQUEST);
        }
    } else {
        // Strict Security: Block standard JSON access
        const errorMessage = `🚧 Access Denied: Standard JSON not allowed. Encrypted payload is required.`;
        console.warn(`${errorMessage} (Path: ${req.originalUrl})`);
        return errorResponse(res, errorMessage, STATUS_CODES.SUCCESS);
    }
};
