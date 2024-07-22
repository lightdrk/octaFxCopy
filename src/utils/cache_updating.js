function update(ticket, data){
	for (let i = 0; i < data.length; i++){
		if (data[i].ticket === ticket){
			data.splice(index,1);
			return 1
		}	
	}
}
