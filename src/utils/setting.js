const fs = require('fs');
const path = require('path');

function time(){
	let p = process.cwd();
	p = path.join(p,'setting.cfg');
	let read = fs.readFileSync(p,'utf-8');
	let read_list = read.split("=");
	console.log(read_list);
}

module.exports.time = time;
