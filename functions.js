function getDate (){
    const date = new Date();

    return `${date.getDate() < 9 ? '0' + date.getDate() : date.getDate()}.${date.getMonth()}.${date.getFullYear()}`
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
        if(currState.toLowerCase() == stateName.toLowerCase()){
            states[currState] = true
        }else{
            states[currState] = false
        }        
    }

    console.log(states)
}

module.exports = {
    getDate,
    feeldToggle,
    stateToggle
}