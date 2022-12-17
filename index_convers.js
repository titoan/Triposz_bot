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
  stateToggle,
  viewFeeld,
  isADmin
} = require("./functions")
const {
  newNote,
  category,
  brigadesList,
  objectsList,
  expenseList,
  peopleList,
  writeRes,
  adminMenu
} = require("./keyabords")
const {
  Conversation
} = require("./conversation")
const {
  conversations,
  createConversation
} = require("@grammyjs/conversations");
const {
  TableInfo
} = require("./dataObj")

require("dotenv").config();

const token = process.env.BOT_TOKEN;
const bot = new Bot(token);
bot.api.config.use(hydrateFiles(token));

const convers = new Conversation();
let tableInfo;


function currSession() {
  return {
    state: {
      getSum: false,
      getBrigades: false,
      getObject: false,
      getExpense: false,
      getName: false,
      writeRes: false
    },
    currBrigade: '',
    currObject: '',
    currExpense: '',
    currName: '',
    currSum: 0,
    prevState: '',
    steps: []
  };
}


bot.use(session({
  initial: () => ({
    state: {
      getSum: false,
      getBrigades: false,
      getObject: false,
      getExpense: false,
      getName: false,
      writeRes: false
    },
    currBrigade: '',
    currObject: '',
    currExpense: '',
    currName: '',
    currSum: 0,
    prevState: '',
    steps: []
  })
}));

// bot.use(session({ initial}));
// bot.use(session({
//   type: "multi",
//   forConvers: {
//     initial: () => ({

//     })
//   },
//   currSession:{
//     initial:() => ({
//       state: {
//         getSum: false,
//         getBrigades: false,
//         getObject: false,
//         getExpense: false,
//         getName: false,
//         writeRes:false
//       },
//       currBrigade: '',
//       currObject: '',
//       currExpense: '',
//       currName: '',
//       currSum: 0,
//       prevState: '',
//       steps: []
//     })
//   }
// }))

bot.use(conversations(brigades));
bot.use(createConversation(brigades));

async function brigades(conversation, ctx) {
  ctx.reply(`Выберете бригаду`, {
    reply_markup: brigadesList
  });
  ctx = await conversation.wait();
  ctx.session.currBrigade = ctx.update.message.text

  ctx.reply(`Выберете объект`, {
    reply_markup: objectsList
  })
  ctx = await conversation.wait();
  ctx.session.currObject = ctx.update.message.text

  ctx.reply(`Выберете расход`, {reply_markup: expenseList})
  ctx = await conversation.wait();
  ctx.session.currExpense = ctx.update.message.text

  ctx.reply(`Сегодня ${getDate()}
Сумма: ${ctx.session.currSum} ${feeldToggle(ctx.session.currBrigade, ctx.session.currName)}
Объект: ${ctx.session.currObject}
Расход: ${ctx.session.currExpense}
`, {
      reply_markup: writeRes
    })

  console.log(ctx.session)
}

bot.command("start", ctx => {

  tableInfo = new TableInfo();
  isADmin(ctx, newNote, adminMenu)

  // ! Переместить текущие значения в отдельный объект сессии. Функция-обработчик => Обнуляет все значения сессии при сарте и новой записи (А надо ли?)
  ctx.session.currBrigade = '';
  ctx.session.currName = '';
  ctx.session.prevState = '';
})

bot.hears("Новая запись", ctx => {

  convers.startNewNote(ctx, getDate)

  stateToggle(ctx, "getSum")

  ctx.session.steps = [];
  ctx.session.prevState = '';
  ctx.session.currBrigade = '';
  ctx.session.currName = '';
})

bot.hears("Бригады", async ctx => {
  // convers.chooseBrigade(ctx, brigadesList)
  // stateToggle(ctx, "getBrigades")

  await ctx.conversation.enter("brigades")
  console.log(ctx.session.conversation.brigades[0].log.u[0])
})
bot.hears("Люди", ctx => {
  convers.chooseName(ctx, peopleList)
  stateToggle(ctx, "getName")
})
bot.hears("Общее", ctx => {
  convers.chooseGeneral(ctx, objectsList)
  stateToggle(ctx, "getObject")
})

bot.hears("Записать результат", ctx => {
  if (ctx.session.state.writeRes) {

    let currObj = {
      'Дата': `${getDate()}`,
      'Сумма': ctx.session.currSum,
      'Вид': `${viewFeeld(ctx)}`,
      'Люди': ctx.session.currName ? ctx.session.currName : '',
      'Титул': ctx.session.currExpense,
      'Объект': ctx.session.currObject,
      'Бригады': ctx.session.currBrigade ? ctx.session.currBrigade : ''
    }

    tableInfo.writeToTable(currObj)
    ctx.session.state.getExpense = false;

    ctx.session.currBrigade = '';
    ctx.session.currName = '';
    ctx.session.prevState = '';
    ctx.session.steps = []

    // ctx.reply('Результат записан', {reply_markup: newNote})
    ctx.reply('Результат записан')
    isADmin(ctx, newNote, adminMenu)
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

  if (ctx.session.state.getExpense) {
    if (ctx.session.prevState == "getObject" || ctx.session.prevState == "writeRes") {
      stateToggle(ctx, "getObject")
      convers.chooseObject(ctx, objectsList)
    }
    if (ctx.session.steps[1] == "getObject") {
      convers.startNewNote(ctx, getDate)

      stateToggle(ctx, "getSum")

      ctx.session.steps = [];
      ctx.session.prevState = '';
      ctx.session.currBrigade = '';
      ctx.session.currName = '';
    }
  }

  if (ctx.session.state.writeRes) {
    if (ctx.session.prevState == "getExpense") {
      stateToggle(ctx, "getExpense")
      convers.chooseExpense(ctx, expenseList)
    }
  }

})

bot.hears("Получить таблицу", async ctx => {
  try {
    await ctx.replyWithDocument(new InputFile("./data/data.xlsx"));
  } catch (err) {
    ctx.reply(`${err.description}`);
  }
})


bot.hears(/[0-9]/, ctx => {
  try {
    if (ctx.session.state.getSum) {
      ctx.session.currSum = ctx.update.message.text
      ctx.reply(`Сегодня ${getDate()}
  Сумма: ${ctx.session.currSum}
  
  Выберете категорию:`, {
        reply_markup: category
      })
    }
  } catch (err) {
    console.log(err)
  }

})

bot.on('msg:text', ctx => {
  let data = ctx.update.message.text

  if (ctx.session.state.getBrigades) {
    // ctx.session.currBrigade = data;
    // convers.chooseObject(ctx, objectsList)
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
      reply_markup: writeRes
    })
    stateToggle(ctx, "writeRes")
  }
})

bot.start();