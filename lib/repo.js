'use strict';
var Promise = require('bluebird'),
    db = require('./dynamodb');

const execute = (method, params) => {
    return db(method, params);
}

// getItems Repo function
const putItem = (tableName) => {
    return (item) => {
        return db('put', {
            TableName: tableName,
            Item: item
        });
    };
};

const getItem = (tableName) => {
    return (id) => {
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
    }
};

const getItemsByIdList = (tableName) => {
    return (idList) => {
        var params = {};
        params.RequestItems[tableName] = {};
        params.RequestItems[tableName].keys = idList.map(function (item) {
            return {id: item};
        })
        return db('batchGet', params);
    }
};

module.exports = {
    putItem,
    getItem,
    getItemsByIdList
};
