"use strict";
/**
 * Oracle Intelligent Bots Advanced Training
 * 
 * Custom Components used for testing debugging 
 * 
 * @author Frank Nimphius, 2018
 */
module.exports = {

        metadata: () => (
        {
            "name": "advt.24hrs.flowers.debug.HelloTester",
            "properties": {                
                "name": { "type": "string", "required": true }                       
            },
            "supportedActions": []
        }
    ),

    invoke: (conversation, done) => {
        //check for text or postback message
        if(conversation.postback()){
            conversation.logger().info('advt.24hrs.flowers.debug.HelloTester: Postback Message Found');
            //read post back message
            let obj = conversation.postback();
            
            let response = obj.feedback;
            
            let reply = "";
            
            if(response == "like"){
                reply = conversation.MessageModel().textConversationMessage("Great.I like you too.");
                conversation.logger().info('advt.24hrs.flowers.debug.HelloTester: Return Like');
            }
            else if(response == "dislike"){
                reply= conversation.MessageModel().textConversationMessage("No way. Well, I hate you too.");
                conversation.logger().info('advt.24hrs.flowers.debug.HelloTester: Return Dislike');
            }
            else {
                reply = conversation.MessageModel().textConversationMessage("Hmm. How did you get here?");
                conversation.logger().info('advt.24hrs.flowers.debug.HelloTester: Unknown Payload !?');
            }
            //move on
            conversation.reply(reply);
            conversation.transition();
            done();
        }

        const name = conversation.properties().name? conversation.properties().name :'anonymous';
        conversation.logger().info('advt.24hrs.flowers.debug.HelloTester: Composing Hello Message');
        var like = conversation.MessageModel().postbackActionObject("Like You", null, {"feedback":"like"});
        var dislike = conversation.MessageModel().postbackActionObject("Hate You", null, {"feedback":"dislike"});
        
        //print greeting message with button action 
        conversation.logger().info('advt.24hrs.flowers.debug.HelloTester: Sending Hello Message for '+name);
        let msg = conversation.MessageModel().textConversationMessage("Hey, "+name+", how do you like me?",[like,dislike]);
        conversation.reply(msg);
        //don't move but hand turn back to user
        conversation.keepTurn(false);    
        done();
    }
};
