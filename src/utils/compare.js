function compare(old, newData) {
	const diff = [];
	const newData_copy = [...newData];
	console.log(newData_copy);
	for (let x of old){
		var isIn = null;
		for (let y = 0; y < newData_copy.length; y++){
			if (newData_copy[y] != undefined){
				console.log(`${x.open_time} === ${newData_copy[y].open_time}`, x.open_time === newData_copy[y].open_time);
				console.log(`${x.volume} === ${newData_copy[y].volume}`, x.volume === newData_copy[y].volume);
				console.log(`${x.symbol} === ${newData_copy[y].symbol}`, x.symbol === newData_copy[y].symbol);
				console.log(`${x.type} === ${newData_copy[y].type}`,  x.type === newData_copy[y].type);
				if (x.open_time.trim() === newData_copy[y].open_time.trim() && x.volume === newData_copy[y].volume && x.symbol === newData_copy[y].symbol && x.type === newData_copy[y].type){
					isIn = 1;
					newData_copy.splice(y, 1);
					//delete newData_copy[y];
					break;
				}
			}
		}
		if (isIn == null){
			diff.push(x)
		}
	}
	return diff;

}
module.exports.compare = compare;
