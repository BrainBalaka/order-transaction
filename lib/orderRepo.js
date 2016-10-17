'use strict';
var Promise = require('bluebird'),
    db = require('./dynamodb');

const tableName = 'order';

// getItems Repo function
module.exports.createItem = (item) => {
    return db('put', {
        TableName: tableName,
        Item: item
    });
};

module.exports.getItem = (id) => {
    return db('query', {
        TableName: tableName,
        KeyConditionExpression: '#id = :id',
        ExpressionAttributeValues: {
            ':id': id
        },
        ExpressionAttributeNames: {
            '#id': 'id'
        }
    });
};
