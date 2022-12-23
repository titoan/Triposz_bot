class Conversation {
	constructor() {}

	startNewNote(ctx, getDate) {
		ctx.reply(`Сегодня ${getDate()}
Введите сумму`, {
			reply_markup: {
				remove_keyboard: true
			}
		})
	}

	chooseBrigade(ctx, brigadesList) {
		ctx.reply(`Выберете бригаду`, {
			reply_markup: brigadesList
		})
	}

	chooseName(ctx, peopleList) {
		ctx.reply(`Выберете имя`, {
			reply_markup: peopleList
		})
	}

	chooseGeneral(ctx, objectsList) {
		ctx.reply(`Выберете объект`, {
			reply_markup: objectsList
		})
	}

	chooseObject(ctx, objectsList) {
		ctx.reply(`Выберете объект`, {
			reply_markup: objectsList
		})
	}

	chooseExpense(ctx, expenseList) {
		ctx.reply(`Выберете расход`, {
			reply_markup: expenseList
		})
	}

	getTotalRes(ctx, getDate, feeldToggle, writeRes) {
		ctx.reply(`Сегодня ${getDate()}
Сумма: ${ctx.session.currSum} ${feeldToggle(ctx.session.currBrigade, ctx.session.currName)}
Объект: ${ctx.session.currObject}
Расход: ${ctx.session.currExpense}
щіш	${ctx.session.currComment ? `Комментарий: ${ctx.session.currComment}` : ''}
    `, {
			reply_markup: writeRes
		})
	}
}

module.exports = {
	Conversation
}