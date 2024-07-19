function compare(old, newData) {
	const diff = [];
	for (let x of old){
		var isIn = null;
		for (let y of newData){
			console.log(`${x.open_time} === ${y.open_time}`, x.open_time === y.open_time);
			console.log(`${x.volume} === ${y.volume}`, x.volume === y.volume);
			console.log(`${x.symbol} === ${y.symbol}`, x.symbol === y.symbol);
			console.log(`${x.type} === ${y.type}`,  x.type === y.type);
			if (x.open_time === y.open_time && x.volume === y.volume && x.symbol === y.symbol && x.type === y.type){
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
