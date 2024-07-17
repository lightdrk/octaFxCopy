function toCheck(time){
	let lower = time.toLowerCase();
	if (lower.includes('h')){
		return false;
	}
	if (lower.includes('m')){
		let int = parseInt(lower);
		if (int < 2){
			return true;
		}
		return false;
	}
	return true;
}


function filter(old, newData) {
	const update = [];
	for (let x of newData){
		let time_duration = x.duration;
		let checker = toCheck(time_duration);
		if (checker){
			var isIn = null;
			// issue here is if old data has one data that is similar to all the data in new taht's issue
			// if their is not time;
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
	}
	console.log(update);
	return update;

}

module.exports.filter = filter;
