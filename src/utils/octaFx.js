class OctaFx {
	constructor(browser){
		this.pages = [];
		this.browser = browser;
		this.isOpen = (str) => {
			for (let n = 0; n < str.length; n++){
				let x = str.charCodeAt(n);
				if ( (48<x) && (x<=57)){
					return true;
				}
			}
			return false;
		};
	}
	 

	async openPage(url){
		for ( let u of url ){
			const page = await this.browser.newPage();
			const customUserAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36';
			await page.setUserAgent(customUserAgent);
			try {
				await page.goto(`https://www.octafx.com/copy-trade/master/${u}/`, {waitUntil: 'load'});
			}catch (err) {
				await page.screenshot({path: 'loginError.png'});
				console.error(err);
			}
			this.pages.push(page);
			await new Promise(resolve => setTimeout(resolve,3000));
		}
		console.log(this.pages);
	}

	async dataRetr(refresh_time) {
		const data =[];
		let error = null;
		const call = {'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iI0U3RjFGRiIvPgo8cGF0aCBkPSJNMTcgMTZMMTcgN0w4IDciIHN0cm9rZT0iIzBENkZGQiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHJlY3QgeD0iMTUuODcyMSIgeT0iNi40OTczOCIgd2lkdGg9IjIuMjk0NDYiIGhlaWdodD0iMTMuMjkxNSIgcng9IjEuMTQ3MjMiIHRyYW5zZm9ybT0icm90YXRlKDQ1IDE1Ljg3MjEgNi40OTczOCkiIGZpbGw9IiMwRDZGRkIiLz4KPC9zdmc+Cg==': 'BUY', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iI0ZGRUFDQyIvPgo8cGF0aCBkPSJNOCAxNkwxNyAxNkwxNyA3IiBzdHJva2U9IiNGRjk0MDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxyZWN0IHg9IjE2LjcwMjYiIHk9IjE1LjAzMDYiIHdpZHRoPSIxLjI3NTM4IiBoZWlnaHQ9IjEyLjE4MSIgcng9IjAuNjM3NjkyIiB0cmFuc2Zvcm09InJvdGF0ZSgxMzUgMTYuNzAyNiAxNS4wMzA2KSIgZmlsbD0iI0ZGOTQwMCIgc3Ryb2tlPSIjRkY5NDAwIi8+Cjwvc3ZnPgo=': 'SELL'};
		let index = 0;
		while (index < this.pages.length) {
			let page = this.pages[index];
			try {
				console.log('re-loading');
				await page.reload({waitUntil: 'load'});

				await page.screenshot({path: 'octafx.png'});
	
				let openOrder = await page.$$('button[class="ct-button text-button ct-tab _secondary _flat"]');
				let numberOfOpenOrders = null;
				if (openOrder){
					numberOfOpenOrders = await page.evaluate(el => el.innerText, openOrder[0]);
				}else {
					this.Error = {'error': 'openOrder html not found', 'err_type': 'critical'};
					await page.screenshot({path: 'openOrder.png'});
				}

				if (this.isOpen(numberOfOpenOrders)){
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

					await openOrderDiv.waitForSelector('img',{timeout:3000});
					await openOrderDiv.waitForSelector('div[class="history-table__volume"]',{timeout:5000});

					const images = await openOrderDiv.$$('img');
					const volume = await openOrderDiv.$$('div[class="history-table__volume"]');
					const currency = await openOrderDiv.$$('div[class="history-table__currency"]');
					const duration = await openOrderDiv.$$('div[class="history-table__row-section _duration"]');
					const open_time = await openOrderDiv.$$('div[class="history-table__row-section _time"]');
						
					for (let n = 0; n<volume.length; n++){
						const vlm = await page.evaluate( el => el.innerText, volume[n] );
						const img = await page.evaluate( el => el.src, images[n] );
						const cur = await page.evaluate( el => el.innerText, currency[n] );
						const dur = await page.evaluate( el => el.innerText, duration[n] );
						const opt = await page.evaluate( el => el.innerText, open_time[n] );
						data.push({volume: vlm, symbol: cur, type: call[img], duration: dur, open_time: opt});
					}
				}
			}catch (err){
				if (err.name === 'TimeoutError' && err.message.includes('div[class="history-table__volume"]')){
					console.log('<<<<<<<<<<<<<<>OctaFx blocked us, waiting for 5 mins<>>>>>>>>>>>>>>>>>>>>>');
					error = {err: err, "details": 'blocked'};
					break;
				}
				console.log(err);
			}
			index ++;
			await new Promise(resolve => setTimeout(resolve,refresh_time));	
		}
		return [data, error];
	}
}

module.exports = OctaFx;
