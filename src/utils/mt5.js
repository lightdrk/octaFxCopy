const Net = require('net');

class Mt5 {
	
	constructor() {
		this.port = 77;
		this.host = "localhost";
		this.client = new Net.Socket();
		this.closeData = { "MSG" : "ORDER_CLOSE", "TICKET": null};
		this.orderData = {"MSG":"ORDER_SEND","SYMBOL": null, "VOLUME": null,"TYPE": null};
	}
	
	connect() {
		try{
			this.client.connect(this.port, this.host);
		}catch (err){
			console.log(error);
			return 0;
		}

		return 1
	}

	getDetails(symbol){
		let response_data = null;
		return new Promise((resolve, reject) => {
			this.client.write(`{"MSG":"QUOTE","SYMBOL": "${symbol}"}` + '\r\n', (err) => {
				if (err) {
					console.error('Error getting Details: ', err);
					reject(err);
				}
			});
		
			this.client.on('data', function(chunk, response_data){
				response_data = JSON.parse(chunk.toString());
				resolve(response_data);
			});
		});
	}
	
	openOrder(data) {
		let response_data = null;
		this.orderData["SYMBOL"] = data["symbol"];
		this.orderData["VOLUME"] = data["volume"];
		this.orderData["TYPE"] = `ORDER_TYPE_${data["image"]}`;
		console.log(this.orderData);
		return new Promise((resolve, reject) => {
			this.client.write(JSON.stringify(this.orderData) + '\r\n', (err) => {
				if (err){
					console.error('Error Sending order: ', err);
					reject(err);
				}
			});
			this.client.on('data', function(chunk){
				response_data = JSON.parse(chunk.toString());
				resolve(response_data);
			});
		});
	}

	closeOrder(data) {
		let response_data = null;
		this.closeData["TICKET"] = data["ticket"];
		return new Promise((resolve, reject) => {
			this.client.write(this.closeData, (err)=>{
				if (err){
					console.error('Error closing order: ', err);
					reject(err);
				}
			});
			this.client.on('data', function(chunk){
				response_data = JSON.parse(chunk.toString());
				resolve(response_data);
			});
		});
	}
	

	disconnect(){
		try {
			this.client.end();
		}catch (err) {
			console.log(err);
		}
	}

}

module.exports = Mt5;
