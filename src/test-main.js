const os = require('os');
const process = require('process');
const puppeteer = require('puppeteer');
const OctaFx  = require('./utils/octaFx');
const { filter } = require('./utils/filter');
const { compare } = require('./utils/compare');
const { sendMessages } = require('./utils/notify');

TODO: store data , check this file, issue here with getting ticket check filter it has ticket new data which can cause it to always be yes for data, 

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
	while (true){
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
				if (isClosed){
					await sendMessages('-4074924590,', `Removed ${JSON.stringify(remove)}`);
				}else{
					await sendMessages('-4074924590,', `Unable to Remove ${JSON.stringify(remove)}`);
				}
			}
			creation = filter(old,newData); 
		}

		//opening position
		for (let create of creation){
			console.log('open postiion -->',create);
			let isOpen = await mt.openOrder(create);
			if (isOpen){
				await sendMessages('-4074924590,', `Position opened ${JSON.stringify(create)}`);
			}else {
				await sendMessages('-4074924590,', `Unable to open position ${JSON.stringify(create)}`);
			}
		}
		await new Promise(resolve => setTimeout(resolve,2000));
		console.log('Updating cache ....');
		old = newData;
		fs.writeFileSync("cached.json",JSON.stringify(old),"utf-8");
	}
