"use strict";
/**
 * 
 * Oracle Intelligent Bots Advanced Training
 * 
 * Custom component that compares an input string against a comma separated string of stop words. If a 
 * stop word is contained in the string, transition is performed to "StopWordFound" action. Otherwise
 * its to "StopWordNotFound"
 *
 * @author Frank Nimphius, 2018
 */
module.exports = {

    metadata: () => ({
        "name": "advt.24hrs.flowers.stop.StopWordChecker",
        "properties": {
            "inputString": {
                "type": "string",
                "required": false
            },
            "commaDelimitedStopWords": {
                "type": "string",
                "required": true
            }
        },
        "supportedActions": ["StopWordFound", "StopWordNotFound"]
    }),

    invoke: (conversation, done) => {
        conversation.logger().info('advt.24hrs.flowers.CheckForStopWord: invoked');
        //if input string is provided, use it. If not read from user input for components that don't
        //save their state in a context variable
        var inputString = conversation.properties().inputString? conversation.properties().inputString : conversation.text();
        conversation.logger().fine('advt.24hrs.flowers.CheckForStopWord: input string = ' + inputString);

        const stopWords = conversation.properties().commaDelimitedStopWords;
        conversation.logger().fine('advt.24hrs.flowers.CheckForStopWord: stop words = ' + stopWords);

        var stopWordArray = stopWords.split(",");

        var stopWordFound = false;
        //loop over stop words
        for (var index in stopWordArray) {
            //if stop-word found, exit here and set transition
            if (new RegExp("\\b" + stopWordArray[index].trim() + "\\b").test(inputString)) {
                conversation.logger().fine('advt.24hrs.flowers.CheckForStopWord: stop words found = ' + stopWordArray[index]);
                stopWordFound = true;
                break;
            }
        }
        if (stopWordFound) {
            conversation.logger().fine('advt.24hrs.flowers.CheckForStopWord: transition = StopWordFound');
            conversation.transition("StopWordFound");
        } else {
            conversation.logger().fine('advt.24hrs.flowers.CheckForStopWord: transition = StopWordNotFound');
            conversation.transition("StopWordNotFound");
        }
        //no message to be printed. Just return from component
        done();
    }
};