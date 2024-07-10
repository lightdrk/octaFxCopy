function filter(old, newData) {
	const update = [];
	for (let x of newData){
		console.log(x);
		var isIn = null;
		for (let y of old){
			if (JSON.stringify(x) == JSON.stringify(y)){
				isIn = 1;
				break;
			}
		}
		if (isIn == null){
			update.push(x)
		}
	}
	console.log(update);
	return update;

}

module.exports.filter = filter;
