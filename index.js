const {
  Bot,
  session,
  InputFile
} = require("grammy");
const {
  hydrateFiles
} = require("@grammyjs/files");
const {
  getDate,
  feeldToggle,
  stateToggle
} = require("./functions")
const {
  newNote,
  category,
  brigadesList,
  objectsList,
  expenseList,
  peopleList
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
const tableInfo = new TableInfo();


function initial() {
  return {
    state: {
      getSum: false,
      getBrigades: false,
      getObject: false,
      getExpense: false,
      getName: false
    },
    currBrigade: '',
    currObject: '',
    currExpense: '',
    currName: '',
    currSum: 0,
    prevState: ''
  };
}

bot.use(session({
  initial
}));

bot.command("start", ctx => {

  tableInfo.testFunc()

  ctx.reply(`Для начала нажмите "Новая запись"`, {
    reply_markup: newNote
  })

  ctx.session.currBrigade = '';
  ctx.session.currName = '';
  ctx.session.prevState = '';
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

bot.hears("Назад", ctx => {
  if (ctx.session.state.getBrigades || ctx.session.state.getName) {
    convers.startNewNote(ctx, getDate)
    stateToggle(ctx, "getSum")
  }

  if (ctx.session.state.getObject) {
    if (ctx.session.prevState == "getName") {
      convers.chooseName(ctx, peopleList)
      stateToggle(ctx, "getName")
    } else if (ctx.session.prevState == "getBrigades") {
      convers.chooseBrigade(ctx, brigadesList)
      stateToggle(ctx, "getBrigades")
    } else if (ctx.session.prevState == "getSum") {
      convers.startNewNote(ctx, getDate)
      stateToggle(ctx, "getSum")
    }
  }
})

bot.hears(/[0-9]/, ctx => {
  if (ctx.session.state.getSum) {
    ctx.session.currSum = ctx.update.message.text
    ctx.reply(`Сегодня ${getDate()}
Сумма: ${ctx.session.currSum}

Выберете категорию:`, {
      reply_markup: category
    })
  }
})

bot.on('msg:text', ctx => {
  let data = ctx.update.message.text

  if (ctx.session.state.getBrigades) {
    ctx.session.currBrigade = data;
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

    ctx.reply(`Сегодня ${getDate()}
Сумма: ${ctx.session.currSum} ${feeldToggle(ctx.session.currBrigade, ctx.session.currName)}
Объект: ${ctx.session.currObject}
Расход: ${ctx.session.currExpense}
`, {
      reply_markup: newNote
    })

    ctx.session.state.getExpense = false;
    ctx.session.currBrigade = '';
    ctx.session.currName = '';
    ctx.session.prevState = '';
  }
})

bot.start();