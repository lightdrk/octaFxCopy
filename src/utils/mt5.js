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
		try{
			this.client.write(`{"MSG":"QUOTE","SYMBOL": "${symbol}"}` + '\r\n');
		}catch (err) {
			console.log(error);
			return response_data;
		}
		
		try{
			this.client.on('data', function(chunk, response_data){
				response_data = JSON.parse(chunk.toString());
				console.log('get details --->',response_data);
			});
		}catch (err) {
			console.log(err);
			return response_data;
		}
		
		return response_data;
	}
	
	openOrder(data) {
		let response_data = null;
		this.orderData["SYMBOL"] = data["symbol"];
		this.orderData["VOLUME"] = data["volume"];
		this.orderData["TYPE"] = `ORDER_TYPE_${data["image"]}`;
		console.log(this.orderData);
		return new Promise((resolve, reject) => {
			this.client.write(JSON.stringify(this.orderData) + '\r\n', (err)=>{
				if (err){
					console.error('Error Sending order: ', err);
					reject(err);
				}
			});
			this.client.on('data', function(chunk){
				console.log('chunk openorder-->',chunk.toString());
				response_data = JSON.parse(chunk.toString());
				resolve(response_data);
			});
		});
	}

	closeOrder(data) {
		let response_data = null;
		this.closeData["TICKET"] = data["ticket"];
		try {
			this.client.write(this.closeData);
		}catch(err) {
			console.log(err);
			return 0;
		}

		try {
			this.client.on('data', function(chunk, response_data){
				response_data = JSON.parse(chunk.toString());
			});
		}catch (err) {
			console.log(err);
			return response_data;
		}
		return response_data;
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

//client.exit();
