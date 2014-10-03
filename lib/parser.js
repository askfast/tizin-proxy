 var request = require('request'),
 mongoClient = require('mongodb').MongoClient,
 http = require("http"),
 request = require("request"),
 Parser = {},
 dbName = "proxy",
 collection,
 remoteHostNameCheckOn = '127.0.0.1';

 mongoClient.connect("mongodb://localhost:27017/"+dbName, function(err, database) {
    if(err) return console.dir(err);
    collection = database.collection("tizin");
 });

Parser.audio = function (req, res, next) {
    console.log('Audio fetch request seen from: '+ req.connection.remoteAddress);

    if(remoteHostNameCheckOn == req.connection.remoteAddress) {
	    //update the latest db entry
	    collection.find().count(function (e, count) {
	        collection.update (
	            {id: count}, // query
	            {$set: {audioFetchTimestamp: new Date()}},
	            function(err, object) {
	                if (err){
	                    console.warn(err.message);
	                } else {
	                    console.dir(object);
	                }
	        });
	    });
	}
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
	console.log('Question request from: '+ req.connection.remoteAddress);
    if(requester && responder && remoteHostNameCheckOn == req.connection.remoteAddress) {
        console.log('Requester: ' + requester + ' and Responder: '+ responder +'found! ');
        //put the timestamp in the db
        collection.find().count(function (e, count) {
            var document = { questionFetchTimestamp: new Date(), id: count + 1, audioFetchTimestamp: null};
            console.log('Adding new document: ' + document);
            collection.insert(document, {w: 1}, function(err, records){
                console.log("Record added as "+records[0]._id);
            });
        });
    }     
    var audioUrl = req.protocol + '://' + req.get('host') + '/tizin/audio.wav';
    var hangupUrl = req.protocol + '://' + req.get('host') + '/tizin/question/hangup';
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send('{\"preferred_language\":\"nl\",\"question_id\":\"0550eeca-b6f7-4d3f-bbfd-35e44666a74c\",\"question_text\":\"' + audioUrl + '\",\"type\":\"closed\",\"answers\":[{\"answer_id\":\"68125866-fe73-4e23-b5d9-2b10111c2b6a\",\"answer_text\":\"dtmfKey://1\",\"callback\":\"http://guard.cloudapp.net/askfast/callserver?sequenceNumber=null&user_id=x31642244517_0&answer_id=1\"},{\"answer_id\":\"29df32e5-a54c-41f8-8b4f-2ae0918c6a34\",\"answer_text\":\"dtmfKey://#\",\"callback\":\"http://guard.cloudapp.net/askfast/callserver?sequenceNumber=null&user_id=x31642244517_0&answer_id=hekje\"}],\"event_callbacks\":[{\"event\":\"answered\",\"callback\":\"http://guard.cloudapp.net/askfast/callserver?event=answered&user_id=x31642244517_0&sequenceNumber=null\"},{\"event\":\"cancelled\",\"callback\":\"http://guard.cloudapp.net/askfast/callserver?event=cancelled&user_id=x31642244517_0&sequenceNumber=null\"},{\"event\":\"delivered\",\"callback\":\"http://guard.cloudapp.net/askfast/callserver?event=delivered&user_id=x31642244517_0&sequenceNumber=null\"},{\"event\":\"exception\",\"callback\":\"http://guard.cloudapp.net/askfast/callserver?event=exception&user_id=x31642244517_0&sequenceNumber=null\"},{\"event\":\"hangup\",\"callback\":\"' + hangupUrl +'\"},{\"event\":\"read\",\"callback\":\"http://guard.cloudapp.net/askfast/callserver?event=read&user_id=x31642244517_0&sequenceNumber=null\"}],\"media_properties\":[{\"medium\":\"BROADSOFT\",\"properties\":{\"RETRY_LIMIT\":\"4\",\"TIMEOUT\":\"3s\"}}]}'); 
    res.end();
    return res;
}

Parser.hangup = function(req, res, next) {  
    req.addListener('data', function(payload){
        console.log('Payload seen: '+ payload + '\nfrom: '+ req.connection.remoteAddress);
        var jsonPayload = JSON.parse(payload);
        //check if its a hangup request
        if(jsonPayload['event'] == "hangup" && remoteHostNameCheckOn == req.connection.remoteAddress) {
            if(jsonPayload['extras'] && jsonPayload['extras']['answerTime'] && jsonPayload['extras']['releaseTime']) {
                var duration = Number(jsonPayload['extras']['releaseTime']) - Number(jsonPayload['extras']['answerTime']);
                if(duration > 1000) {
                	collection.find().count(function (e, count) {
                    	collection.findOne({'id': count}, function(err, document) {
                    		if(!document.audioFetchTimestamp || !document.audioFetchTimestamp.getTime()) {
                    			console.log("======No audio fetched for id: "+ document.id + "=============");
                    		}
                    	});
                    });
                }
            }
        }
		request.post('http://guard.cloudapp.net/askfast/callserver?event=hangup&user_id=x31642244517_0&sequenceNumber=null', 
			{data: payload},function(err, response, body) {
		}).pipe(res);
    });
}

module.exports = Parser;
