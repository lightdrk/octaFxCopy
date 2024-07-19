const os = require('os');
const fs = require('fs');
const process = require('process');
const mt5 = require('./utils/mt5');
const puppeteer = require('puppeteer');
const OctaFx  = require('./utils/octaFx');
const { filter } = require('./utils/filter');
const { compare } = require('./utils/compare');
const { sendMessages } = require('./utils/notify');

//TODO: new data add  to old add tickets too  
let old = null;
try{
	old = fs.readFileSync("cached.json",'utf-8');
	console.log(JSON.parse(old));
	old = JSON.parse(old);
	console.log('cache -->', old);
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
	await octafx.openPage(["21139687","20945089","22737135","27366823"]);
	process.on('SIGINT', async ()=>{ 
		await browser.close();
	});
	process.on('SIGTSTP', async ()=>{
		await browser.close();
	});
	const mt = new mt5();
	let isConnected = mt.connect();
	while (isConnected){
		const newData = await octafx.dataRetr();//[{'symbol': 'GBPUSD', 'volume': '0.2', 'image': 'Sell'}]
		console.log('newData -->',newData);
		if (old === null || old.length == 0){
			old = newData;
			creation = newData;
		}else {
			// comparing old and new 
			const remove = compare(old,newData);
			console.log('remove -->',remove);
			for (let ticket of remove){
				let isClosed = await mt.closeOrder(ticket);
				console.log(`****Closing order ${isClosed} ******`);
				if (isClosed){
					await sendMessages('-4074924590,', `Removed ${JSON.stringify(isClosed)}`);
				}else{
					await sendMessages('-4074924590,', `Unable to Remove ${JSON.stringify(remove)}`);
				}
			}
			creation = filter(old,newData); 
		}

		//opening position
		for (let index=0; index < creation.length; index++){
			console.log('open postiion -->',creation[index]);
			let isOpen = await mt.openOrder(creation[index]);
			console.log(`**** Opening order ${JSON.stringify(isOpen)} ****`);
			creation["ticket"] = isOpen["ORDER"]; 
			if (isOpen){
				await sendMessages('-4074924590,', `Position opened ${JSON.stringify(isOpen)}`);
			}else {
				await sendMessages('-4074924590,', `Unable to open position ${JSON.stringify(create)}`);
			}
		}
		await new Promise(resolve => setTimeout(resolve,2000));
		console.log('Updating cache ....');
		old = creation;
		fs.writeFileSync("cached.json",JSON.stringify(old),"utf-8");
	}
})();
