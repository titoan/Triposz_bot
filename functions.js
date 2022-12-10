function getDate() {
    const date = new Date();

    return `${date.getDate() <= 9 ? '0' + date.getDate() : date.getDate()}.${date.getMonth()}.${date.getFullYear()}`
}

function feeldToggle(brigade, name) {
    if (!(brigade || name)) {
        return ''
    } else {
        return `\n${brigade ? 'Бригада:' + brigade : "Имя:" + name}`
    }
}

function stateToggle(ctx = {}, stateName = '') {
    let states = ctx.session.state
    for (const currState in states) {
        if (states[currState]) {
            ctx.session.prevState = currState;
            ctx.session.steps.push(currState)
        }

        if (currState.toLowerCase() == stateName.toLowerCase()) {
            states[currState] = true
        } else {
            states[currState] = false
        }
    }
    console.log(ctx.session.prevState)
    console.log(ctx.session.steps)
}

function viewFeeld(ctx) {
    if (!ctx.session.currBrigade && !ctx.session.currName) {
        return 'Общее'
    }
    return ctx.session.currBrigade ? 'Бригада' : 'Люди'
}

function isADmin(ctx, newNote, adminMenu) {
    if (ctx.update.message.from.id == 192713235) {
        ctx.reply(`Для начала нажмите "Новая запись"`, {
            reply_markup: adminMenu
        })
    } else {
        ctx.reply(`Для начала нажмите "Новая запись"`, {
            reply_markup: newNote
        })
    }
}

module.exports = {
    getDate,
    feeldToggle,
    stateToggle,
    viewFeeld,
    isADmin
}