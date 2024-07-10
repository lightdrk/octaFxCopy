const os = require('os');
const fs = require('fs');
const path = require('path');
const prompt = require('prompt-sync')();



const username = prompt('Username (onefx): ');
const password = prompt('Password (onefx): ');
const token = prompt('Telegram Token: ');
const group = prompt('Telegram group id: ');

require('dotenv').config();
let contentRun =``
let type = "Run.bat"
let data = null; 
let curr = process.cwd();
if (os.platform() === "linux"){
	contentRun = `#!/bin/bash\ncd "${curr}"\nnode main.js`
	data = `USERNAME=${username}\nPASS=${password}`;
	type = "Run.sh";
}else {
	contentRun = `@echo off\ncd /d "${curr}"\nnode main.js\npause`;
	data = `USER=${username}\nPASS=${password}`;		
}
data = `${data}\nTOKEN=${token}\nGROUP=${group}`
fs.writeFileSync('.env',data,'utf-8');

fs.writeFileSync(path.join(os.homedir(), 'Desktop', type), contentRun,'utf-8');
