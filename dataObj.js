const XLSX = require("xlsx");

// class TableInfo {
// 	constructor() {
// 		this.workbook = XLSX.readFile("data/data.xlsx");
// 		this.sheetName = this.workbook.SheetNames[0]
// 		this.worksheet = this.workbook.Sheets[this.sheetName]
// 		this.jsonWorkSheet = XLSX.utils.sheet_to_json(this.worksheet);
// 	}

// 	testFunc(){
// 		console.log(this.jsonWorkSheet)
// 	}

// 	writeToTable(obj) {
// 		console.log(this.jsonWorkSheet)
// 		this.jsonWorkSheet.push(obj)
// 		// console.log(this.jsonWorkSheet)
// 		XLSX.utils.sheet_add_json(this.worksheet, this.jsonWorkSheet)
// 		XLSX.writeFile(this.workbook, "data/data.xlsx");
// 	}
// }

function TableInfo(){
	this.workbook = XLSX.readFile("data/data.xlsx");
		this.sheetName = this.workbook.SheetNames[0]
		this.worksheet = this.workbook.Sheets[this.sheetName]
		this.jsonWorkSheet = XLSX.utils.sheet_to_json(this.worksheet);

		this.testFunc = ()=>{
			console.log(this.jsonWorkSheet)
		}

		this.writeToTable= (obj) => {
			// console.log(this.jsonWorkSheet)
			this.jsonWorkSheet.push(obj)
			// console.log(this.jsonWorkSheet)
			XLSX.utils.sheet_add_json(this.worksheet, this.jsonWorkSheet)
			XLSX.writeFile(this.workbook, "data/data.xlsx");
		}
}

module.exports = {
	TableInfo
}