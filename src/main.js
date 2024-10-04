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
		headless: false,
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
	await octafx.openPage(["21139687","20945089","22737135","27366823"]);
	process.on('SIGINT', async ()=>{ 
		await browser.close();
		cache(old);
	});
	process.on('SIGTSTP', async ()=>{
		await browser.close();
		cache(old);
	});
	while (true){
		const [ newData, errors] = await octafx.dataRetr();//[{'symbol': 'GBPUSD', 'volume': '0.2', 'image': 'Sell'}]
		console.log('newData -->',newData);
		if (old === null || old.length == 0){
			old = newData;
			creation = newData;
		}else {
			// comparing old and new 
			const remove = compare(old,newData);
			console.log('remove -->',remove);
			if (remove.length){
				let isClosed = await fx.closePosition(remove);
				await sendMessages('-4074924590,', `Removed ${JSON.stringify(remove)}`)
			}
			creation = filter(old,newData);
		}

		//opening position
		for (let create of creation){
			console.log('open postiion -->',create)
			await fx.createPosition(create.symbol,create.volume, create.image);
			await sendMessages('-4074924590,', `Position opened ${JSON.stringify(create)}`);
		}
		await new Promise(resolve => setTimeout(resolve,2000));
		console.log('Updating cache ....');
		old = creation;
		fs.writeFileSync("cached.json",JSON.stringify(old),"utf-8");
	}


})();

