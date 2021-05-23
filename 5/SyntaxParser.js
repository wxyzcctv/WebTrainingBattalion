import { scan } from './LexParser.js'

let syntax = {
    Program: [["StatementList", 'EOF']],
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
    for (let symbol in state) {
        if (symbol.match(/^\$/)) {
            continue;
        }
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
                for (let part of rule) {
                    if (!current[part]) {
                        current[part] = {}
                    }
                    current = current[part]
                }
                current.$reduceType = symbol;
                current.$reduceLength = rule.length;
            }
        }
    }
    for (let symbol in state) {
        if (symbol.match(/^\$/)) {
            continue;
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

function parse(source) {
    let stack = [start];
    let symbolStack = []
    function reduce() {
        let state = stack[stack.length - 1];
        if (state.$reduceType) {
            let children = [];
            for (let i = 0; i < state.$reduceLength; i++) {
                stack.pop()
                children.push(symbolStack.pop())
            }
            // 创建一个非终结符
            return {
                type: state.$reduceType,
                children: children.reverse()
            }
        } else {
            throw new Error('unexpected token')
        }
    }
    function shift(symbol) {
        let state = stack[stack.length - 1];
        if (symbol.type in state) {
            stack.push(state[symbol.type]);
            symbolStack.push(symbol)
        } else {
            shift(reduce());
            shift(symbol);
        }
    }
    for (let symbol of scan(source)) {
        // 此处的symbol为terminal symbol
        shift(symbol)
    }
    return reduce()
}

let evaluator = {
    Program(node) {
        return evaluate(node.children[0])
    },
    StatementList(node) {
        if (node.children.length === 1) {
            return evaluate(node.children[0])
        } else {
            evaluate(node.children[0]);
            return evaluate(node.children[1]);
        }
    },
    Statement(node) {
        return evaluate(node.children[0])
    },
    VariableDeclaration(node) {
        console.log("Declare variable", node.children[1].name);
    },
    EOF() {
        return null
    }
}

function evaluate(node) {
    if (evaluator[node.type]) {
        return evaluator[node.type](node)
    }
}

let source = `
    let a;
    let b;
`

let tree = parse(source);

evaluate(tree)