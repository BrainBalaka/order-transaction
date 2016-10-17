# Order Transaction Service
The order transaction service is developed using serverless framework (https://github.com/serverless/serverless). This framework utilize AWS Lambda service, to make the application auto-scale. Please look at the serverless.yml file as an entry point.

# deployment guide
1. Install via npm:
  * `npm install -g serverless`

2. Set-up your [Provider Credentials](https://github.com/serverless/serverless/blob/master/docs/02-providers/aws/01-setup.md)
3. Run `npm install` to install dependencies.
  * note: since we won't need to deploy the development dependencies, use `npm prune --production` to remove the dev dependencies ([ref](https://github.com/serverless/serverless/issues/569)) 
3. Deploy the serverless service using the following command
  * `serverless deploy -v`

As the serverless framework currently does not support local debugging out of the box, this service will directly be deployed to AWS. However, we could modify the stage option when we run the deploy command.

# Features
The service features follows this scenario:

1. Order transaction involves the following actors: customer and admin.

2. Product dictionary → free to define product metadata and values as necessary, can be hardcoded,
  * Product has quantity; product with quantity 0 can not be ordered
3. Coupon dictionary → free to define coupon metadata and values as necessary, can be hardcoded
  * Coupon has certain date range validity and quantity
  * Coupon has certain amount of discount, can be percentage or nominal
  * Coupon can be applied to order before submission
4. Order transaction process flow and verification; single transaction has the following steps:
  * Customer can add product to an order
    api address: POST https://yx5m5q8z59.execute-api.ap-southeast-1.amazonaws.com/dev/orders
    request body: {}
    
    api Address: POST https://yx5m5q8z59.execute-api.ap-southeast-1.amazonaws.com/dev/orders/62a967f0-9451-11e6-b454-952db40271dc/products
    request body:
    `{
     "products": [ 
      {"productId": "xxx", "quantity": 2}
      ]
    }`
    
  * Customer can apply one coupon to order, only one coupon can be applied to order
    api Address: PUT https://yx5m5q8z59.execute-api.ap-southeast-1.amazonaws.com/dev/orders/62a967f0-9451-11e6-b454-952db40271dc
    request body:
    `{
     "couponId": "xxx"
    }`
  
  * Customer can submit an order and the order is finalized
    api Address: PUT https://yx5m5q8z59.execute-api.ap-southeast-1.amazonaws.com/dev/submit-orders/62a967f0-9451-11e6-b454-952db40271dc
    request body:
    `{}`
    
  * Customer can only pay via bank transfer
   api Address: PUT https://yx5m5q8z59.execute-api.ap-southeast-1.amazonaws.com/dev/orders/62a967f0-9451-11e6-b454-952db40271dc
    request body:
    `{
     "paymentNo": "xxx"
    }`
  
  When placing order the following data is required: name, phone number, email, address
  api Address: PUT https://yx5m5q8z59.execute-api.ap-southeast-1.amazonaws.com/dev/orders/62a967f0-9451-11e6-b454-952db40271dc
    request body:
    `{
     "name": "xxx", "phoneNumber: "xxx", "emai": "xxx", "address": "xxx" 
    }`
  * When an order is submitted, the quantity for ordered product will be reduced based on the quantity.
  * When an order is submitted, the quantity of the coupon will be reduced based on the applied coupon
  * An order is successfully submitted if fulfills all of the following condition:
  * Applied coupon is valid
   * All ordered products is available.
   * After an order is submitted, customer will be required to submit payment proof
  * After an order is submitted, the order is accessible to admin and ready to be processed
  api Address: GET https://yx5m5q8z59.execute-api.ap-southeast-1.amazonaws.com/dev/submitted-orders
  
  * Admin can view order detail
  API Address: GET https://yx5m5q8z59.execute-api.ap-southeast-1.amazonaws.com/dev/submitted-orders
  
  * Admin can verify the validity of order data: customer name, phone, email, address, payment proof
   * Given an order is valid, then Admin will prepare the ordered items for shipment
   * Given and order is invalid, then Admin can cancel the order
  * After an order ready for shipment, Admin ship process ordered items via logistic partner
  * After shipping the ordered items via logistic partner, Admin will mark the order as shipped and update the order with Shipping ID
  * Customer can check the order status for the submitted order
  * Customer can check the shipment status for the submitted order using Shipping ID
