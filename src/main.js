const os = require('os');
const fs = require('fs');
const yaml = require('js-yaml');
const process = require('process');
const mt5 = require('./utils/mt5');
const puppeteer = require('puppeteer');
const OctaFx  = require('./utils/octaFx');
const { filter } = require('./utils/filter');
const { compare } = require('./utils/compare');
const { sendMessages } = require('./utils/notify');

let old = [];
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
	console.log(data_yaml);
}catch (err){
	console.log('****error parsing config file****');
	console.error(err);
}

try{
	old = fs.readFileSync("cached.json",'utf-8');
	console.log(JSON.parse(old));
	old = JSON.parse(old);
}catch (err){
	console.log(err);
}
(async ()=>{
	const browser = await puppeteer.launch({
		headless: true,
		defaultViewport: null,
		args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized'],
	});
	const octafx = new OctaFx(browser);
	let creation = [];
	await octafx.openPage(data_yaml.website);
	const mt = new mt5();
	let isConnected = mt.connect();
	while (isConnected){
		const [newData, error ]= await octafx.dataRetr(data_yaml.refresh_time);//[{'symbol': 'GBPUSD', 'volume': '0.2', 'image': 'Sell'}]
		if (error === null){
			console.log('newData -->',newData);
			if (old === null || old.length == 0){
				creation = filter(old,newData);
			}else {
				// comparing old and new 
				const remove = compare(old,newData);
				console.log('remove -->',remove);
				for (let ticket of remove){
					console.log(ticket);
					let isClosed = await mt.closeOrder(ticket);
					console.log(`****Closing order ${isClosed} ******`);
					if (isClosed){
						for (let i = 0; i < old.length; i++){
							if (old[i].ticket === ticket.ticket){
								old.splice(i,1);
							}	
						}
						await sendMessages(data_yaml.telegram, `Removed ${JSON.stringify(isClosed)}`);
					}else{
						await sendMessages(data_yaml.telegram, `Unable to Remove ${JSON.stringify(remove)}`);
					}
				}
				creation = filter(old,newData); 
			}

			//opening position
			for (let index=0; index < creation.length; index++){
				console.log('open postiion -->',creation[index]);
				let isOpen = await mt.openOrder(creation[index]);
				creation[index]["ticket"] = isOpen["ORDER"]; 
				if (isOpen){
					await sendMessages(data_yaml.telegram, `Position opened ${JSON.stringify(isOpen)}`);
				}else {
					await sendMessages(data_yaml.telegram, `Unable to open position ${JSON.stringify(create)}`);
				}
				old.push(creation[index]);
			}
			console.log('Updating cache ....', old);
			fs.writeFileSync("cached.json",JSON.stringify(old),"utf-8");
		}else if (error){
			await sendMessages(data_yaml.telegram,`Blocked waiting for 5 mins to re-run`)
			await new Promise(resolve => setTimeout(resolve,300000));
		}		
	}
})();
