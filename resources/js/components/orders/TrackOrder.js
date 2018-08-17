"use strict";
/**
 * Oracle Intelligent Bots Advanced Training
 * * Its important to set the policy below to Oracle Mobile Cloud to allow anonymous access.
 * 
 *    *.*.Security_CollectionsAnonymousAccess=advt24hrsflowersOrders
 * 
 * The track order component searches for a named order in the Oracle Mobile storage, which 
 * is used as a persistence store in the sample. When an order is found, it checks the order 
 * status and displays a delete order option or not. 
 *  
 * 
 * @author Frank Nimphius, 2018
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
        "supportedActions": ["OrderIdNotFound", "OrderCancelled", "HumanAgentRequest", "Error"]
    }),

    invoke: (conversation, done) => {

        //read properties from user input
        const orderId = conversation.properties().orderId;
        conversation.logger().fine('advt.24hrs.flowers.orders.TrackOrder: Order Id to Query ' + orderId);
        const locale = conversation.properties().locale == "de" ? "de" : conversation.properties().locale == "fr" ? "fr" : "en";
        conversation.logger().fine('advt.24hrs.flowers.orders.TrackOrder: Locale is "' + locale + '"');

        //get mobile SDK to access Mobile Cloud
        const mobileSdk = conversation.oracleMobile;
        conversation.logger().fine('advt.24hrs.flowers.orders.TrackOrder: Oracle Mobile SDK found? ' + mobileSdk ? "true" : "false");

        //storage collection object read access help:
        // see: https://docs.oracle.com/en/cloud/paas/mobile-autonomous-cloud/develop/calling-apis-custom-code.html#GUID-E1F65C15-F172-48D7-B635-F3F5922AA982

        //storage collection delete object help:
        // see: https://docs.oracle.com/en/cloud/paas/mobile-autonomous-cloud/develop/calling-apis-custom-code.html#GUID-819E1BB3-35FB-441D-8A77-172AFEBD2EC8


        done();
    }
};