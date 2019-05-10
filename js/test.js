Tests = {
	checkLength,
	checkRemovedCustomer
};

function checkLength(arr,arrLength){
	console.log("checking length");
	let incorrectIndexes = [];
	for(let i = 0;i < arr.length;i++){
		try{
			if(arr[i].length !== arrLength){
				incorrectIndexes.push(i);
				console.log("error at: ",i);
			}
		}
		catch(error){
			console.log(i);
			console.log(error);
		}
		
	}

	if(incorrectIndexes.length === 0){
		console.log("Length test passed");
	}
}

function checkRemovedCustomer(arr,emtpyIndex,empty){
	let incorrectIndexes = [];
	console.log("checking removed customers");
	for(let i = 1;i < arr.length;i++){
		if(arr[i][emtpyIndex] === "," && !empty){
			incorrectIndexes.push(i);
		}
		else if(empty && arr[i][emtpyIndex] !== ","){
			incorrectIndexes.push(i);
		}
	}

	if(incorrectIndexes.length === 0){
		console.log("removed customer test passed");
	}
	else{
		console.log("test failed: ",incorrectIndexes);
	}
}
