function compare(old, newData) {
	const diff = [];
	for (let x of old){
		var isIn = null;
		for (let y of newData){
			console.log(`${old.open_time} === ${newData.open_time}`, old.open_time === newData.open_time);
			console.log(`${old.volume} === ${newData.volume}`, old.volume === newData.volume);
			console.log(`${old.symbol} === ${newData.symbol}`, old.symbol === newData.symbol);
			console.log(`${old.type} === ${newData.type}`,  old.type === newData.type);
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
