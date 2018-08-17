"use strict";
/**
 * Oracle Intelligent Bots Advanced Training
 * 
 * Simple smalltalk handler that reads random responses from a JSON file. The JSON file must have the 
 * same name as the intent. Language support in the advanced training is for English, German and French. 
 * All other languages resolve to English. 
 * 
 * The component allows a confidence threshold to be set. This threshold can be the same as set for the 
 * System.Intent component or different (below or above). If the confidence threshold is not met then the
 * component returns NoIntentFound.
 * 
 * If an intent could be resolved then the component returns "IntentFound" as an action string
 * 
 * @author Frank Nimphius, 2018
 */


module.exports = {

    metadata: () => ({
        "name": "advt.24hrs.flowers.chitchat.SmallTalk",
        "properties": {
            "nlpResultVariable": {
                "type": "string",
                "required": true
            },
            "confidenceThreshold": {
                "type": "int",
                "required": true
            },
            "locale": {
                "type": "string",
                "required": false
            },
        },
        "supportedActions": ['NoIntentFound', 'IntentFound']
    }),

    invoke: (conversation, done) => {
        conversation.logger().fine('advt.24hrs.flowers.SmallTalk: Smalltalk component invoked');
        //confidence threshold should be between 0 and 1 (e.g. 0.7 for 70%). 
        const confidenceThreshold = conversation.properties().confidenceThreshold > 1 ? (conversation.properties().confidenceThreshold / 100) : conversation.properties().confidenceThreshold;
        conversation.logger().fine('advt.24hrs.flowers.SmallTalk: confidenceThreshold value  = ' + confidenceThreshold);

        const nlpresultVariable = conversation.properties().nlpResultVariable;
        conversation.logger().fine('advt.24hrs.flowers.SmallTalk: nlpResultVariable name  = ' + nlpresultVariable);
        //read locale from component input parameter. If mot set, read it from profile setting. If not set either , set to English
        const locale = conversation.properties().locale ? conversation.properties().locale : (conversation.variable('profile.locale') ? conversation.variable('profile.locale') : 'en');
        conversation.logger().fine('advt.24hrs.flowers.SmallTalk: locale = ' + locale);

        //this solution supports two letter language abbreviations as per ISO 639-1 codes.
        //for the hands-on we do support English, German and French translations
        const supportedLanguages = ['de', 'fr', 'en'];
        //if a supported language is set, use it. If not, fall back to English
        var language = supportedLanguages.includes(locale) ? locale : 'en';
        conversation.logger().fine('advt.24hrs.flowers.SmallTalk: language to provide response in = ' + language);

        //find intent with the highest score but above confidence threshold
        var nlpResultObject = conversation.nlpResult(nlpresultVariable);
        var topIntent = nlpResultObject.topIntentMatch();

        if (topIntent.hasOwnProperty('intent') && topIntent.score < confidenceThreshold) {
            //top intent is below confidenceThreshold. Return no intent found
            conversation.transition('NoIntentFound');            
        } else if (topIntent.hasOwnProperty('intent')) {
            //there is an intent found and the intent's score is above or equal confidence threshold.
            let intentName = topIntent.intent;

            conversation.logger().fine('advt.24hrs.flowers.SmallTalk: print smalltalk for  = ' + intentName + ', ' + language);
            let actionString = smalltalk(intentName, language, conversation);
            conversation.logger().fine('advt.24hrs.flowers.SmallTalk: action string for resolved intent is, ' + actionString);
            conversation.transition(actionString);
            conversation.keepTurn(false);            
        } else {
            //there is no top-intent, which means the intent actually was unresolved
            //there is nothing we can do here other than indicating to the bot designer
            //that there was no intent to work with
            conversation.logger().fine('advt.24hrs.flowers.SmallTalk: print smalltalk for  = unresolved, ' + language);
            conversation.transition('NoIntentFound');            
        }

        //var intent_responses = require("./responses/<name>.json");
        //if(intent_responses.hasOwnProperty('<name>')){
        //    //define here
        //}
        done();
    }
};

function smalltalk(file, language, conversation) {
    conversation.logger().fine('advt.24hrs.flowers.SmallTalk: smalltalk(' + file + ',' + language + ')');
    //load JSON file that matches the intent or unknown
    var smallTalk = require("./responses/" + file + ".json");
    //get array of responses
    if (smallTalk) {
        var responses = smallTalk.responses[language];
        conversation.logger().fine('advt.24hrs.flowers.SmallTalk: response array:'+JSON.stringify(responses));
        //get number of responses 
        var arrayLength = responses.length;
        conversation.logger().fine('advt.24hrs.flowers.SmallTalk: number of possible responses  = ' + arrayLength);

        //generate random index for response
        var responseindx = Math.floor((Math.random() * (arrayLength - 1)));
        conversation.logger().fine('advt.24hrs.flowers.SmallTalk: response index  = ' + responseindx);
        //get response to display
        var response = responses[responseindx];
        conversation.logger().fine('advt.24hrs.flowers.SmallTalk: response:'+JSON.stringify(response));
        //response is an array of sentences. Each sentence will be printed in its own bubble    
        for (var _reply in response) {
            //use CMM for reply
            conversation.reply(conversation.MessageModel().textConversationMessage(response[_reply]));
        }
        return "IntentFound"
    }
    else{
        conversation.logger().fine('advt.24hrs.flowers.SmallTalk: no file found for intent with name '+file);
        conversation.variable('_24hrsErrorMessage','no file found for intent with name: '+file); 
        return "NoIntentFound"
    }
    
};