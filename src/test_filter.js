
const puppeteer = require('puppeteer');
const OctaFx = require('./utils/octaFx');
const { filter } = require('./utils/filter');
const { compare } = require('./utils/compare');

(async ()=>{
	const browser = await puppeteer.launch({
		headless: true,
		defaultViewport: null,
		args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized'],
	});
	const octafx = new OctaFx(browser);
	await octafx.openPage(["27366825", "21139687","20945089","22737135","27366823"]);
	const data = await octafx.dataRetr();
	console.log('data -----> ',data)
	const oldData = data;
	for (let x of oldData){
		x["ticket"] = 1112323;
	}
	console.log(oldData);
	const t = filter(oldData, data);
	const c = compare(data, oldData);
	console.log('filter --->',t);
	console.log('compare --->', c);
})();
