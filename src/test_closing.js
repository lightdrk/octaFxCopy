const process = require('process');

process.on('exit', () =>{ console.log('closing ...')});
while(true){
	console.log('aaaa');
}

