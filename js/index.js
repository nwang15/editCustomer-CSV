function App(dropZoneID,downloadID,testButtonID,removeButtonID,download2ID,filterDropZoneID,filterButtonID){
	this.csvDropZone = document.getElementById(dropZoneID);
	this.downloadLink = document.getElementById(downloadID);
	this.downloadLink2 = document.getElementById(download2ID);
	this.testButton = document.getElementById(testButtonID);
	this.removeButton = document.getElementById(removeButtonID);
	this.filterDropZone = document.getElementById(filterDropZoneID);
	this.filterButton = document.getElementById(filterButtonID);
	this.commaSplitData;
	this.customersToRemove;
	this.customerRemovedArr;
	this.filteredData;
	this.nameArray;
	this.captureCSV = new CaptureCSV();
	this.editItemCodes;
}

App.prototype.initApp = function() {
	this.csvDropZone.addEventListener("drop",function(e){
		e.preventDefault();
		this.fileDropped(e);
	}.bind(this),false);

	//need this to prevent default downloading of file
	this.csvDropZone.addEventListener("dragover",function(e){
		e.preventDefault();
	}.bind(this),false);

	this.testButton.addEventListener("click",function(e){
		e.preventDefault();
		this.runTests();
	}.bind(this),false);

	this.removeButton.addEventListener("click",function(e){
		e.preventDefault();
		this.removeClicked();
	}.bind(this),false);

	this.filterButton.addEventListener("click",function(e){
		e.preventDefault();
		this.filterClicked();
	}.bind(this),false);

	this.filterDropZone.addEventListener("drop",function(e){
		e.preventDefault();
		this.filterFileDropped(e);
	}.bind(this),false);

	//need this to prevent default downloading of file
	this.filterDropZone.addEventListener("dragover",function(e){
		e.preventDefault();
	}.bind(this),false);

};

App.prototype.runTests = function(){
	console.log("run tests");
	try{
		Tests.checkLength(this.commaSplitData,this.commaSplitData[0].length);
		Tests.checkRemovedCustomer(this.customerRemovedArr,this.emptyIndex);
		Tests.checkRemovedCustomer(this.customersToRemove,this.emptyIndex,true);
		Tests.checkFilteredCustomer(this.filterData,this.nameArray,this.editItemCodes.itemCodeIndex);

	}
	catch(err){
		console.log("error testing ",err);
	}
};

App.prototype.createCSV = function(arr){
	let lineArray = [];

	arr.forEach(function(rowArr,index){
		let row = rowArr.join("");
		//console.log(row);
		lineArray.push(index == 0 ? "data:text/csv;charset=utf-8," + row:row);	
		//lineArray.push(row);
	});
	let csvContent = lineArray.join("\n");
	let encodedUri = encodeURI(csvContent);

	return encodedUri;
};

App.prototype.createBlob = function(arr){
	let lineArray = [];

	arr.forEach(function(rowArr,index){
		let row = rowArr.join("");
		//console.log(row);
		lineArray.push(row);	
		//lineArray.push(row);
	});
	let csvContent = lineArray.join("\n");
	let csvData = new Blob([csvContent],{type:'text/csv'});
	let csvURL = URL.createObjectURL(csvData);
	return csvURL;
};

App.prototype.createDownload = function(csvData,filterByData){
	this.downloadLink.classList.remove("hide");
	this.downloadLink.setAttribute("href","");
	this.downloadLink.setAttribute("href",csvData);
	this.downloadLink.setAttribute("download", "new_data.csv");
	if(filterByData){
		this.downloadLink2.classList.remove("hide");
		this.downloadLink2.setAttribute("href","");
		this.downloadLink2.setAttribute("href",filterByData);
		this.downloadLink2.setAttribute("download", "filter_by.csv");
	}
};

App.prototype.removeClicked = function(){
	try{
		let editCustomers = new EditCustomer(this.commaSplitData,"Date of First Order","name");
		this.customerRemovedArr = editCustomers.removeRows(this.commaSplitData);
		this.customersToRemove = editCustomers.removedNames;
		this.emptyIndex = editCustomers.emptyField;
		//console.log(Object.keys(this.customersToRemove).length);
		console.log(this.customerRemovedArr);
		let csvData = this.createBlob(this.customerRemovedArr);
		let filterData = this.createBlob(this.customersToRemove);
		this.createDownload(csvData,filterData);

	}
	catch(err){
		console.log("error testing ",err);
	}
};

App.prototype.filterClicked = function(){
	console.log("filter clicked");
	try{
		let filteredData = this.editItemCodes.removeByItemCode(this.commaSplitData,this.nameArray);
		console.log(filteredData);
		this.filterData = filteredData;
		let csvData = this.createBlob(filteredData);
		this.createDownload(csvData);
	}
	catch(err){
		console.log("error testing ",err);
	}
};

App.prototype.filterFileDropped = function(event){
	let csvFile = event.dataTransfer.items[0].getAsFile();
	this.captureCSV.readFile(csvFile)

	.then(commaSplitData => {
		let filterByData = commaSplitData;
		
		let editItemCodes = new EditItemCodes(filterByData,"Name");
		//editItemCodes.adjustItemCodes(filterByData);
		this.editItemCodes = editItemCodes;
		this.nameArray = editItemCodes.captureItemCodes(commaSplitData);
		console.log("item codes ",this.nameArray);
	})

	.catch(err => {
		console.log("error reading file", err);
	});
	//console.log(this.commaSplitData);
};

App.prototype.fileDropped = function(event){
	let csvFile = event.dataTransfer.items[0].getAsFile();
	this.captureCSV.readFile(csvFile)

	.then(commaSplitData => {
		this.commaSplitData = commaSplitData;
		console.log(this.commaSplitData);
		
	})

	.catch(err => {
		console.log("error reading file", err);
	});
	//console.log(this.commaSplitData);
};

let app = new App("drop_zone","downloadLink","testData","removeData","downloadLink2","drop_zone_filter","filterData");
window.onload = app.initApp();