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

module.exports = {
    getDate,
    feeldToggle
}