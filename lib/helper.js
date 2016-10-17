module.exports.createSuccessResponse = (data) => {
    return response = {
        statusCode: 200,
        body: JSON.stringify(data),
    };
};

module.exports.createErrorResponse = (statusCode, data) => {
    return response = {
        statusCode: statusCode,
        body: JSON.stringify(data),
    };
};
