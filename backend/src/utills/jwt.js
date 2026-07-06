import jwt from 'jsonwebtoken';
import { ReactCipher } from './stringCipher.js';

const JWT_SECRET = process.env.JWT_SECRET || 'crm-secret-2025';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7777d';

const JWT_RESERVED_CLAIMS = ['iat', 'exp', 'nbf', 'jti', 'iss', 'aud', 'sub'];

export class JWTUtils {
    static generateToken(data) {
        const payload = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if (data[key] !== null && data[key] !== undefined) {
                    // Stringify to preserve type (number vs string) during encryption
                    payload[key] = ReactCipher.encrypt(JSON.stringify(data[key]));
                } else {
                    payload[key] = data[key];
                }
            }
        }
        // console.log("encrtyped payload...",payload)
        return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    }

    static verifyToken(token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const decryptedPayload = { ...decoded };
            
            for (const key in decoded) {
                if (Object.prototype.hasOwnProperty.call(decoded, key)) {
                    if (!JWT_RESERVED_CLAIMS.includes(key)) {
                        const originalValue = decoded[key];
                        if (originalValue !== null && originalValue !== undefined && typeof originalValue === 'string') {
                            try {
                                const decryptedValue = ReactCipher.decrypt(originalValue);
                                // If decrypt returns empty string it's likely an unencrypted old token failing to decrypt
                                if (decryptedValue !== null && decryptedValue !== '') {
                                    try {
                                        decryptedPayload[key] = JSON.parse(decryptedValue);
                                    } catch {
                                        decryptedPayload[key] = decryptedValue;
                                    }
                                } else {
                                    decryptedPayload[key] = originalValue;
                                }
                            } catch (e) {
                                console.log(e);
                                decryptedPayload[key] = originalValue;
                            }
                        }
                    }
                }
            }
            // console.log("decryptedpayload ...",decryptedPayload)
            return decryptedPayload;
        } catch (error) {
            console.log(error);
            throw new Error('Invalid or expired token', { cause: error });
        }
    }

    static decodeToken(token) {
        return jwt.decode(token);
    }
}