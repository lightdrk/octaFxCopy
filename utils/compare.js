function compare(old, newData) {
	const diff = [];
	for (let x of old){
		console.log(x);
		var isIn = null;
		for (let y of newData){
			if (JSON.stringify(x) == JSON.stringify(y)){
				isIn = 1;
				break;
			}
		}
		if (isIn == null){
			diff.push(x)
		}
	}
	return diff;

}


module.exports.compare = compare;
