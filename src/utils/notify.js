const axios = require('axios');



async function sendMessages(chatId,text){
	const BOT_TOKEN = '6492315795:AAHRb29Kob8e-MrRlzb2qnnq7yfsWKzbQnQ';
	const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
	const params = { chat_id: chatId, text};
	let response = null;
//	try {
//		response = await axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`);
//	}catch (err){
//		console.log(err);
//	}
//	console.log(response.data.result[0].my_chat_member.chat);

	try {
		const response = await axios.post(url,params);
		console.log(response.data);
	}catch (err) {
		console.error(err);
	}

	
}

module.exports.sendMessages = sendMessages;
