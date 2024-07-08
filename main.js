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
		headless: true,
		defaultViewport: null,
		args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized'],
	});
	const octafx = new OctaFx(browser);
	let creation = [];
	await fx.login(browser);
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
		const newData = [] //await octafx.dataRetr();//[{'symbol': 'GBPUSD', 'volume': '0.2', 'image': 'Sell'}]
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
		old = newData;
		fs.writeFileSync("cached.json",JSON.stringify(old),"utf-8");
	}


})();

