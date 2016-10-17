'use strict';
const Promise = require('bluebird');
const tableName = 'order';

var repo = require('./repo');
var productRepo = require('./productRepo');
var couponRepo = require('./couponRepo');

const putItem = (item) => {
    return repo.getItem(tableName)(item);
}

const getItem = (id) => {
    return repo.getItem(tableName)(id);
}

const getSubmittedItem = () => {
    return repo.execute('scan', {
        TableName: tableName,
	FilterExpression : 'isSubmitted = :isSubmitted',
  	ExpressionAttributeValues : {':isSubmitted' : true}
    });
};

const validateSubmitProduct = (id) => {
    return new Promise((resolve, reject) => {
        getItem(id).then(results => {
            var isProductValid = false,
                isCouponValid = false
                order = results[0];
            var productIdList = order.products.map((product) => {
                return product.id;
            });
            productRepo.getItemsByIdList(productIdList).then((results) => {
                isProductValid = results.reduce(function (isValid, product) {
                    var orderProduct = order.product.find((item) => item.id == product.id);
                    return a & product.quantity > orderProduct.quantity;
                }, true);

                if (order.couponId != null) {
                    couponRepo.getItem(tableName).then(results => {
                        if (results[0].quantity > 0) {
                            isCouponValid = true;
                        }

                        resolve({isProductValid, isCouponValid});
                    });
                }
                else {
                    isCouponValid = true;
                    resolve({isProductValid, isCouponValid});
                }
            });
        });
    }).catch((error) => {
        reject(error);
    });
}

module.exports = {
    putItem,
    getItem,
    validateSubmitProduct,
    getSubmittedItem
};
