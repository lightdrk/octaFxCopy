function compare(old, newData) {
	const diff = null;
	// [{}]
	for (let x of old){
		for (let y of newData){
			if (JSON.stringify(x) == JSON.stringify(y)){

			}
		}
	}

}

module.exports.compare = compare
