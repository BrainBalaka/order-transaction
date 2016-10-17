'use strict';

var repo = require('./repo');
const tableName = 'shipment';

const putItem = (item) => {
    return repo.putItem(tableName)(item);
};

const getItem = (id) => {
    return repo.getItem(tableName)(id);
};

module.exports = {
    putItem,
    getItem
};
