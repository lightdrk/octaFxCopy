const Net = require('net');

const port = 77;
const host = "localhost";

const client = new Net.Socket();
client.connect(port,host, function() {
	client.write('{"MSG":"QUOTE","SYMBOL":"EURUSD"}' + '\r\n');

});

client.on('data', function(chunk){
	console.log('fetching data');
	console.log(`${chunk.toString()}`);
	client.end();
});

client.close();
