/*var net = require('net'),
    JsonSocket = require('json-socket');

var port = 9011; //The same port that the server is listening on
var host = '127.0.0.1';
var socket = new JsonSocket(new net.Socket()); //Decorate a standard net.Socket with JsonSocket
socket.connect(port, host);
socket.on('connect', function() { //Don't send until we're connected
    socket.sendMessage({a: 5, b: 7});
    socket.on('message', function(message) {
        console.log('The result is: '+message.result);
    });
});
*/
//const io = require('socket.io-client');

//const socket = io('http://localhost:3000');

//console.log(socket.id); // undefined

//socket.on('connect', () => {
 // console.log(socket.data); // 'G5p5...'
//})
var http = require('http');
const io = require('socket.io-client');
var path = require('path')
var winston = require('winston')
const cassandra = require('cassandra-driver');
const Uuid = require('cassandra-driver').types.Uuid;


const uuid = Uuid.random();


const client = new cassandra.Client({ contactPoints: ['127.0.0.1']});


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
      		json:true ,
      		 
        })
  ]
});

// Loading the index file . html displayed to the client
var server = http.createServer(function(req, res) {
        res.writeHead(200);  
})
// Loading socket.io

// When a client connects, we note it in the console
var socket = io.connect('http://localhost:8080');
 socket.on('new-data', function(message) {
 	const query = 'INSERT INTO kilervideo.logfile (id, port ,receive,level,msg,time) VALUES (?, ?, ?, ? ,?, ?)';
    const params = [uuid, 'from port 8080', '8081','info',['Access','Granted'],new Date().getTime()];
								 
		client.execute(query, params, { prepare: true }, function (err) {
		  		 //Inserted in the cluster
		  		 console.log(err)
		});
 	console.log(message)
 	if(message!== null){
        logger.log('info', 'Hello from client2 to server to client3', {'msg':message });
 	  }
    })
 socket.emit('client3-toserver',{userId:444555,nameId:3333})
server.listen(8081,function(){
	console.log('port is listening om 8081')
});