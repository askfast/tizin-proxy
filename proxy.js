var express = require('express'),
    Parser = require('./lib/parser.js');

var PORT = 2000;

var app = express();
var router = express.Router();

router.get('/audio.wav', Parser.audio);
router.get('/question', Parser.question);
router.post('/question/hangup', Parser.hangup);
app.use('/tizin', router);

app.listen(PORT);
console.log("Tizin proxy running on port: "+PORT);