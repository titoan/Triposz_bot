const XLSX = require("xlsx");

function TableInfo() {
	this.workbook = XLSX.readFile("data/data.xlsx");
	this.sheetName = this.workbook.SheetNames[0]
	this.worksheet = this.workbook.Sheets[this.sheetName]
	this.jsonWorkSheet = XLSX.utils.sheet_to_json(this.worksheet);
	

	this.writeToTable = async (obj) => {

// ? Ещё раз инициализируем json массив с даннвми из таблицы. Чтобы подтягивать последние изменения
this.jsonWorkSheet = XLSX.utils.sheet_to_json(this.worksheet);

		obj["Сумма"] = await obj["Сумма"].replace(/[.]/, ',');

		await this.jsonWorkSheet.push(obj);

		await console.log(this.jsonWorkSheet)
		await XLSX.utils.sheet_add_json(this.worksheet, this.jsonWorkSheet);

		await XLSX.utils.sheet_add_aoa(this.worksheet, [["Дата", "Сумма", "Вид","Люди","Титул","Объект","Бригады"]], { origin: "A1" })

		this.worksheet["!cols"] = await [ { wch: 15 },{ wch: 15 },{ wch: 15 },{ wch: 20 },{ wch: 20 },{ wch: 15 },{ wch: 25 } ]; 

		await XLSX.writeFile(this.workbook, "data/data.xlsx");
	}
}

module.exports = {
	TableInfo
}