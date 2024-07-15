const Mt5 = require('./mt5');

let m = new Mt5();
let isConnected = m.connect();
let details = null;
if (isConnected){
	details = m.getDetails("EURUSD");
}
m.disconnect();
