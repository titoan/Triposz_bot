function getDate (){
    const date = new Date();

    return `${date.getDate() <= 9 ? '0' + date.getDate() : date.getDate()}.${date.getMonth()}.${date.getFullYear()}`
}

function feeldToggle(brigade, name){
    if(!(brigade || name)){
        return ''
    }else{
        return `\n${brigade ? 'Бригада:' + brigade : "Имя:" + name}`
    }
}

function stateToggle(ctx, stateName){
    let states = ctx.session.state
    for(const currState in states){
        if(states[currState]){
            ctx.session.prevState = currState
        }

        if(currState.toLowerCase() == stateName.toLowerCase()){
            states[currState] = true
        }else{
            states[currState] = false
        }        
    }    
}

function viewFeeld(ctx){
    if(!ctx.session.currBrigade && !ctx.session.currName){
        return 'Общее'
    }
    return ctx.session.currBrigade ? 'Бригада' : 'Люди'
}

module.exports = {
    getDate,
    feeldToggle,
    stateToggle,
    viewFeeld
}