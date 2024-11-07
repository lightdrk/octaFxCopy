function toCheck(time){
	let lower = time.toLowerCase();
	if (lower.includes('h')){
		return false;
	}
	if (lower.includes('m')){
		let int = parseInt(lower);
		if (int < 30){
			return true;
		}
		return false;
	}
	return true;
}


function filter(old, newData) {
	const update = [];
	let old_copy = [...old];
	
	for (let x of newData){
		console.log('***.... filtering ....***');
		console.log('old__copy arry---->', old_copy);
		let time_duration = x.duration;
		console.log('time_duration -->',time_duration);
		let checker = toCheck(time_duration);
		console.log('checking for time -----> ',checker)
		if (checker){
          var isIn = null;
		  for (let y = 0; y < old_copy.length; y++){
            console.log(old_copy[y]);
            if (old_copy[y] != undefined){
			  if (old_copy[y].open_time === x.open_time && old_copy[y].volume === x.volume && old_copy[y].symbol === x.symbol && old_copy[y].type === x.type){
                isIn = 1;
				delete old_copy[y];
				break;
			  }
			}
		  } 
		  if (isIn == null){
				update.push(x)
				console.log(update)
		  }
		}
	}
	return update;

}

module.exports.filter = filter;
