"use strict";
/**
 * Oracle Intelligent Bots Advanced Training
 * * Its important to set the policy below to Oracle Mobile Cloud to allow anonymous access.
 * 
 *    *.*.Security_CollectionsAnonymousAccess=advt24hrsflowersOrders
 * HACKATHON:  The challenge
 * 
 *
 * The TrackOrder custom component should query the "advt24hrsflowersOrders" collection
 * for a specific order ID. When the order ID is found, it should display a order summary 
 * to the user. It should list the orderId, the order status, the ordered product, as well 
 * as the total cost.
 * 
 * If the order status is NOT "delivered" or "active" then users should be able to cancel
 * the order. In addition, an option should be provided that redirects navigation to human 
 * agent support.
 * 
 * Hint: you need also handle the case in which the user does not want to cancel or speak
 * to a human agent. In this case the flow should just continue.
 * 
 * A full description of the hackathon is provided in a separate document
 * 
 * 
 * 
 * @author <YOUR NAME>, 2018
 */
module.exports = {

    metadata: () => ({
        "name": "advt.24hrs.flowers.orders.TrackOrder",
        "properties": {
            "orderId": {
                "type": "string",
                "required": true
            },
            "locale": {
                "type": "string",
                "required": true
            }
        },
        "supportedActions": ["OrderIdNotFound","OrderCancelled", "HumanAgentRequest"]
    }),

    invoke: (conversation, done) => {

        //read properties from user input
        const orderId = conversation.properties().orderId;
        conversation.logger().fine('advt.24hrs.flowers.orders.TrackOrder: Order Id to Query ' + orderId);
        const locale = conversation.properties().locale == "de" ? "de" : conversation.properties().locale == "fr" ? "fr" : "en";
        conversation.logger().fine('advt.24hrs.flowers.orders.TrackOrder: Locale is "' + locale +'"');
        
        //get mobile SDK to access Mobile Cloud
        const mobileSdk = conversation.oracleMobile;
        conversation.logger().fine('advt.24hrs.flowers.orders.TrackOrder: Oracle Mobile SDK found? ' + mobileSdk ? "true" : "false");

        /*******************
        START HACKATHON HERE
        ********************/
        if (mobileSDK) {

            
        //storage collection object read access help:
        // see: https://docs.oracle.com/en/cloud/paas/mobile-autonomous-cloud/develop/calling-apis-custom-code.html#GUID-E1F65C15-F172-48D7-B635-F3F5922AA982

        //storage collection delete object help:
        // see: https://docs.oracle.com/en/cloud/paas/mobile-autonomous-cloud/develop/calling-apis-custom-code.html#GUID-819E1BB3-35FB-441D-8A77-172AFEBD2EC8

            
            done();
        } else {
            conversation.transition("error");
            conversation.logger().fine('advt.24hrs.flowers.orders.TrackOrder: conversation.oracleMobile not found. Check your component service class.');
            done();
        }
    }
};