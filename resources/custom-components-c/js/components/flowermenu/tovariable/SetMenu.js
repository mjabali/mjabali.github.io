"use strict";
/**
 * Oracle Intelligent Bots Advanced Training
 * 
 * Custom Components that updates a variable with an array object. The variable is
 * then used with the CR component to display a menu
 * 
 * Goal is to show how to populate a variable with an array object content queried 
 * from a remote service. Note that the remote service call is simulated by a call 
 * to a local file containing the flower menu
 * 
 * @author Frank Nimphius, 2018
 */
const menuItems = require('../data/FlowerService');

module.exports = {

    metadata: () => ({
        "name": "advt.24hrs.flowers.menuvariable.SetMenuVariable",
        "properties": {
            "menuVariable": {
                "type": "string",
                "required": true
            },
            "menuType": {
                "type": "string",
                "required": true
            },
            "execute": {
                "type": "boolean",
                "required": false
            }
        },
        "supportedActions": []
    }),

    invoke: (conversation, done) => {

        const menuVariable = conversation.properties().menuVariable;
        //leaving no room for mistakes. Either its the flowers or the bouquets menu (default)
        const menuType = conversation.properties().menuType.toLowerCase() == "flowers" ? "flowers" : "bouquets";
        conversation.logger().info('advt.24hrs.flowers.menuvariable.SetMenu: Menu variable name is ' + menuVariable);

        const execute = conversation.properties().execute ? conversation.properties().execute : true;
        conversation.logger().info('advt.24hrs.flowers.menuvariable.SetMenu: component execute set to ' + execute);

        if (execute) {
            //read menu from FlowerService.js
            var menuArray = menuItems[menuType]();
            //copy menu data to context variable     
            conversation.variable(menuVariable, menuArray);
        }
        
        //transition with no user input required
        conversation.keepTurn(true);

        conversation.transition();
        done();
    }
};