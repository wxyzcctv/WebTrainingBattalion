function match(str) {
    let state = start;
    for (let item of str) {
        state = state(item)
    }
    return state === end
}
function start(item) {
    if (item === 'a') {
        return foundA
    } else {
        return start
    }
}
function end(item) {
    return end
}
function foundA(item) {
    if (item === 'b') {
        return foundB;
    } else {
        return start(item)
    }
}
function foundB(item) {
    if (item === 'c') {
        return foundC;
    } else {
        return start(item)
    }
}
function foundC(item) {
    if (item === 'd') {
        return foundD;
    } else {
        return start(item)
    }
}
function foundD(item) {
    if (item === 'e') {
        return foundE;
    } else {
        return start(item)
    }
}
function foundE(item) {
    if (item === 'f') {
        return end;
    } else {
        return start(item)
    }
}
console.log(match('ababcdefg'));