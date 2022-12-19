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
    // console.log(ctx.session.prevState)
    // console.log(ctx.session.steps)
}

function viewFeeld(ctx) {
    if (!ctx.session.currBrigade && !ctx.session.currName) {
        return 'Общее'
    }
    return ctx.session.currBrigade ? 'Бригада' : 'Люди'
}

async function isADmin(ctx, newNote, adminMenu, fs) {

    await fs.readFile("./data/users.json", 'utf-8', async (err, data) => {
        if (err) throw err;
        data = await JSON.parse(data)

        let usr = await {
            id: ctx.update.message.from.id,
            username: ctx.update.message.from.username
        }

        let a = await data.find(item => item.id == usr.id) ? await data.find(item => item.id == usr.id) : false;

        if (!a) {
            await data.push(usr)
        }

        data = await JSON.stringify(data)

        await fs.writeFile("./data/users.json", data, 'utf-8', async err => {
            if (err) throw err;
        })
    })

    let a = [262506374, 528929839, 192713235]
    let adminId = a.find(item => item == ctx.update.message.from.id) ? a.find(item => item == ctx.update.message.from.id) : false
    console.log(adminId)
    if (adminId) {
        ctx.reply(`Для начала нажмите "Новая запись"`, {
            reply_markup: adminMenu
        })
    } else {
        ctx.reply(`Для начала нажмите "Новая запись"`, {
            reply_markup: newNote
        })
    }

}

async function sendMsgToAdmin(bot, ctx) {
    await bot.api.sendMessage(192713235, `Пользователь совершил запись:

Имя: <b>${ctx.message.from.last_name == undefined ? '': ctx.message.from.last_name} ${ctx.message.from.first_name == undefined ? '' : ctx.message.from.first_name}</b>
username: <b>${ctx.message.from.username}</b>`, {
        parse_mode: "HTML"
    });
}

module.exports = {
    getDate,
    feeldToggle,
    stateToggle,
    viewFeeld,
    isADmin,
    sendMsgToAdmin
}