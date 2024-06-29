async function octaFx() {
	const call = {'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iI0U3RjFGRiIvPgo8cGF0aCBkPSJNMTcgMTZMMTcgN0w4IDciIHN0cm9rZT0iIzBENkZGQiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHJlY3QgeD0iMTUuODcyMSIgeT0iNi40OTczOCIgd2lkdGg9IjIuMjk0NDYiIGhlaWdodD0iMTMuMjkxNSIgcng9IjEuMTQ3MjMiIHRyYW5zZm9ybT0icm90YXRlKDQ1IDE1Ljg3MjEgNi40OTczOCkiIGZpbGw9IiMwRDZGRkIiLz4KPC9zdmc+Cg==': 'buy', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iI0ZGRUFDQyIvPgo8cGF0aCBkPSJNOCAxNkwxNyAxNkwxNyA3IiBzdHJva2U9IiNGRjk0MDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxyZWN0IHg9IjE2LjcwMjYiIHk9IjE1LjAzMDYiIHdpZHRoPSIxLjI3NTM4IiBoZWlnaHQ9IjEyLjE4MSIgcng9IjAuNjM3NjkyIiB0cmFuc2Zvcm09InJvdGF0ZSgxMzUgMTYuNzAyNiAxNS4wMzA2KSIgZmlsbD0iI0ZGOTQwMCIgc3Ryb2tlPSIjRkY5NDAwIi8+Cjwvc3ZnPgo=': 'sell'};
	const page = await browser.newPage();
	const customUserAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36';
	await page.setUserAgent(customUserAgent);
	try {
		await page.goto('https://www.octafx.com/copy-trade/master/27366825/', {waitUntil: 'load'});
	}catch (err) {
		console.error(err);
	}

	await page.screenshot({path: 'octafx.png'});
	const openOrder = await page.$$('button[class="ct-button text-button ct-tab _secondary _flat"]');
	await openOrder[0].click();
	const divList = await page.$$('div[class="history-table"]');
	let openOrderDiv = null;
	for (let x of divList) {
		const visible = await x.isVisible();
		if (visible){
			openOrderDiv = x;
			break;
		}
	}
	const images = await openOrderDiv.$$('img');
	const volume = await openOrderDiv.$$('div[class="history-table__volume"]');
	const currency = await openOrderDiv.$$('div[class="history-table__currency"]');
	const data =[];
	for (let n = 0; n<images.length; n++){
		const vlm = await page.evaluate( el => el.innerText, volume[n] );
		const img = await page.evaluate( el => el.src, images[n] );
		const cur = await page.evaluate( el => el.innerText, currency[n] );
		console.log(img);
		data.push({volume: vlm, currency: cur, image: call[img]});
	}
	console.log(data);
}

module.exports.octaFx = octaFx;
