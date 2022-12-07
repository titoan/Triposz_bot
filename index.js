const {  Bot,  session,  InputFile} = require("grammy");
const {  hydrateFiles} = require("@grammyjs/files");
const {getDate} = require("./functions")
const {newNote, category} = require("./keyabords")
require("dotenv").config();

const token = process.env.BOT_TOKEN;
const bot = new Bot(token);
bot.api.config.use(hydrateFiles(token));


function initial() {
    return {

    };
}

bot.use(session({initial}));

bot.command("start", ctx => {
    ctx.reply(`Для начала нажмите "Новая запись"`, {reply_markup:newNote})
})

bot.hears("Новая запись", ctx => {
    ctx.reply(`Сегодняшняя дата ${getDate()}
Выберете категорию расхода`, {reply_markup: category})
})

bot.hears("Бригады", ctx => {
    ctx.reply(`Выберете бригаду`)
})
bot.hears("Люди", ctx => {
    ctx.reply(`Выберете имя`)
})
bot.hears("Общее", ctx => {
    ctx.reply(`Выберете объект`)
})

bot.start();