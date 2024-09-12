const os = require('os');

class OneFx {
	constructor(config) {
		this.username = null; 
		if (os.platform() === "linux"){
			 this.username = config.USERNAME;
		}else{
			this.username = config.USER;
		}
		this.password = config.PASS;
		this.page = null;
		this.openPositionList = [];
		this.code = 1;
		this.errorObj = {
			1: "done",
			2: "Unable to load website",
			3: "Failed to type username detials",
			4: "Failed to type password detials",
			5: "Failed to click sign in button",
			6: "Unable to login",
			7: "not able to find the button",
			8: "not able to find input aread",
			9: "button not found",
			10: "buy button not found",
			11: "sell button not found",
			12: "Remove failed"
		};
	}

	async login(browser){
		this.page = await browser.newPage();
		//await this.page.bringToFront();
		const customUserAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36';
		await this.page.setUserAgent(customUserAgent);
		await this.page.goto('https://platform.onefxpro.com', {waitUntil: 'load'});
		try {
			await this.page.waitForSelector('input[data-testid="login-field"]');
		}catch (err){
			this.code = 2
			console.log(this.errorObj[code]);
			//console.log(err);
		}
		const login = await this.page.$('input[data-testid="login-field"]');
		try {
			await login.type(this.username);
		}catch (err) {
			this.code = 3;
			console.log('error typing username')
			//console.log(err);
		}

		const password = await this.page.$('input[data-testid="password-field"]');
		try{
			await password.type(this.password);
		}catch (err) {
			this.code = 4;
			console.log('error typing username');
			//console.log(err);
		}
		
		const sign_in = await this.page.$('button.engine-button--center:nth-child(5)');
		try{
			await sign_in.click();
		}catch (err){
			this.code = 5;
			console.log('failed To click on sign in button')
			//console.log(err);
		}

		try{
			await this.page.waitForSelector('#cdk-drop-list-0', {timeout: 5000});
		}catch (err) {
			this.code = 6;
			console.log(this.errorObj[code])
			//console.log(err);
		}
		if (this.code > 1){
			await this.page.close();
		}

		return [this.errorObj[this.code], this.code];
	}


	async createPosition(symbol, volume, callType) {
		try{
			await this.page.bringToFront();
			await this.page.waitForSelector("div.list-element__wrapper", {visible: true});
		}catch (err) {
			this.code = 7;
			console.log("not able to find the button");
			//console.log(err);
		}

		const symbolsDiv = await this.page.$$("div.list-element__wrapper");
		let symbolDiv = null;

		console.log(symbolsDiv);
		for (let x of symbolsDiv){
			let text = await this.page.evaluate(el => el.innerText, x);
			console.log('onefx symbols -->',text);
			console.log("check for text --->",text.includes(symbol));
			if (text.includes(symbol)){
				await x.click();
				symbolDiv = x;
				break;
			}
		}

		try{
			await this.page.waitForSelector('input[id="Market-Watch-VolumeEditField"]', {visible: true});
		}catch (err) {
			this.code = 8; 
			console.log(this.errorObj[this.code]);
			//console.log(err);
		}
		const inputField = await symbolDiv.$$('input[id="Market-Watch-VolumeEditField"]');
		console.log('input -->', inputField[0],volume);
		let text = await this.page.evaluate((el,volume) => el.value = volume, inputField[0],volume);
		await inputField[0].focus();
		console.log('text -->',text);
		try{
			await this.page.waitForSelector('button[id="MarketWatch-QuickBuy"]', {visible: true});
		}catch (err) {
			this.code = 9;
			console.log(this.errorObj[this.code]);
			//console.log(err);
		}

		let button = null;
		if (callType === 'Buy' ){
			try {
				button = await symbolDiv.$('button[id="MarketWatch-QuickBuy"]');
			}catch (err) {
				this.code = 10;
				console.log(this.errorObj[this.code]);
				//console.log(err);
			}
		}else {
			try {
				button = await symbolDiv.$('button[id="MarketWatch-QuickSell"]');
			} catch (err) {
				this.code = 11;
				console.log(this.errorObj[this.code]);
				//console.log(err);
			}
		}
		console.log('click -->',button);
		await button.click();
		await this.page.screenshot({path: 'onefx.png'});
		return [this.errorObj[this.code], this.code];
	}

	async closePosition(remove){
		console.log("close Position------------------>");
		try {
			await this.page.bringToFront();
			await this.page.$$('div[class="engine-list--overflow"]');
		}catch (err){
			this.code = 12;
			console.log(this.errorObj[this.code]);
			//console.log(err);
		}

		const positionsDiv = await this.page.$$('div[class="engine-list--overflow"]');
		const openPosition = await positionsDiv[2].$$('div[class="list-element__wrapper"]');
		for (let position of openPosition){
			let text =  await this.page.evaluate(el => el.innerText, position);
			text = text.replaceAll('\n', ' ');
			console.log(text);
			const eL = await position.$$('button[id="closePositionButton"]');
			let closeEl = null;
		
			for (let e of eL){
				let title = await this.page.evaluate(el => el.title, e);
				if (title == "Close position"){
					closeEl = e;
				}
			}

			this.openPositionList.push({closeEl,text})

		}
		console.log('In close position list of open position ---->',this.openPositionList);
		for (let rem of remove){
			for (let x of this.openPositionList){
				console.log('while closing ---->',x.text)
				console.log(x.text.includes(rem.symbol));
				console.log(x.text.includes(rem.volume));
				console.log(x.text.includes(rem.image));

				if (x.text.includes(rem.symbol) && x.text.includes(rem.volume) && x.text.includes(rem.image)){
					const btn = x.closeEl;
					console.log(btn);
					await btn.click();
					break;
				}
			}
		}
		return [this.errorObj[this.code], this.code];

	}
}

module.exports = OneFx;
