"use strict";
/**
 * Oracle Intelligent Bots Advanced Training
 * 
 * Custom Components that uses the Conversation Message Model to render a card menu with
 * flowers or flower bouquets. The goal of this training is to give attendees practical 
 * experience with the underlying message model. 
 * 
 * properties:
 *  imageHostUrl: https://hostname/port of the server that hosts the node application that 
 *                servers the flower images for this demo. If you are attending an in-class
 *                training then this is a ACCS instance
 * 
 *   menuType:      What type of menu to display. Allowed values are 'flowers' and 'bouquets'
 *
 *   display:       true / false whether component should not display
 * 
 *   variable:      the name of the variable to update with the selected flower or bouquet
 *  
 * 
 * @author Frank Nimphius, 2018
 */

// the names of the flowers are saved in a local JS file
const menuitems = require('../data/FlowerService');
module.exports = {

    metadata: () => ({
        "name": "advt.24hrs.flowers.cmm.ShowCardMenu",
        "properties": {
            "imageHostUrl": {
                "type": "string",
                "required": true
            },
            "prompt": {
                "type": "string",
                "required": true
            },
            "variable": {
                "type": "string",
                "required": true
            },
            "menuType": {
                "type": "string",
                "required": true
            },
            "display": {
                "type": "boolean",
                "required": false
            }

        },
        "supportedActions": []
    }),

    invoke: (conversation, done) => {
        const imageHostUrl = conversation.properties().imageHostUrl;
        conversation.logger().info('advt.24hrs.flowers.cmm.ShowCardMenu: image host is ' + imageHostUrl); 
        const menuType = conversation.properties().menuType.toLowerCase() == "flowers" ? "flowers" : "bouquets";
        conversation.logger().info('advt.24hrs.flowers.cmm.ShowCardMenu: menu type is ' + menuType);
        const variable = conversation.properties().execute ? conversation.properties().variable : true;
        conversation.logger().info('advt.24hrs.flowers.cmm.ShowCardMenu: variable name is ' + variable);
        const display = conversation.properties().display ? conversation.properties().display : true;
        conversation.logger().info('advt.24hrs.flowers.cmm.ShowCardMenu: component execute set to ' + execute);
        const prompt = conversation.properties().prompt;
        conversation.logger().info('advt.24hrs.flowers.cmm.ShowCardMenu: component execute set to ' + execute);

        

        conversation.transition();
        done();
    }
};