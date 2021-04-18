function match(str) {
    let haveA = false
    for (let item of str) {
        if (item === 'a') {
            haveA = true
        } else if (haveA && item === 'b') {
            return true
        } else {
            haveA = false
        }
    }
    return false
}
console.log(match('I am acbc'));