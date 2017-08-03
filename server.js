
var http = require('http');
var fs = require('fs');
var path = require('path')
var winston = require('winston');
var jsonFile = require('json-file');
var fs = require('fs');
var Store = require("jfs");
const cassandra = require('cassandra-driver');

const assert = require('assert');
var db = new Store('data',{type:'single'});
const Uuid = require('cassandra-driver').types.Uuid;
const async = require('async');




// grab the data from database
const uid = Uuid.random();
var d = new Date();
//connection to database
var PlainTextAuthProvider = cassandra.auth.PlainTextAuthProvider;

const client = new cassandra.Client({ contactPoints: ['127.0.0.1'],authProvider: new PlainTextAuthProvider('cassandra', 'cassandra')});

// Loading the index file . html displayed to the client
var server = http.createServer(function(req, res) {
        res.writeHead(200);  
})
// Loading socket.io
var io = require('socket.io').listen(server);
var filename = path.join(__dirname, 'created-logfile.log');

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
var server2 = {};
var server3 = {};
	var sb_server2 = {}
	var emiter = {}

// When a client connects, we note it in the console
io.sockets.on('connection', function (socket) {

  //  console.log('A client is connected!');
   socket.on('client2-server',function(data){
    	if(data !== null){
    		var object = data
    		console.log(object)
							client.connect()
							  .then(function () {
							   return client.execute('SELECT * FROM kilervideo.jsonfile');
							  })
							   .then(function (result) {
							    const row = result.rows[0];
							    console.log(row.nameid)
							    console.log(row.userid)
							  //  console.log('Obtained row: ', row);
							    if(object.userid == row.userid && object.nameid == row.nameid){

							    const query = 'INSERT INTO kilervideo.logfile (id, port ,receive,level,msg,time) VALUES (?, ?, ?, ? ,?, ?)';
								const params = [uid, 'from port 8082', 'from 8080','info',['Access','Granted'],new Date().getTime()];
								 emiter = {name:row.nameid,user:row.userid}
								console.log(emiter)

								client.execute(query, params, { prepare: true }, function (err) {
								  assert.ifError(err);
								  //Inserted in the cluster
								});

					    	   logger.log('info','I will emit the data to client 3');
						    	 //server2 = {userId:obj.userId,nameId:obj.nameId}	
							    }else{
							    	 	//console.log(object.userId + object.nameid + row.userId + row.nameid)
							    	sb_server2 = {message:"Error data is not Equal"}
						 	         socket.emit('duplicated-data',sb_server2)
						 	    	 logger.log('error','Data is no Equel')

							    }
							    console.log('Shutting down');
							  })
							    .catch(function (err) {
							    console.error('There was an error when connecting', err);
							  });

					 	 
					 	}
   		
   })
   socket.emit('new-data',emiter)

    socket.on('client3-toserver',function(data){
    	    server3 = data;
    	    console.log(data)
    })
    socket.emit('granted-data',server3)


})
server.listen(8080,function(){
	console.log('port is listening om 8080')
})