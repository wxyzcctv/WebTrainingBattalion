function match(str) {
    for (let item of str) {
        if (item === 'a') {
            return true
        }
    }
    return false
}
console.log(match('I am xxx'));