'use strict';

var repo = require('./repo');
const tableName = 'product';

const putItem = (item) => {
    return repo.getItem(tableName)(item);
}

const getItem = (id) => {
    return repo.getItem(tableName)(id);
}

const getItemsByIdList = (idList) => {
    return repo.getItemsByIdList(tableName)(idList);
};

module.exports = {
    putItem,
    getItem
};
