const os = require('os');
const fs = require('fs');
const process = require('process');
const puppeteer = require('puppeteer');
const OneFx = require('./utils/oneFx');
const OctaFx = require('./utils/octaFx');
const { filter } = require('./utils/filter');
const { compare } = require('./utils/compare');
const { sendMessages } = require('./utils/notify');

require('dotenv').config();

const config = process.env;
console.log(config);
const fx = new OneFx(config);
let old = [];
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
	let [status, code] = [null, null];
	let re_try = 0;
	while (code != 1 && re_try != 3 ){
		[status, code] = await fx.login(browser);
		console.log(code);
		re_try +=1;
	}
	console.log(status);
	if (code > 1){
		await sendMessages('-4074924590,', `unable to log in`);
		await browser.close();
		process.exit()
	}
	//await octafx.openPage(["21139687","20945089","22737135","27366823"]);
	await octafx.openPage(["21151731"]);
	
	process.on('SIGINT', async ()=>{ 
		await browser.close();
	});
	process.on('SIGTSTP', async ()=>{
		await browser.close();
	});
	while (true){
		const [newData, error ]= await octafx.dataRetr(12000)//[[],null]//[[{"volume":"0.02","symbol":"EURJPY","type":"BUY","duration":"17s","open_time":"12:27"},{"volume":"0.02","symbol":"USDJPY","type":"BUY","duration":"55s","open_time":"12:18"},{"volume":"0.02","symbol":"USDJPY","type":"BUY","duration":"47s","open_time":"12:18"},{"volume":"0.02","symbol":"EURUSD","type":"SELL","duration":"40s","open_time":"05:01"}],null] //await octafx.dataRetr(12000);
		console.log('newData -->',newData);
		if (error === null){
			console.log('newData -->',newData);
			if (old !== null || old.length !== 0){
				// comparing old and new 
				const remove = compare(old,newData);
				console.log('remove -->',remove);
				if (remove.length){
					let [ closedErr ,isClosed  ] = await fx.closePosition(remove);
					console.log(`****Closing order ${isClosed} ******`); 
					if (isClosed == 1){
						//removing closed calls from old varibale and file 
						if (remove.length === old.length){
							old =[];
						}else{
							for (let removed of remove){
								for (let i = 0;  i<old.length; i++){
									let toCompare = old[i]
									if (toCompare.volume === removed.volume && toCompare.type === removed.type && toCompare.symbol=== removed.symbol && toCompare.open_time === removed.open_time){
										old.splice(i,1);
										console.log('cleaing old data');
										break;
									}
								}
							}
						}
						// after removing closed calls from old data 
						await sendMessages('-4074924590,', `Removed ${JSON.stringify(remove)}`)
					}else{
						await sendMessages(data_yaml.telegram, `Unable to Remove ${JSON.stringify(remove)}`);
					}
				}
					
			}
			let creation = filter(old,newData);
			console.log('filtered data --->',creation)
			//opeing position
			for (let create of creation){
				console.log('open postiion -->',create)
				await fx.createPosition(create.symbol,create.volume, create.type);
				await sendMessages('-4074924590,', `Position opened ${JSON.stringify(create)}`);
				old.push(create); 
			}
			console.log('Updating cache ....');
			fs.writeFileSync("cached.json",JSON.stringify(old),"utf-8");
		//for custom data testing uncomment below;
		await new Promise(resolve => setTimeout(resolve,20000));
		}
	}


})();

