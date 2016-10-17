'user strict';
var orderRepo = require('../lib/orderRepo'),
    uuid = require('node-uuid');

module.exports.createOrder = (event, context, callback) => {
    var data = {
        id: uuid.v1(),
        isSubmitted: false,
        created: new Date().toISOString()
    };

    orderRepo.createItem(data).then(result => {
        const response = {
            statusCode: 200,
            body: JSON.stringify(data),
        };

       callback(null, response);
    }).catch(err => {
       callback(err);
    });
};

module.exports.getOrder = (event, context, callback) => {
    orderRepo.getItem(event.pathParameters.id).then(result => {
        const response = {
            statusCode: 200,
            body: JSON.stringify(result),
        };

       callback(null, response);
    }).catch(err => {
       callback(err);
    });
};
