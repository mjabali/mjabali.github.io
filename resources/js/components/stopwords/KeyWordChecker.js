"use strict";
/**
 * 
 * Oracle Intelligent Bots Advanced Training
 * 
 * Custom component that compares an input string against a comma separated string of stop words. If a 
 * stop word is contained in the string, transition is performed to "StopWordFound" action. If no stop 
 * word is found, then the component tests against help words to see if the user requested help. If none
 * of the two is found then the "NothingFound" transition is followed
 *
 * @author Frank Nimphius, 2018
 */
module.exports = {

    metadata: () => ({
        "name": "advt.24hrs.flowers.stop.KeyWordChecker",
        "properties": {
            "inputString": {
                "type": "string",
                "required": false
            },
            "commaDelimitedStopWords": {
                "type": "string",
                "required": true
            },
            "commaDelimitedHelpWords": {
                "type": "string",
                "required": true
            }
        },
        "supportedActions": ["StopWordFound", "HelpWordFound", "NothingFound"]
    }),

    invoke: (conversation, done) => {
        conversation.logger().info('advt.24hrs.flowers.stop.KeyWordChecker: invoked');
        //if input string is provided, use it. If not read from user input for components that don't
        //save their state in a context variable
        var inputString = conversation.properties().inputString ? conversation.properties().inputString : conversation.text();
        conversation.logger().fine('advt.24hrs.flowers.stop.KeyWordChecker: input string = ' + inputString);

        const stopWords = conversation.properties().commaDelimitedStopWords;
        
        var stopWordArray = [];
        
        if(stopWords && stopWords.length > 0){
            stopWordArray = stopWords.split(",");
        }

        conversation.logger().fine('advt.24hrs.flowers.stop.KeyWordChecker: stop words = ' + stopWords);
        
        const helpWords = conversation.properties().commaDelimitedHelpWords;  
        var helpWordArray = [];
        
        if(helpWords && helpWords.length > 0){
            helpWords = helpWords.split(",");
        }
       
        var stopWordFound = false;   
        var helpWordFound = false;        

        //loop over stop words
        for (let index in stopWordArray) {
            //if stop-word found, exit here and set transition
            if (new RegExp("\\b" + stopWordArray[index].trim() + "\\b").test(inputString)) {
                conversation.logger().fine('advt.24hrs.flowers.stop.KeyWordChecker: stop words found = ' + stopWordArray[index]);
                stopWordFound = true;
                break;
            }
        }
        if (stopWordFound == true) {
            conversation.logger().fine('advt.24hrs.flowers.stop.KeyWordChecker: transition = StopWordFound');
            conversation.transition("StopWordFound");
        }         
        else  {
            //find help word            
            for (let index in helpWordArray) {
                //if help-word found, exit here and set transition
                if (new RegExp("\\b" + helpWordArray[index].trim() + "\\b").test(inputString)) {
                    conversation.logger().fine('advt.24hrs.flowers.stop.KeyWordChecker: help words found = ' + helpWordArray[index]);
                    conversation.logger().fine('advt.24hrs.flowers.stop.KeyWordChecker: transition = HelpWordFound');
                    conversation.transition("HelpWordFound");
                    helpWordFound = true;
                    break;
                }
            }
            

        }
        
        if ((helpWordFound == false) && (stopWordFound == false)) {
            conversation.logger().fine('advt.24hrs.flowers.stop.KeyWordChecker: transition = NothingFound');
            conversation.transition("NothingFound");
        }
        //no message to be printed. Just return from component
        done();
    }
};