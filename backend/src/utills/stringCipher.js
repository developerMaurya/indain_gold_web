import crypto from 'crypto';
import CryptoJS from "crypto-js";
import 'dotenv/config';

const hash = "oxT&@@R%$%8988JHWFIUWHjjnjdjds92aAXn00";
const SECRET_KEY = "HotelQR@2025@SecretKey";

export class StringCipher {
    static encrypt(encryptionText) {
        try {
            // Create MD5 hash of the key
            const key = crypto.createHash('md5').update(hash).digest();
            const key24 = Buffer.concat([key, key.slice(0, 8)]); // Create 24-byte key for 3DES

            const cipher = crypto.createCipheriv('des-ede3', key24, null);
            let encrypted = cipher.update(encryptionText, 'utf8', 'base64');
            encrypted += cipher.final('base64');
            return encrypted;
        } catch (error) {
            throw new Error('Encryption failed: ' + error.message, { cause: error });
        }
    }

    static decrypt(cipherText) {
        try {
            // Create MD5 hash of the key
            const key = crypto.createHash('md5').update(hash).digest();
            const key24 = Buffer.concat([key, key.slice(0, 8)]); // Create 24-byte key for 3DES

            const decipher = crypto.createDecipheriv('des-ede3', key24, null);
            let decrypted = decipher.update(cipherText, 'base64', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        } catch (error) {
            throw new Error('Decryption failed: ' + error.message, { cause: error });
        }
    }
}

export class ReactCipher {
    static encrypt(data) {
        if (!data) return null;
        return CryptoJS.AES.encrypt(String(data), SECRET_KEY).toString();
    }

    static decrypt(cipher) {
        try {
            if (!cipher) return null;
            const bytes = CryptoJS.AES.decrypt(cipher, SECRET_KEY);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);
            if (!decrypted) return null;
            return decrypted;
        } catch {
            return null;
        }
    }
}