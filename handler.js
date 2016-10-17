'user strict';
var orderRepo = require('../lib/orderRepo'),
    uuid = require('node-uuid'),
    helper = require('../lib/helper');

module.exports.createOrder = (event, context, callback) => {
    var data = {
        id: uuid.v1(),
        isSubmitted: false,
        created: new Date().toISOString()
    };

    orderRepo.putItem(data).then(result => {
       callback(null, helper.createSuccessResponse(data));
    }).catch(err => {
       callback(err);
    });
};

module.exports.getOrder = (event, context, callback) => {
    orderRepo.getItem(event.pathParameters.id).then(result => {
        callback(null, helper.createSuccessResponse(result));
    }).catch(err => {
       callback(err);
    });
};

module.exports.addProductOrder = (event, context, callback) => {
    const eventBody = JSON.parse(event.body);
    var data = {
        id: event.pathParameters.id,
        products: eventBody.products,
        updated: new Date().toISOString()
    };

    orderRepo.putItem(data).then(result => {
       callback(null, helper.createSuccessResponse(result));
    }).catch(err => {
       callback(err);
    });
};

module.exports.updateorder  = (event, context, callback) => {
    const data = JSON.parse(event.body);
    data.id = event.pathParameters.id;
    data.updated = new Date().toISOString();

    orderRepo.putItem(data).then(result => {
       callback(null, helper.createSuccessResponse(result));
    }).catch(err => {
       callback(err);
    });
};

module.exports.submitOrder = (event, context, callback) => {
    const data = {
        id: event.pathParameters.id,
        isSubmitted: true,
        updated: new Date().toISOString()
    };

    orderRepo.validateSubmitProduct(data.id).then((result) => {
        if (result.isProductValid && result.isCouponValid) {
            orderRepo.putItem(data).then(result => {
                callback(null, helper.createSuccessResponse(result));
            }).catch(err => {
                callback(err);
            });
        }
        else {
            helper.createErrorResponse(400, {
                isProductValid: result.isProductValid,
                isCouponValid: result.isCouponValid
            });
        }
        }).catch(err => {
            callback(err);
        });
};

module.exports.getSubmittedOrder = (event, context, callback) => {
    orderRepo.getSubmittedItem().then(result => {
        callback(null, helper.createSuccessResponse(result));
    }).catch(err => {
       callback(err);
    });
};

module.exports.createShipment = (event, context, callback) => {
    const data = JSON.parse(event.body);
    const orderId = event.pathParameters.id;
    data.id = euuid.v1();

    shipmentRepo.putItem(data).then(result => {
        orderRepo.putItem({
            id: orderId,
            shipmentId: data.id
        })
       callback(null, helper.createSuccessResponse(result));
    }).catch(err => {
       callback(err);
    });
};

module.exports.updateShipment = (event, context, callback) => {
    const data = JSON.parse(event.body);
    data.id = event.pathParameters.id;

    shipmentRepo.putItem(data).then(result => {
       callback(null, helper.createSuccessResponse(result));
    }).catch(err => {
       callback(err);
    });
};

module.exports.getShipment = (event, context, callback) => {
    shipmentRepo.getItem(event.pathParameters.id).then(result => {
        callback(null, helper.createSuccessResponse(result));
    }).catch(err => {
       callback(err);
    });
};
