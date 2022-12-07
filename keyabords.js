const { Keyboard, InlineKeyboard, Bot } = require("grammy");
const { Menu, MenuRange } = require("@grammyjs/menu");
const {brigades,people,objects} = require("./inform");
const { text } = require("node:stream/consumers");


const newNote = new Keyboard()
.text("Новая запись").resized()

const category = new Keyboard()
.text("Бригады").row()
.text("Люди").row()
.text("Общее")

//! инлайн клавиатуры без range

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
.resized()

// const brigadesList = new Menu('dynamic', {autoAnswer: false})
// .dynamic((ctx, range)=>{
//     for(const brigade of brigades){
//         range
//         .text(brigade, ctx => {
//             ctx.session.currBrigade = brigade
//             ctx.reply(`Бригады`, {reply_markup: objectsList})      
//         }).row()
//     }
// })

// const objectsList = new Menu('dynamic_2')
// .dynamic((ctx, range)=>{
//     for(const object of objects){
//         range.text(object, ctx =>{
//             ctx.session.currObject = object
//         })
//     }
// })


module.exports = {
    newNote,
    category,
    brigadesList,
    objectsList,
    expenseList
}