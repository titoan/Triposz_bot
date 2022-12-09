const XLSX = require("xlsx");

function TableInfo(){
	this.workbook = XLSX.readFile("data/data.xlsx");
		this.sheetName = this.workbook.SheetNames[0]
		this.worksheet = this.workbook.Sheets[this.sheetName]
		this.jsonWorkSheet = XLSX.utils.sheet_to_json(this.worksheet);

		this.writeToTable= (obj) => {			
			this.jsonWorkSheet.push(obj)			
			XLSX.utils.sheet_add_json(this.worksheet, this.jsonWorkSheet)
			XLSX.writeFile(this.workbook, "data/data.xlsx");
		}
}

module.exports = {
	TableInfo
}