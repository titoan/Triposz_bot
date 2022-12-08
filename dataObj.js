const XLSX = require("xlsx");

class TableInfo {
	constructor() {
		this.workbook = XLSX.readFile("data/data.xlsx");
		this.sheetName = this.workbook.SheetNames[0]
		this.worksheet = this.workbook.Sheets[this.sheetName]
		this.jsonWorkSheet = XLSX.utils.sheet_to_json( this.worksheet );
		this.obj = {
			'дата': 44896,
    'сумма': 215.99,
    'вид': 'бригады',
    'люди': 'Алеша Поповч',
    'титул': 'мозги',
    'объект': 'Кудыкина гора',
    'бригады': 'Бригада Святослава Ярополковича'
		}
	}

	testFunc() {
		this.jsonWorkSheet.push(this.obj)
		XLSX.utils.sheet_add_json(this.worksheet, this.jsonWorkSheet)
		XLSX.writeFile(this.workbook, "data/data.xlsx");		
	}
}

module.exports = {
	TableInfo
}