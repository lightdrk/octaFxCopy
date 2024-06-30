const puppeteer = require('puppeteer');
const { OneFx } = require('./utils/oneFx');
const { octaFx } = require('./utils/octaFx');
const { compare } = require('./utils/compare');

const fx = new OneFx(config);
let old = null; 
(async ()=>{
	const browser = await puppeteer.launch({
		headless: true,
		defaultViewport: null,
		args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized'],
	});

	const newData = await octaFx();
	await fx.login();
	
	if (old === null){
		old = newData;
	}else {
		// comparing old and new 
		const remove = compare(old,newData);
		await fx.closePosition(remove);
	}

	//opening position

	for (let create of newData){
		await fx.createPosition(create.symbol,create.volume, create.image);
	}


})();
