const Mt5 = require('./mt5');

async function test(){
	let m = new Mt5();
	let isConnected = m.connect();
	let details = null;
	console.log(isConnected);
	let isOpen = null;
	console.log("in")
	isOpen = await m.openOrder({"symbol": "EURUSD", "volume": 0.5, "type": "BUY"});
	console.log("isOpen? --> ", isOpen);
	let close = null;
	if (isOpen.ERROR_ID == 0){
		setTimeout(()=>{console.log('waiting time'), 5000});
		close = m.closeOrder(isOpen.ORDER);
	}
	if (close.ERROR_ID === 0){
		console.log("order closed ");
	}else {
		console.log(close);
		console.log("error closing order");
	
	}

	m.disconnect();
}

test();
