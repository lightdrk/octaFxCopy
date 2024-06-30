class OneFx {
	constructor(config) {
		this.username = config.USERNAME;
		this.password = config.PASSWORD;
		this.page = null;
		this.openPositionList = [];
	}

	async function login(){
		this.page = await browser.newPage();
		//await this.page.bringToFront();
		const customUserAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36';
		await this.page.setUserAgent(customUserAgent);
		await this.page.goto('https://platform.onefxpro.com', {waitUntil: 'networkidle0'});
		try {
			await this.page.waitForSelector('input[data-testid="login-field"]');
		}catch (err){
			console.log(err);
		}
		const login = await this.page.$('input[data-testid="login-field"]');
		try {
			await login.type(this.username);
		}catch (err) {
			console.log('error typing username')
			console.log(err);
		}

		const password = await this.page.$('input[data-testid="password-field"]');
		try{
			await password.type(this.password);
		}catch (err) {
			console.log('error typing username');
			console.log(err);
		}
		
		const sign_in = await this.page.$('button.engine-button--center:nth-child(5)');
		try{
			await sign_in.click();
		}catch (err){
			console.log('failed To click on sign in button')
			console.log(err);
		}
		
		try{
			await this.page.waitForSelector('#cdk-drop-list-0');
		}catch (err) {
			console.log(err);
			return 0;
		}

		return 1;
		
	}


	async function createPosition(symbol, volume, callType) {
		try{
			await this.page.waitForSelector("div.list-element__wrapper", {visible: true});
		}catch (err) {
			console.log(err);
		}

		const symbolsDiv = await this.page.$$("div.list-element__wrapper");
		let symbolDiv = null;
		for (let x of symbolsDiv){
			let text = await this.page.evaluate(el => el.innerText, x);
			if (text.includes(symbol)){
				await x.click();
				symbolDiv = x;
				break;
			}
		}

		try{
			await this.page.waitForSelector('input[id="Market-Watch-VolumeEditField"]', {visible: true});
		}catch (err) {
			console.log(err);
		}
		const inputField = await symbolDiv.$$('input[id="Market-Watch-VolumeEditField"]');
		console.log('input -->', inputField[0]);
		let text = await this.page.evaluate(el => el.value = `${volume}`, inputField[0]);
		await inputField[0].focus();
		console.log('text -->',text);
		try{
			await this.page.waitForSelector('button[id="MarketWatch-QuickBuy"]', {visible: true});
		}catch (err) {
			console.log(err);
		}

		let button = null;
		if (callType === 'buy' ){
			try {
				button = await symbolDiv.$('button[id="MarketWatch-QuickBuy"]');
			}catch (err) {
				console.log(err);
			}
		}else {
			try {
				button = await symbolDiv.$('button[id="MarketWatch-QuickSell"]');
			} catch (err) {
				console.log(err);
			}
		}
		console.log('click -->',button);
		await button.click();
		await this.page.screenshot({path: 'onefx.png'});
		
		try {
			await this.page.$$('div[class="engine-list--overflow"]');
		}catch (err){
		console.log(err);
		}

		const positionsDiv = await this.page.$$('div[class="engine-list--overflow"]');
		const openPosition = await positionsDiv[2].$$('div[class="list-element__wrapper"]');
		for (let position of openPosition){
			const text =  await this.page.evaluate(el => el.innerText, position);
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
		console.log(openPositionList);
		return this.openPositionList;
		console.log(this.openPositionList.length);
	}

	async function closePosition(remove){
		for (let x of this.openPositionList){
			if (x.text.includes(remove.txt)){
				const btn = x.closeEl;
				console.log(btn);
				await btn.click();
			}
		}

	}
}

module.exports = OneFx;
