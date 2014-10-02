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

    //check if there is a reqester and a responder     
    var requester = req.query.requester; 
    var responder = req.query.responder;     

    if(requester && responder ) {
        console.log('Requester: ' + requester + ' and Responder: '+ responder +'found! ');
     }     
    var audioUrl = req.protocol + '://' + req.get('host') + '/tizin/audio.wav';
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send('{\"preferred_language\":\"nl\",\"question_id\":\"0550eeca-b6f7-4d3f-bbfd-35e44666a74c\",\"question_text\":\" ' + audioUrl+ '\",\"type\":\"closed\",\"answers\":[{\"answer_id\":\"68125866-fe73-4e23-b5d 9-2b10111c2b6a\",\"answer_text\":\"dtmfKey://1\",\"callback\":\"http://guard.c loudapp.net/askfast/callserver?sequenceNumber=null&user_id=x31642244517_0&answ er_id=1\"},{\"answer_id\":\"29df32e5-a54c-41f8-8b4f- 2ae0918c6a34\",\"answer_text\":\"dtmfKey://#\",\"callback\":\"http://guard.cloudapp.net/askfast/callserv er?sequenceNumber=null&user_id=x31642244517_0&answer_id=hekje\"}],\"event_call backs\":[{\"event\":\"answered\",\"callback\":\"http://guard.cloudapp.net/askf ast/callserver?event=answered&user_id=x31642244517_0&sequenceNumber=null\"},{\ "event\":\"cancelled\",\"callback\":\"http://guard.cloudapp.net/askfast/calls erver?event=cancelled&user_id=x31642244517_0&sequenceNumber=null\"},{\"event\": \"delivered\",\"callback\":\"http://guard.cloudapp.net/askfast/callserver?even t=delivered&user_id=x31642244517_0&sequenceNumber=null\"},{\"event\":\"excepti on\",\"callback\":\"http://guard.cloudapp.net/askfast/callserver?event=excepti on&user_id=x31642244517_0&sequenceNumber=null\"},{\"event\":\"hangup\",\"callb ack\":\"http://guard.cloudapp.net/askfast/callserver?event=hangup&user_id=x316 42244517_0&sequenceNumber=null\"},{\"event\":\"read\",\"callback\":\"http://gu ard.cloudapp.net/askfast/callserver?event=read&user_id=x31642244517_0&seque nceNumber=null\"}],\"media_properties\":[{\"medium\":\"BROADSOFT\",\"properties\" :{\"RETRY_LIMIT\":\"4\",\"TIMEOUT\":\"3s\"}}]}'); 
}
module.exports = Parser;
