const fs = require('fs');
const prompt = require('prompt-sync')();

const username = prompt('Username (onefx): ');
const password = prompt('Password (onefx): ');

require('dotenv').config();
if (process.USER && process.PASS){
	console.log('updated');
}else {
	let data =  `USER=${username}\nPASS=${password}`;
	fs.writeFileSync('.env',data,'utf-8');
}
