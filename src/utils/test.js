const Mt5 = require('./mt5');

let m = new Mt5();
let isConnected = m.connect();
let details = null;
if (isConnected){
	details = m.getDetails("EURUSD");
}
let isOpen = null;
if (details){
	isOpen = m.openOrder({"symbol": "EURUSD", "volume": 0.5, "image": "SELL"});
}

m.disconnect();
