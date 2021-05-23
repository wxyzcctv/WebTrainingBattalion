import { scan } from './LexParser.js'

let syntax = {
    Program: [["StatementList"]],
    StatementList: [
        ["Statement"],
        ["StatementList", "Statement"]
    ],
    Statement: [
        ["ExpressionStatement"],
        ["IfStatement"],
        ["VariableDeclaration"],
        ["FuntionDeclaration"]
    ],
    IfStatement: [
        ["if", "(", "Expression", ")", "Statement"]
    ],
    VariableDeclaration: [
        ["var", "Identifier", ";"],
        ["let", "Identifier", ";"]
    ],
    FuntionDeclaration: [
        ["function", "Identifier", "(", ")", "{", "StatementList", "}"]
    ],
    ExpressionStatement: [
        ["Expression", ";"]
    ],
    Expression: [
        ["AdditiveExpression"]
    ],
    AdditiveExpression: [
        ["MultiplicativeExpression"],
        ["AdditiveExpression", "+", "MultiplicativeExpression"],
        ["AdditiveExpression", "-", "MultiplicativeExpression"],
    ],
    MultiplicativeExpression: [
        ["PrimaryExpression"],
        ["MultiplicativeExpression", "+", "PrimaryExpression"],
        ["MultiplicativeExpression", "-", "PrimaryExpression"],
    ],
    PrimaryExpression: [
        ["(", "Expression", ")"],
        ["Literal"],
        ["Identifier"]
    ],
    Literal: [
        ["Number"]
    ]
}

let hash = {

}

function closure(state) {
    hash[JSON.stringify(state)] = state
    let queue = [];
    // 遍历传入的state对象,将传入的state对象中的key存入queue队列中
    for (const symbol in state) {
        queue.push(symbol);
    }
    // 循环遍历整个队列
    while (queue.length) {
        let symbol = queue.shift();
        // 队列出队得到队首
        // 如果队首在syntax中,就遍历syntax中的该语法结构
        if (syntax[symbol]) {
            for (let rule of syntax[symbol]) {
                // 遍历过程中,如果syntax中的语法结构的首位不在state中就将该语法结构放入到队列中,如果存在,就将该语法结构的值设为true
                if (!state[rule[0]]) {
                    queue.push(rule[0])
                }
                let current = state;
                for (const part of rule) {
                    if (!current[part]) {
                        current[part] = {}
                    }
                    current = current[part]
                }
                current.$reduceType = symbol;
                current.$reduceSate = state;
            }
        }
    }
    for (let symbol in state) {
        if (symbol.match(/^$/)) {
            return;
        }
        if (hash[JSON.stringify(state[symbol])]) {
            state[symbol] = hash[JSON.stringify(state[symbol])]
        } else {
            closure(state[symbol])
        }
    }
}
let end = {
    $isEnd: true
}
let start = {
    "Program": end
}

closure(start)

let source = `
    let a;
`
function parse(source) {
    let state = start;
    for (const symbol of scan(source)) {
        // 此处的symbol为terminal symbol
        if (symbol.type in state) {
            state = state[symbol.type]
        } else {
            if (state.$reduceType) {
                state = state.$reduceSate
            }
        }
        console.log(symbol);
    }

}

parse(source)