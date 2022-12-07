const {  Bot,  session,  InputFile} = require("grammy");
const {  hydrateFiles} = require("@grammyjs/files");
const {getDate} = require("./functions")
const {newNote, category, brigadesList, objectsList, expenseList} = require("./keyabords")
require("dotenv").config();

const token = process.env.BOT_TOKEN;
const bot = new Bot(token);
bot.api.config.use(hydrateFiles(token));


function initial() {
    return {
        state:{
            getSum:false,
            getBrigades:false,
            getObject:false,
            getExpense: false
        },
        currBrigade:'',
        currObject: '',
        currExpense: '',
        currSum: 0
    };
}

bot.use(session({initial}));

bot.command("start", ctx => {
    ctx.reply(`Для начала нажмите "Новая запись"`, {reply_markup:newNote})
})

bot.hears("Новая запись", ctx => {
    ctx.reply(`Сегодня ${getDate()}
Введите сумму`, {reply_markup:{remove_keyboard:true}})
ctx.session.state.getSum = true
})

bot.hears("Бригады", ctx => {
    ctx.reply(`Выберете бригаду`, {remove_keyboard:true, reply_markup: brigadesList}) // ? Клаваитура не исчезает
    ctx.session.state.getBrigades = true;
})
bot.hears("Люди", ctx => {
    ctx.reply(`Выберете имя`)
})
bot.hears("Общее", ctx => {
    ctx.reply(`Выберете объект`)
})

bot.hears(/[0-9]/, ctx => {
    if(ctx.session.state.getSum){
        ctx.session.currSum = ctx.update.message.text
        ctx.reply(`Сегодня ${getDate()}
Сумма: ${ctx.session.currSum}

Выберете категорию:`, {reply_markup:category})
    }
})

bot.on("callback_query:data", ctx=>{
    data = ctx.callbackQuery.data;
    if(ctx.session.state.getBrigades){
        ctx.session.currBrigade = data
        ctx.session.state.getBrigades = false
        ctx.reply(`Выберете объект`, {reply_markup:objectsList})
        ctx.session.state.getObject = true;
    }else if(ctx.session.state.getObject){
        ctx.session.currObject = data
        ctx.session.state.getObject = false;
        ctx.reply(`Выберете расход`, {reply_markup:expenseList})
        ctx.session.state.getExpense = true
    }else if(ctx.session.state.getExpense){
        ctx.session.currExpense = data;

        ctx.reply(`Сегодня ${getDate()}
Сумма: ${ctx.session.currSum}
Бригада: ${ctx.session.currBrigade}
Объект: ${ctx.session.currObject}
Расход: ${ctx.session.currExpense}
`, {reply_markup:newNote})
    }

    
})

bot.start();

