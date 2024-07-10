const axios = require('axios');

async function check(){
	proxies = await axios.get("https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/http.txt");
	proxy_list = proxies.data.split('\n');
	for (proxy of proxy_list){

		let response = null;
		try {
			response = await axios.get(`http://${proxy}`, {timeout: 5000});
			console.log(response);
			if (response.status == 'ok'){
				console.log(`${proxy}: (working)`);
			}
		}catch (err){
			console.log();
		}

	}
}

check();
