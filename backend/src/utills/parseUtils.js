// utils/parseUtils.js

/**
 * Parse various boolean representations to actual boolean
 * @param {*} value - The value to parse (can be string, boolean, number, null, undefined)
 * @returns {boolean|null} - Parsed boolean or null if not parseable
 */
export const parseBoolean = (value) => {
    if (value === null || value === undefined) return null;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
        const lowerValue = value.toLowerCase().trim();
        if (lowerValue === 'true') return true;
        if (lowerValue === 'false') return false;
        if (lowerValue === '1') return true;
        if (lowerValue === '0') return false;
        if (lowerValue === 'yes') return true;
        if (lowerValue === 'no') return false;
        if (lowerValue === 'on') return true;
        if (lowerValue === 'off') return false;
        if (lowerValue === 'y') return true;
        if (lowerValue === 'n') return false;
    }
    if (typeof value === 'number') {
        return value === 1;
    }
    return null;
};

/**
 * Parse to database boolean (0 or 1)
 * @param {*} value - The value to parse
 * @returns {number|null} - 1 for true, 0 for false, null for unparseable
 */
export const parseToDatabaseBoolean = (value) => {
    const boolValue = parseBoolean(value);
    if (boolValue === null) return null;
    return boolValue ? 1 : 0;
};

/**
 * Parse integer from various representations
 * @param {*} value - The value to parse
 * @returns {number|null} - Parsed integer or null if not parseable
 */
export const parseInteger = (value) => {
    if (value === null || value === undefined) return null;
    if (typeof value === 'number') return Math.floor(value);
    if (typeof value === 'string') {
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? null : parsed;
    }
    return null;
};

/**
 * Parse float from various representations
 * @param {*} value - The value to parse
 * @returns {number|null} - Parsed float or null if not parseable
 */
export const parseFloat = (value) => {
    if (value === null || value === undefined) return null;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? null : parsed;
    }
    return null;
};

/**
 * Parse string, trim whitespace
 * @param {*} value - The value to parse
 * @returns {string|null} - Parsed string or null if not parseable
 */
export const parseString = (value) => {
    if (value === null || value === undefined) return null;
    if (typeof value === 'string') return value.trim();
    return String(value).trim();
};

// Default export with all functions
export default {
    parseBoolean,
    parseToDatabaseBoolean,
    parseInteger,
    parseFloat,
    parseString
};