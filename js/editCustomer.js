function EditCustomer(commasplitArr,emptyField){
	//compare name to this field to see if it is empty
	this.emptyField = this.getIndex(commasplitArr,emptyField);
	console.log(this.emptyField);
	this.removedNames = [];
}

EditCustomer.prototype.getIndex = function(arr,identifier){
	//loop through the titles and find vendor
	for(let col = 0; col < arr[0].length; col++){	
		//console.log(arr[0][col].toLowerCase());
		if(arr[0][col].toLowerCase() === (identifier.toLowerCase() + ",")){
			return col;
		}
	}

	return null;
};

EditCustomer.prototype.removeRows = function(arr){
	let foundIndexes = {};
	let filteredArr = [];
	this.removedNames.push(arr[0]);
	for(let row = 1; row < arr.length; row++){
		if(arr[row][this.emptyField] === ","){
			foundIndexes[row] = row;
			this.removedNames.push(arr[row])
		}
	}
	//console.log(Object.keys(foundIndexes).length);
	for(let row = 0; row < arr.length; row++){
		if(!foundIndexes[row]){
			filteredArr.push(arr[row]);
		}
	}


	return filteredArr;
};

