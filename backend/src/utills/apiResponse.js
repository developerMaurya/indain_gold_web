import { STATUS_CODES } from './statusCodes.js';

export const successResponse = (res, message, data = null, statusCode = STATUS_CODES.SUCCESS) => {
    const response = {
        Success: true,
        Message: message,
        StatusCode: statusCode
    };
    if (data !== null) {
        response.Data = Array.isArray(data) ? data : [data];
    }

    return res.status(statusCode).json(response);
};

export const successTableResponse = (res, message, totalTable = 0, totoalReserve = 0, totalAvailable = 0, totalOccupied = 0, data = null, statusCode = STATUS_CODES.SUCCESS) => {
    const response = {
        Success: true,
        Message: message,
        TotalTable: totalTable,
        TotoalReserve: totoalReserve,
        TotalAvailable: totalAvailable,
        TotalOccupied: totalOccupied,
        Data: data,
        StatusCode: statusCode
    };
    if (data !== null) {
        response.Data = Array.isArray(data) ? data : [data];
    }

    return res.status(statusCode).json(response);
};

export const successResponseReserve = (res, message, data = null, ResNumber, statusCode = STATUS_CODES.SUCCESS) => {
    const response = {
        Success: true,
        Message: message,
        ReservationNumber: ResNumber,
        StatusCode: statusCode
    };
    if (data !== null) {
        response.Data = Array.isArray(data) ? data : [data];
    }

    return res.status(statusCode).json(response);
};

export const successResponseData = (res, message, data = null, statusCode = STATUS_CODES.SUCCESS) => {
    const response = {
        Success: true,
        Message: message,
        StatusCode: statusCode
    };

    if (data !== null) {
        if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
            Object.assign(response, data);
        } else {
            response.Data = data;
        }
    }

    return res.status(statusCode).json(response);
};

export const errorResponse = (res, message, statusCode = STATUS_CODES.SUCCESS, errors = null) => {
    const response = {
        Success: false,
        Message: message,
        StatusCode: statusCode
    };

    if (errors !== null) {
        response.Errors = errors;
    }

    return res.status(statusCode).json(response);
};


// success with recourd data -

export const successResponseWithRecords = (res, message, data = null, records = 0, statusCode = STATUS_CODES.SUCCESS) => {
    const response = {
        Success: true,
        Message: message,
        StatusCode: statusCode,

    };

    if (data !== null) {
        response.Data = Array.isArray(data) ? data : [data];
    }
    response.Records = records;
    return res.status(statusCode).json(response);
};

export const errorResponseWithRecords = (res, message, statusCode = STATUS_CODES.SUCCESS, errors = null, records = 0) => {
    const response = {
        Success: false,
        Message: message,
        StatusCode: statusCode,
        Records: records
    };

    if (errors !== null) {
        response.Errors = errors;
    }

    return res.status(statusCode).json(response);
};

// successResponseAll - Dynamically unpacks raw dbRecord columns cleanly into the API response root
export const successResponseAll = (res, dbRecord, statusCode = STATUS_CODES.SUCCESS) => {
    const { ret, Message, JsonData, ...otherData } = dbRecord || {};

    return res.status(statusCode).json({
        Success: true,
        Message: Message || "",
        StatusCode: statusCode,
        ...otherData,
        Data: JSON.parse(JsonData || "[]")
    });
};
export const successResponseInsertAll = (res, dbRecord, statusCode = STATUS_CODES.SUCCESS) => {
    const { ret, Message, JsonData, ...otherData } = dbRecord || {};

    return res.status(statusCode).json({
        Success: true,
        Message: Message || "",
        StatusCode: statusCode,
        ...otherData
    });
};