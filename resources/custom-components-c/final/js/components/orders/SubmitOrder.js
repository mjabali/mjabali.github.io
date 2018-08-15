"use strict";
/**
 * Oracle Intelligent Bots Advanced Training
 * 
 * Component that saves order in a collection in Oracle Mobile Cloud. This component 
 * requires a shared storage collection named advt24hrsflowersOrders. 
 * 
 * Its important to set the policy below to Oracle Mobile Cloud to allow anonymous access.
 * 
 *    *.*.Security_CollectionsAnonymousAccess=advt24hrsflowersOrders
 * 
 * Error messages are written to _24hrsErrorMessage' context variable
 * 
 * @author Frank Nimphius, 2018
 */
module.exports = {

    metadata: () => ({
        "name": "advt.24hrs.flowers.orders.SubmitOrder",
        "properties": {
            "orderId": {
                "type": "string",
                "required": true
            },
            "productName": {
                "type": "string",
                "required": true
            },
            "pricePerUnit": {
                "type": "int",
                "required": true
            },
            "discountPercent": {
                "type": "string",
                "required": false
            },
            "orderQuantity": {
                "type": "int",
                "required": true
            },            
            "paymentDetails": {
                "type": "string",
                "required": true
            },
            "deliveryType": {
                "type": "string",
                "required": true
            },
            "deliveryCost": {
                "type": "int",
                "required": true
            },
            "recipientName": {
                "type": "string",
                "required": true
            },
            "recipientAddress": {
                "type": "string",
                "required": true
            },
            "recipientMobile": {
                "type": "string",
                "required": true
            },
            "cardSenderName": {
                "type": "string",
                "required": false
            },
            "cardMessage": {
                "type": "string",
                "required": false
            }
        },
        "supportedActions": ["OrderSubmitted"]
    }),

    invoke: (conversation, done) => {
        //const paymentType = conversation.properties().paymentType;
        const orderId = conversation.properties().orderId;
        const productName = conversation.properties().productName;
        const pricePerUnit = conversation.properties().pricePerUnit;
        const orderQuantity = conversation.properties().orderQuantity;
        const paymentDetails = conversation.properties().paymentDetails;
        const deliveryType = conversation.properties().deliveryType;
        const deliveryCost = conversation.properties().deliveryCost;
        const recipientName = conversation.properties().recipientName;
        const recipientAddress = conversation.properties().recipientAddress;
        const recipientMobile = conversation.properties().recipientMobile;

        //optional fields
        const discountPercent = conversation.properties().discountPercent ? conversation.properties().discountPercent : 0;
        const cardSenderName = conversation.properties().cardSenderName ? conversation.properties().cardSenderName : null;
        const cardMessage = conversation.properties().cardMessage ? conversation.properties().cardMessage : null;
    
        conversation.logger().fine('advt.24hrs.flowers.orders.SubmitOrder: Oracle Mobile SDK found? ' + conversation.oracleMobile? "true" : "false");

        if (conversation.oracleMobile != null) {
            //generate random order status. The options are:
            //delivered = order complete, active = in delivery, waiting = awaiting delivery, rejected = not accepted by recipient ,none = no action yet
            var orderStatusOptions = ['delivered', 'active', 'queued', 'none', 'rejected'];            
            var orderStatus = orderStatusOptions[Math.floor(Math.random()*orderStatusOptions.length)];
            conversation.logger().fine('advt.24hrs.flowers.orders.SubmitOrder: Order status set to ' + orderStatus);
            //create order JSON
            var order = {
                "order": {
                    "orderId": orderId,
                    "orderStatus": orderStatus,
                    "productName": productName,
                    "pricePerUnit": pricePerUnit,
                    "orderQuantity": orderQuantity,
                    "discountPercent": discountPercent
                },
                "payment": {
                    "paymentDetails": paymentDetails
                },
                delivery: {
                    "deliveryType": deliveryType,
                    "deliveryCost": deliveryCost
                },
                "recipient": {
                    "recipientName": recipientName,
                    "recipientAddress": recipientAddress,
                    "recipientMobile": recipientMobile,
                },
                "card": {
                    "cardSenderName": cardSenderName,
                    "cardMessage": cardMessage
                }
            }

            conversation.logger().fine('advt.24hrs.flowers.orders.SubmitOrder: JSON order string ' + JSON.stringify(order));

            //save order object in storage. Ensure object is correct JSON by stringifying and then parsing
            conversation.oracleMobile.storage.storeById("advt24hrsflowersOrders", orderId, JSON.parse(JSON.stringify(order)), {
                inType: 'json'
            }).then(
                function (result) {
                    conversation.logger().fine('advt.24hrs.flowers.orders.SubmitOrder: Order-Submit success: ' + JSON.stringify(result.result));
                    conversation.transition();
                },
                function (error) {
                    conversation.logger().fine('advt.24hrs.flowers.orders.SubmitOrder: Order-Submit error: status code ' + error.statusCode + " message:" + JSON.stringify(error.error));
                    conversation.transition("error");
                    conversation.variable('_24hrsErrorMessage', error.statusCode +" : "+error.error);
                }
            );

        } else {
            conversation.transition("error");
            conversation.variable('_24hrsErrorMessage', "Oracle Mobile SDK not found");
            conversation.logger().fine('advt.24hrs.flowers.orders.SubmitOrder: conversation.oracleMobile not found. Check your component service class.');
            done();
        }

        conversation.transition("error");
        done();
    }
};