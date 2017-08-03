/*var net = require('net'),
    JsonSocket = require('json-socket');

var port = 9012; //The same port that the server is listening on
var host = '127.0.0.1';
var socket = new JsonSocket(new net.Socket()); //Decorate a standard net.Socket with JsonSocket
socket.connect(port, host);
socket.on('connect', function() { //Don't send until we're connected
    socket.sendMessage({a: 2, b: 1});
    socket.on('message', function(message) {
        console.log('The result is: '+message.result);
    });
});
*/
var http = require('http');
const io = require('socket.io-client');
var path = require('path')
var winston = require('winston')
const cassandra = require('cassandra-driver');

var PlainTextAuthProvider = cassandra.auth.PlainTextAuthProvider;

const client = new cassandra.Client({ contactPoints: ['127.0.0.1'],authProvider: new PlainTextAuthProvider('cassandra', 'cassandra')});

const Uuid = require('cassandra-driver').types.Uuid;
const uuid = Uuid.random();


var filename = path.join(__dirname, 'client.log');


var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
    	colorize: true 
    }),
    new (winston.transports.File)(
    	{ 
    		filename: filename,
    		level: 'debug',
      		json:true
      		 
        })
  ]
});

// Loading the index file . html displayed to the client
var server = http.createServer(function(req, res) {
        res.writeHead(200);  
})
// Loading socket.io
var server2 = {}
var data = {userid:222,nameid:555}
// When a client connects, we note it in the console
var socket = io.connect('http://localhost:8080');

 socket.emit('client2-server',data) 

 socket.on('duplicated-data',function(data){
     logger.log('error', 'Reguest failed , try again', {'msg':data });

 })
 socket.on('granted-data',function(data){
    const query = 'INSERT INTO kilervideo.logfile (id, port ,receive,level,msg,time) VALUES (?, ?, ?, ? ,?, ?)';
    const params = [uuid, '8082', 'from 8080','info',['Access','Granted'],new Date().getTime()];
								 
		client.execute(query, params, { prepare: true }, function (err) {
		  		 //Inserted in the cluster
		  		 console.log(err)
		});
 	     logger.log('info', 'comfirming data from client 3', {'msg':data });

 })
server.listen(8082,function(){
	console.log('port is listening om 8082')
});