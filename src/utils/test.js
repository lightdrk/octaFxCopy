const Mt5 = require('./mt5');

async function test(){
	let m = new Mt5();
	let isConnected = m.connect();
	let details = null;
	console.log(isConnected);
	if (isConnected){
		details = await m.getDetails("EURUSD");
	}
	console.log('details-->',details);
	let isOpen = null;
	console.log("in")
	isOpen = await m.openOrder({"symbol": "EURUSD", "volume": 0.5, "image": "SELL"});
	console.log("isOpen? --> ", isOpen);
	m.disconnect();
}

test();
//check mt5 issues
