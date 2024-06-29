const puppeteer = require('puppeteer');
const {octaFx} = require('./utils/octaFx');
const {OneFx} = require('./utils/oneFx');

const fx = new OneFx(config);
let old = null; 
(async ()=>{
	const browser = await puppeteer.launch({
		headless: true,
		defaultViewport: null,
		args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized'],
	});

	const newData = await octaFx();
	if (old === null){
		old = newData;
	}else {
		// comparing old and new 
		for (){
			
		}

	}

})();
