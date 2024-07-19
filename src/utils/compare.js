function compare(old, newData) {
	const diff = [];
	for (let x of old){
		var isIn = null;
		for (let y of newData){
			if (old.open_time === newData.open_time && old.volume === newData.volume && old.symbol === newData.symbol && old.type === newData.type){
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
