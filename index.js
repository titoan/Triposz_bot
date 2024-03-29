const {
  Bot,
  session,
  InputFile
} = require("grammy");
const {
  hydrateFiles
} = require("@grammyjs/files");
const fs = require("fs")
const {
  getDate,
  feeldToggle,
  stateToggle,
  viewFeeld,
  isADmin,
  sendMsgToAdmin, 
} = require("./functions")
const {
  newNote,
  category,
  brigadesList,
  objectsList,
  expenseList,
  peopleList,
  writeRes,
  adminMenu,
  currency
} = require("./keyabords")
const {
  Conversation
} = require("./conversation")
const {TableInfo} = require("./dataObj")

require("dotenv").config();

const token = process.env.BOT_TOKEN;
const bot = new Bot(token);
bot.api.config.use(hydrateFiles(token));

const convers = new Conversation();
let tableInfo = new TableInfo();


function initial() {
  return {
    state: {
      getSum: false,
      getBrigades: false,
      getObject: false,
      getExpense: false,
      getName: false,
      writeRes:false,
      getCurrence:false,
      stop: false
    },        
      steps: [],
      currData: []
  };
}

bot.use(session({initial}));

bot.command("start", ctx => {  

  tableInfo = new TableInfo();
  isADmin(ctx, newNote, adminMenu, fs)

// ! Переместить текущие значения в отдельный объект сессии. Функция-обработчик => Обнуляет все значения сессии при сарте и новой записи (А надо ли?)
  ctx.session.currBrigade = '';
  ctx.session.currName = '';
  ctx.session.prevState = '';
  ctx.session.currComment = '';
})

bot.hears("Новая запись", ctx => {

  convers.startNewNote(ctx, getDate)

  stateToggle(ctx, "getSum")
})
bot.hears("Бригады", ctx => {
  convers.chooseBrigade(ctx, brigadesList)
  stateToggle(ctx, "getBrigades")
})
bot.hears("Люди", ctx => {
  convers.chooseName(ctx, peopleList)
  stateToggle(ctx, "getName")
})
bot.hears("Общее", ctx => {
  convers.chooseGeneral(ctx, objectsList)
  stateToggle(ctx, "getObject")
})
bot.hears("Записать результат", async ctx=>{
  if(ctx.session.state.writeRes){

    let currObj = {
      'Дата': `${getDate()}`,
      "PLN": ctx.session.currence === "PLN" ? ctx.session.currSum : "",
      "EUR":ctx.session.currence === "EUR" ? ctx.session.currSum : "",      
			'Люди': ctx.session.currName ? ctx.session.currName : '',
			'Титул': ctx.session.currExpense,
			'Объект': ctx.session.currObject,
			'Бригады': ctx.session.currBrigade ? ctx.session.currBrigade : '',
      'ФИО': `${ctx.message.from.last_name == undefined ? '': ctx.message.from.last_name} ${ctx.message.from.first_name == undefined ? '' : ctx.message.from.first_name}; ${ctx.message.from.username}`,
      'Комментарий': `${ctx.session.currComment == undefined ? '' : ctx.session.currComment}`,
    }
    
    tableInfo.writeToTable(currObj);

    ctx.session.state.getExpense =  false;
    // ! СЮДА clearCurrValues()
    ctx.session.currBrigade =  '';
    ctx.session.currName =  '';
    ctx.session.prevState =  '';
    ctx.session.currComment ='';
    ctx.session.steps =  [];

    await ctx.reply('Результат записан');    
    await sendMsgToAdmin(bot,ctx, currObj)
    await isADmin(ctx, newNote, adminMenu, fs);
  }
})
bot.hears("Назад", ctx => {
  if (ctx.session.state.getBrigades || ctx.session.state.getName) {

    convers.startNewNote(ctx, getDate)    

    stateToggle(ctx, "getSum")

    ctx.session.steps = [];
    ctx.session.prevState = '';
    ctx.session.currBrigade = '';
    ctx.session.currName = '';
  }

  if (ctx.session.state.getObject) {
    if (ctx.session.prevState == "getName" || ctx.session.steps[1] == "getName") {
      convers.chooseName(ctx, peopleList)
      stateToggle(ctx, "getName")
    } else if (ctx.session.prevState == "getBrigades" || ctx.session.steps[1] == "getBrigades") {
      convers.chooseBrigade(ctx, brigadesList)
      stateToggle(ctx, "getBrigades")
    } else if (ctx.session.prevState == "getSum") {

      convers.startNewNote(ctx, getDate)

      stateToggle(ctx, "getSum")

      ctx.session.steps = [];
      ctx.session.prevState = '';
      ctx.session.currBrigade = '';
      ctx.session.currName = '';
    }
  }

  if(ctx.session.state.getExpense){
    if(ctx.session.prevState == "getObject" || ctx.session.prevState == "writeRes"){
      stateToggle(ctx, "getObject")
      convers.chooseObject(ctx, objectsList)
    }
    if(ctx.session.steps[1] == "getObject"){
      convers.startNewNote(ctx, getDate)

      stateToggle(ctx, "getSum")

      ctx.session.steps = [];
      ctx.session.prevState = '';
      ctx.session.currBrigade = '';
      ctx.session.currName = '';
    }
  }

  if(ctx.session.state.writeRes){
    if(ctx.session.prevState == "getExpense"){
      stateToggle(ctx, "getExpense")
      convers.chooseExpense(ctx, expenseList)
    }
  }

})
bot.hears("Стоп", ctx => {
  stateToggle(ctx, "stop")
  if(ctx.session.state.stop){
    tableInfo = new TableInfo();
    isADmin(ctx, newNote, adminMenu, fs)
    ctx.session.steps = [];
    ctx.session.prevState = '';
    ctx.session.currBrigade = '';
    ctx.session.currName = '';
  }
})
bot.hears("Получить таблицу", async ctx =>{
  try {
    await ctx.replyWithDocument(new InputFile("./data/data.xlsx"));
  } catch (err) {
    ctx.reply(`${err.description}`);    
  }
})
bot.hears("Свой вариант", async ctx => {  
  if (ctx.session.state.getExpense){
    await ctx.reply("Введите типа расхода:", {reply_markup:{remove_keyboard:true}})
  }
})

bot.hears(/[0-9]/, ctx => {
  data = ctx.message.text
  if (ctx.session.state.getSum) {
    ctx.session.currSum = ctx.update.message.text
    ctx.reply(`Сегодня ${getDate()}
Сумма: ${ctx.session.currSum}

Выберете валюту:`, {
      reply_markup: currency
    })
    stateToggle(ctx, "getCurrence")
  }
  if (ctx.session.state.getExpense){
    ctx.session.currExpense = data;
    convers.getTotalRes(ctx, getDate, feeldToggle, writeRes)
    stateToggle(ctx, "writeRes")
  }
  if (ctx.session.state.writeRes){
    ctx.session.currComment = data
    convers.getTotalRes(ctx, getDate, feeldToggle, writeRes)
  }
})
bot.hears("Оставить комментарий", async ctx => {
  if (ctx.session.state.writeRes){
    await ctx.reply("Напишите ваш комментарий:", {reply_markup:{remove_keyboard:true}})
  }
})
bot.on('message', ctx => {  
  let data = ctx.update.message.text

  if (ctx.session.state.getBrigades) {
    ctx.session.currBrigade = data;
    console.log(ctx.session)
    
    convers.chooseObject(ctx, objectsList)
    stateToggle(ctx, "getObject")
  } else if (ctx.session.state.getName) {
    ctx.session.currName = data;
    convers.chooseObject(ctx, objectsList)
    stateToggle(ctx, "getObject")
  } else if (ctx.session.state.getObject) {
    ctx.session.currObject = data;
    convers.chooseExpense(ctx, expenseList)
    stateToggle(ctx, "getExpense")
  } else if (ctx.session.state.getExpense) {

    ctx.session.currExpense = data;    
    convers.getTotalRes(ctx, getDate, feeldToggle, writeRes)
    stateToggle(ctx, "writeRes")
  }else if (ctx.session.state.writeRes){
    ctx.session.currComment = data
    convers.getTotalRes(ctx, getDate, feeldToggle, writeRes)
  }else if(ctx.session.state.getCurrence){
    ctx.session.currence = data;
    ctx.reply(`Выберете категорию:`, {
      reply_markup: category
    })
  }
})

bot.start();