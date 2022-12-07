function getDate (){
    const date = new Date();

    return `${date.getDate() < 9 ? '0' + date.getDate() : date.getDate()}.${date.getMonth()}.${date.getFullYear()}`
}

module.exports = {
    getDate
}