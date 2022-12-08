const { Keyboard, InlineKeyboard, Bot } = require("grammy");
const { Menu, MenuRange } = require("@grammyjs/menu");
const { text } = require("node:stream/consumers");


const newNote = new Keyboard()
.text("Новая запись").resized()

const category = new Keyboard()
.text("Бригады").row()
.text("Люди").row()
.text("Общее")

const brigadesList = new Keyboard()
.text("Бригада Игоря")
.row()
.text("Бригада Лелюка")
.row()
.text("Бригада Миши")
.row()
.text("Mykola i Oleksii")
.row()
.text("Shartukh Anton i Aliaksandr")
.row()
.text("Назад")
.resized()


const objectsList = new Keyboard()
.text("GIPS Karpacz")
.row()
.text("MCM project")
.row()
.text("Karpacz")
.row()
.text("Skysawa")
.row()
.text("Novisa")
.row()
.text("Office")
.row()
.text("Назад")
.resized()

const expenseList = new Keyboard()
.text("Топливо")
.row()
.text("Инструмент")
.row()
.text("Жилье")
.row()
.text("Материал")
.row()
.text("Проезд - билеты")
.row()
.text("Аванс")
.row()
.text("Зарплата")
.row()
.text("Страховки на авто")
.row()
.text("Почта")
.row()
.text("Ксеро")
.row()
.text("Назад")
.resized()

const peopleList = new Keyboard()
.text("Андрей - керовник")
.row()
.text("Богдан")
.row()
.text("Владислав")
.row()
.text("Lelyuk Alexandr")
.row()
.text("Bayutsin Igor")
.row()
.text("Zyben Mikhail")
.row()
.text("Tarasiuk Oleksandr")
.row()
.text("Opaliukh Yurii")
.row()
.text("Statsenka Aliaksandr")
.row()
.text("Dranyk Oleksandr")
.row()
.text("Morhalenko Dmytro")
.row()
.text("Zorii Sviatoslav")
.row()
.text("Андрийко")
.row()
.text("подработка")
.row()
.text("Александра")
.row()
.text("Анастасия PM")
.row()
.text("Дима HR")
.row()
.text("Валерий")
.row()
.text("Tsishkou Dmitry")
.row()
.text("Koushyk Petr")
.row()
.text("Назад")
.resized()

module.exports = {
    newNote,
    category,
    brigadesList,
    objectsList,
    expenseList,
    peopleList
}