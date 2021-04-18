// 1-5-1
/*
function match(str) {
    let state = start;
    for (let item of str) {
        state = state(item)
    }
    return state === end
}
function start(item) {
    if (item === 'a') {
        return foundFA
    } else {
        return start
    }
}
function end(item) {
    return end
}
function foundFA(item) {
    if (item === 'b') {
        return foundFB;
    } else {
        return start(item)
    }
}
function foundFB(item) {
    if (item === 'c') {
        return foundC;
    } else {
        return start(item)
    }
}
function foundC(item) {
    if (item === 'a') {
        return foundSA;
    } else {
        return start(item)
    }
}
function foundSA(item) {
    if (item === 'b') {
        return foundSB;
    } else {
        return start(item)
    }
}
function foundSB(item) {
    if (item === 'x') {
        return end;
    } else {
        return foundFB(item)
    }
}
console.log(match('abcabcabx'));
*/
// 1-5-2
function match(str) {
    let state = start;
    for (let item of str) {
        state = state(item)
    }
    return state === end
}
function start(item) {
    if (item === 'a') {
        return foundA1
    } else {
        return start
    }
}
function end(item) {
    return end
}
function foundA1(item) {
    if (item === 'b') {
        return foundB1;
    } else {
        return start(item)
    }
}
function foundB1(item) {
    if (item === 'a') {
        return foundA2;
    } else {
        return start(item)
    }
}
function foundA2(item) {
    if (item === 'b') {
        return foundB2;
    } else {
        return start(item)
    }
}
function foundB2(item) {
    if (item === 'a') {
        return foundA3;
    } else {
        return start(item)
    }
}
function foundA3(item) {
    if (item === 'b') {
        return foundB3;
    } else {
        return start(item)
    }
}
function foundB3(item) {
    if (item === 'x') {
        return end;
    } else {
        return foundB2(item)
    }
}
console.log(match('abababx'));