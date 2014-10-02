 var request = require('request');
 var url = require("url");
 var Parser = {};

Parser.audio = function (req, res, next) {
    res.writeHead(302, {
        'Location': 'http://guard.cloudapp.net/audio/alarm_nood_hekje.wav'
    });
    res.end();
    return res;
}

Parser.question = function(req, res, next) {
    var audioUrl = req.protocol + '://' + req.get('host') + req.originalUrl.replace('question', 'audio.wav');
    res.status(200).send('{\"preferred_language\":\"nl\",\"question_id\":\"0550eeca-b6f7-4d3f-bbfd-35e44666a74c\",\"question_text\":\" ' + audioUrl + '\",\"type\":\"closed\",\"answers\":[{\"answer_id\":\"68125866-fe73-4e23-b5d9-2b10111c2b6a\",\"answer_text\":\"dtmfKey://1\",\"callback\":\"http://guard.cloudapp.net/askfast/callserver?sequenceNumber=null&user_id=x31642244517_0&answer_id=1\"},{\"answer_id\":\"29df32e5-a54c-41f8-8b4f-2ae0918c6a34\",\"answer_text\":\"dtmfKey://#\",\"callback\":\"http://guard.cloudapp.net/askfast/callserver?sequenceNumber=null&user_id=x31642244517_0&answer_id=hekje\"}],\"event_callbacks\":[{\"event\":\"answered\",\"callback\":\"http://guard.cloudapp.net/askfast/callserver?event=answered&user_id=x31642244517_0&sequenceNumber=null\"},{\"event\":\"cancelled\",\"callback\":\"http://guard.cloudapp.net/askfast/callserver?event=cancelled&user_id=x31642244517_0&sequenceNumber=null\"},{\"event\":\"delivered\",\"callback\":\"http://guard.cloudapp.net/askfast/callserver?event=delivered&user_id=x31642244517_0&sequenceNumber=null\"},{\"event\":\"exception\",\"callback\":\"http://guard.cloudapp.net/askfast/callserver?event=exception&user_id=x31642244517_0&sequenceNumber=null\"},{\"event\":\"hangup\",\"callback\":\"http://guard.cloudapp.net/askfast/callserver?event=hangup&user_id=x31642244517_0&sequenceNumber=null\"},{\"event\":\"read\",\"callback\":\"http://guard.cloudapp.net/askfast/callserver?event=read&user_id=x31642244517_0&sequenceNumber=null\"}],\"media_properties\":[{\"medium\":\"BROADSOFT\",\"properties\":{\"RETRY_LIMIT\":\"4\",\"TIMEOUT\":\"3s\"}}]}');
}
module.exports = Parser;