const {  Bot,  session,  InputFile} = require("grammy");
const {  hydrateFiles} = require("@grammyjs/files");

const token = process.env.BOT_TOKEN;
const bot = new Bot(token);
bot.api.config.use(hydrateFiles(token));


function initial() {
    return {

    };
}

bot.use(session({initial}));