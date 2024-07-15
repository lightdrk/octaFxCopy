const Mt5 = require('./mt5');

let m = new Mt5();
let isConnected = m.connect();
let details = null;
if (isConnected){
	details = m.getDetails("EURUSD");
}
console.log(dtails);
let isOpen = null;
if (details){
	console.log("in")
	isOpen = m.openOrder({"symbol": "EURUSD", "volume": 0.5, "image": "SELL"});
}

m.disconnect();
