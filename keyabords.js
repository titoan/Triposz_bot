const { Keyboard, InlineKeyboard } = require("grammy");
const { Menu, MenuRange } = require("@grammyjs/menu");

const newNote = new Keyboard()
.text("Новая запись").resized()

const category = new Keyboard()
.text("Бригады").row()
.text("Люди").row()
.text("Общее")

module.exports = {
    newNote,
    category
}