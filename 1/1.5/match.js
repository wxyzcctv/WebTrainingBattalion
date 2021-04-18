function match(str) {
    let haveA = false;
    let haveB = false;
    let haveC = false;
    let haveD = false;
    let haveE = false;
    for (let item of str) {
        if (item === 'a') {
            haveA = true
        } else if (haveA && item === 'b') {
            haveB = true
            haveA = false
        } else if (haveB && item === 'c') {
            haveB = false
            haveC = true
        } else if (haveC && item === 'd') {
            haveC = false
            haveD = true
        } else if (haveD && item === 'e') {
            haveD = false
            haveE = true
        } else if (haveE && item === 'f') {
            return true
        } else {
            haveA = false;
            haveB = false;
            haveC = false;
            haveD = false;
            haveE = false
        }
    }
    return false
}
console.log(match("I am abcdef"));