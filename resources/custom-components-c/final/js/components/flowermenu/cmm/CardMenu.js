"use strict";
/**
 * Oracle Intelligent Bots Advanced Training
 * 
 * Custom Components that uses the Conversation Message Model to render a card menu with
 * flowers or flower bouquets. The goal of this training is to give attendees practical 
 * experience with the underlying message model. 
 * 
 * properties:
 *  prompt: The component display prompt
 *  
 *  imageHostUrl: https://hostname/port of the server that hosts the node application that 
 *                servers the flower images for this demo. If you are attending an in-class
 *                training then this is a ACCS instance
 * 
 *   menuType:      What type of menu to display. Allowed values are 'flowers' and 'bouquets'
 *
 *   selectedPriceVariable: the name of the variable that holds the price of the selected product
 * 
 *   selectedProductVariable:  the name of the variable to update with the selected flower or bouquet name
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
            "selectedProductVariable": {
                "type": "string",
                "required": true
            },
            "selectedPriceVariable": {
                "type": "int",
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
        "supportedActions": ["transitionNext"]
    }),

    invoke: (conversation, done) => {

        const imageHostUrl = conversation.properties().imageHostUrl;
        const menuType = conversation.properties().menuType.toLowerCase() == "flowers" ? "flowers" : "bouquets";
        const selectedProductVariable = conversation.properties().selectedProductVariable;
        const selectedPriceVariable = conversation.properties().selectedPriceVariable;
        const display = conversation.properties().display ? conversation.properties().display : "true";
        const prompt = conversation.properties().prompt;


        const stateTokenSecret = "___24hrsflowersmenustatetracker___";

        /* HANDS-ON START HERE */

         if (conversation.postback() && conversation.postback().stateToken == stateTokenSecret) {
            let postbackpayload = conversation.postback();
            conversation.variable([selectedProductVariable], postbackpayload[selectedProductVariable]);
            conversation.variable([selectedPriceVariable], postbackpayload[selectedPriceVariable]);
            conversation.keepTurn(true);
            conversation.transition();
            done();

        } else {
            conversation.reply(conversation.MessageModel().textConversationMessage(prompt));

            var menuArray = menuitems[menuType]();

            var cards = [];

            for (var indx in menuArray) {
                let button = conversation.MessageModel().postbackActionObject(menuArray[indx].title + " (" 
                    + menuArray[indx].price + "$)", null, {
                    [selectedProductVariable]: menuArray[indx].title,
                    [selectedPriceVariable]: menuArray[indx].price,
                    stateToken: stateTokenSecret
                });

                let cardObj = conversation.MessageModel().cardObject(menuArray[indx].title, menuArray[indx].description, imageHostUrl +
                    menuArray[indx].image, null, [button]);
                cards.push(cardObj);
            }

            var cardResponseMessage = conversation.MessageModel().cardConversationMessage('vertical', cards);
            conversation.reply(cardResponseMessage);
            //conversation.transition();
        }
        done();

    }
};