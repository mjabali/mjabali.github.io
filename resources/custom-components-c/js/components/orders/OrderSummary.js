"use strict";
/**
 * Oracle Intelligent Bots Advanced Training
 * 
 * Custom component prints order confirmation messages in English, French and German. The 
 * component prints 3 buttons at the end of the confirmation for the user to confirm, to
 * request edit or to cancel the order. 
 * 
 * The component returns one for the following action strings when a button is pressed 
 * 
 * SubmitOrder
 * CancelOrder
 * EditOrder"
 * 
 * In addition, this component us used for a hands-on. Attendees are requested to print 
 * summary messages with a human think-time delay.
 * 
 * 
 * @author Frank Nimphius, 2018
 */
module.exports = {

    metadata: () => ({
        "name": "advt.24hrs.flowers.orders.OrderSummary",
        "properties": {
            "orderId": {
                "locale": "string",
                "required": true
            },
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
                "type": "int",
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
            },
            "locale": {
                "type": "string",
                "required": false
            },

        },
        "supportedActions": ["SubmitOrder, CancelOrder, EditOrder"]
    }),

    invoke: (conversation, done) => {



        //the hands-on bot supports German, English and French. Any other locale will be treated as English
        const locale = conversation.properties().locale == "de" ? "de" : conversation.properties().locale == "fr" ? "fr" : "en";
        conversation.logger().fine('advt.24hrs.flowers.orders.Summary: locale detected as: ' + locale);

        const orderId = conversation.properties().orderId;
        conversation.logger().fine('advt.24hrs.flowers.orders.Summary: Processing Order ID' + orderId);

        const productName = conversation.properties().productName;
        const pricePerUnit = conversation.properties().pricePerUnit;
        const orderQuantity = conversation.properties().orderQuantity;
        const paymentDetails = conversation.properties().paymentDetails;
        const deliveryType = conversation.properties().deliveryType;
        const deliveryCost = conversation.properties().deliveryCost;
        const recipientName = conversation.properties().recipientName;
        const recipientAddress = conversation.properties().recipientAddress;
        const recipientMobile = conversation.properties().recipientMobile;

        //discountIn Percent is meant to be provided as 0.x. If it is provided as 50, then we turn it into 0.5
        const discountPercent = conversation.properties().discountPercent ? conversation.properties().discountPercent > 1 ?conversation.properties().discountPercent / 100 : conversation.properties().discountPercent : 0;
        const cardSenderName = conversation.properties().cardSenderName ? conversation.properties().cardSenderName : null;
        const cardMessage = conversation.properties().cardMessage ? conversation.properties().cardMessage : null;

        //when you get here then chances are its a text input or a postback. The postback is what
        //we need to evaluate first to ensure we don't display the summary twice.

        if (conversation.postback()) {
            conversation.logger().info('advt.24hrs.flowers.orders.Summary: Postback Message Found');
            //read post back message
            let obj = conversation.postback();
            let action = obj.orderAction;

            if (action == "confirm") {
                conversation.logger().info('advt.24hrs.flowers.orders.Summary: Order #' + orderId + ' was confirmed');
                //send transition action 
                conversation.transition("SubmitOrder");
            } else if (action == "edit") {
                conversation.logger().info('advt.24hrs.flowers.orders.Summary: Order #' + orderId + ' should be edited');
                conversation.transition("EditOrder");
            } else if (action == "cancel") {
                conversation.logger().info('advt.24hrs.flowers.orders.Summary: Order #' + orderId + ' was cancelled');
                conversation.transition("CancelOrder");
            } else {
                //ignore
                conversation.logger().info('advt.24hrs.flowers.orders.Summary: Unexpected postback action: ' + action + " found. Ignored.");
            }
            //move on            
            done();
        }

        conversation.logger().fine('advt.24hrs.flowers.orders.Summary: Building localized responses');

        var firstName = conversation.variable("profile.firstName") ? conversation.variable("profile.firstName") : null;

        var responses = null;

        //a poor man's implementation of resource handling to localize custom components messages. For a better approach see:
        //https://blogs.oracle.com/mobile/techexchange%3a-a-simple-guide-and-solution-to-using-resource-bundles-in-custom-components        
        if (locale == "de") {
            conversation.logger().fine('advt.24hrs.flowers.orders.Summary: Printing German responses');
            responses = [
                (firstName ? (" Hallo " + firstName +"."): "") + " Danke, daß Du Blumen mit 24hrsflowers verschickst. Laß mich Deine Bestellung #" + orderId + " noch mal zusammenfassen.",
                "In Kürze wird 24hrsflowers " + (orderQuantity > 1 ? (orderQuantity + " Einheiten") : (orderQuantity + " Einheit")) + " von " + productName + " an " + recipientName + "," + recipientAddress + " senden",
                "Die Handy Nummer des Empfängers ist " + recipientMobile,
                "Die Kosten von " + ((orderQuantity * pricePerUnit) - (orderQuantity * pricePerUnit * discountPercent)) + "$ + " + deliveryCost + "$ für " + deliveryType + " Versand werden nach Auftragsbestätigung der angegebenen Kreditkarte belastet.",
                "Informationen zur Zahlung: " + paymentDetails,
                (cardSenderName || cardMessage) ? "Deine Blumen werden mit Grußkarte ausgeliefert" : "Deine Blumen werden ohne Grußkarte zugestellt",
                cardSenderName ? "Absender: " + cardSenderName : null,
                cardMessage ? "Nachricht: " + cardMessage : null
            ];
        } else if (locale == "fr") {
            conversation.logger().fine('advt.24hrs.flowers.orders.Summary: Printing French responses');
            responses = [
                (firstName ? " Hey " + firstName + ". " : "") + "Merci d'envoyer des fleurs avec 24hrsflowrs. Laissez-moi résumer votre commande #" + orderId + " à nouveau",
                "Bientôt, 24hrsflowers seront " + (orderQuantity > 1 ? (orderQuantity + " unités") : (orderQuantity + "")) + " de " + productName + " à " + recipientName + "," + recipientAddress,
                "Le numéro de mobile du destinataire est " + recipientMobile,
                "Les coûts " + ((orderQuantity * pricePerUnit) - (orderQuantity * pricePerUnit * discountPercent)) + "$ + " + deliveryCost + "$ de " + deliveryType + " seront facturés à la carte de crédit donnée",
                "Détails de paiement: " + paymentDetails,
                (cardSenderName || cardMessage) ? "Les fleurs seront livrées avec une carte de vœux" : "Les fleurs seront sans carte de vœux délivrée",
                cardSenderName ? "Expéditeur: " + cardSenderName : null,
                cardMessage ? "Message d'accueil: " + cardMessage : null
            ];
        } else {
            conversation.logger().fine('advt.24hrs.flowers.orders.Summary: Printing English responses');
            responses = [
                (firstName ? " Hey " + firstName + ". " : "") + "Thanks for sending flowers with 24hrsflowers. Let me quickly summarize your order #" + orderId,
                "Shortly, 24hrsflowers will deliver " + (orderQuantity > 1 ? (orderQuantity + " items") : (orderQuantity + " item")) + " of " + productName + " to " + recipientName + "," + recipientAddress,
                "Recipient mobile is " + recipientMobile,
                "The cost of " + ((orderQuantity * pricePerUnit) - (orderQuantity * pricePerUnit * discountPercent)) + "$ + " + deliveryCost + "$ for " + deliveryType + " shipment will be charged to your credit card",
                "Payment details: " + paymentDetails,
                (cardSenderName || cardMessage) ? "Your flowers are delivered with a greeting card" : "Your flowers are delivered with no greeting card",
                cardSenderName ? "Sender: " + cardSenderName : null,
                cardMessage ? "Message: " + cardMessage : null
            ];
        }

        //Iterate over responses and print all elements that are NOT null
        conversation.logger().fine('advt.24hrs.flowers.orders.Summary: Printing responses');

        /********************* */
        /* START HANDS ON AREA */
        /********************* */
        
        for (var indx in responses) {
            //print message if not null
            if (responses[indx] != null) {
                //print straight to output
                conversation.logger().fine('advt.24hrs.flowers.orders.Summary: Printing message: ' + responses[indx]);
                conversation.reply(conversation.MessageModel().textConversationMessage(responses[indx]));
            }
        }
        
        //Last Message Printed for Summary
        conversation.logger().fine('advt.24hrs.flowers.orders.Summary: Ask to confirm, cancel or edit order');

        let confirmLabel = locale == "de" ? "Bestellung bestätigen" : locale == "fr" ? "Confirmer la commande" : "Confirm order";
        var confirmAction = conversation.MessageModel().postbackActionObject(confirmLabel, null, {
            "orderAction": "confirm"
        });
        var editLabel = locale == "de" ? "Bestellung ändern" : locale == "fr" ? "Change l'ordre" : "Change order";
        var editAction = conversation.MessageModel().postbackActionObject(editLabel, null, {
            "orderAction": "edit"
        });
        var cancelLabel = locale == "de" ? "Bestellung abbrechen" : locale == "fr" ? "Annuler la commande" : "Cancel order";
        var cancelAction = conversation.MessageModel().postbackActionObject(cancelLabel, null, {
            "orderAction": "cancel"
        });

        // print last message with options to confirm, edit to cancel the order
        conversation.logger().fine('advt.24hrs.flowers.orders.Summary: printing order confirmation summary');
        let message = locale == "de" ? "Wie möchtest Du fortfahren? " : locale == "fr" ? "Comment veux-tu procéder?" : "How do you want to proceed?";
        let msg = conversation.MessageModel().textConversationMessage(message, [confirmAction, editAction, cancelAction]);
        conversation.reply(msg);
        conversation.keepTurn(false);
        done();
    }
};