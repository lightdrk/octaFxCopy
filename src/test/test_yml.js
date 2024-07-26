const fs = require('fs');
const yaml = require('js-yaml');

let config;
try{
	console.log('Loading configuration file .....');
	config = fs.readFileSync('./Cfg.yaml', 'utf8');
}catch (err){
	if (err.code === 'ENONT'){
		console.error('****config file not found****\nsuggestion: reinstall the app');
	}else {
		console.log(err);
	}
}

let data_yaml;

try {
	data_yaml = yaml.load(config);
	console.log(data_yaml.telegram);
}catch (err){
	console.log('****error parsing config file****');
	console.error(err);
}
