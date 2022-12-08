class Conversation{
    constructor(){}

    startNewNote(ctx, getDate){
        ctx.reply(`Сегодня ${getDate()}
Введите сумму`, {reply_markup:{remove_keyboard:true}})        
    }

    chooseBrigade(ctx, brigadesList){
        ctx.reply(`Выберете бригаду`, { reply_markup: brigadesList})        
    }

    chooseName(ctx, peopleList){
        ctx.reply(`Выберете имя`, {reply_markup: peopleList})        
    }

    chooseGeneral(ctx, objectsList){
        ctx.reply(`Выберете объект`, {reply_markup:objectsList})
    }
}

module.exports = {
    Conversation
}