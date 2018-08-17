"use strict";
/**
 * Oracle Intelligent Bots Advanced Training
 *
 *  custom component that saves the state name of the state prior to when the component is called 
 *  to a variable to allow bot designers to help bot designers to route users back to where they 
 *  issued an unexpectedAction or requested exiting the flow
 *  
 *  * @author Frank Nimphius, 2018
 */
module.exports = {

    metadata: () => ({
        "name": "advt.24hrs.flowers.dialogflow.StateTracker",
        "properties": {
            "lastUserStateVariable": {
                "type": "string",
                "required": true
            }           
        },
        "supportedActions": []
    }),

    invoke: (conversation, done) => {

        //read properties from user input
        const lastUserStateVariable = conversation.properties().lastUserStateVariable;
        conversation.logger().fine('advt.24hrs.flowers.dialogflow.StateTracker: variable name ' + lastUserStateVariable);        
        
        //get previous state
        var lastUserState = conversation.request().previousState;

        conversation.logger().fine('advt.24hrs.flowers.dialogflow.StateTracker: last user state ' + lastUserState);

        conversation.variable(lastUserStateVariable, lastUserState);

        conversation.keepTurn(true);
        conversation.transition();
        done();
    }
};