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
        ["NumericLiteral"],
        ["StringLiteral"],
        ["BooleanLiteral"],
        ["NullLiteral"],
        ["RegularExpressionLiteral"],
        ["ObjectLiteral"],
        ["ArrayLiteral"],
    ],
    ObjectLiteral: [
        ["{", "}"], // 运行空
        ["{", "PropertyList", "}"]
    ],
    PropertyList: [
        ["Property"],
        ["PropertyList", ",", "Property"],
    ],
    Property: [
        ["StringLiteral", ":", "AdditiveExpression"],
        ["Identifier", ":", "AdditiveExpression"]
    ],

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
    ExpressionStatement(node) {
        return evaluate(node.children[0])
    },
    Expression(node) {
        return evaluate(node.children[0])
    },
    AdditiveExpression(node) {
        if (node.children.length === 1) {
            return evaluate(node.children[0]);
        } else {

        }
    },
    MultiplicativeExpression(node) {
        if (node.children.length === 1) {
            return evaluate(node.children[0]);
        } else {

        }
    },
    PrimaryExpression(node) {
        if (node.children.length === 1) {
            return evaluate(node.children[0]);
        }
    },
    Literal(node) {
        return evaluate(node.children[0]);
    },
    NumericLiteral(node) {
        let str = node.value;
        let l = str.length;
        let value = 0;
        let n = 10;

        if (str.match(/^0b/)) {
            n = 2;
            l -= 2
            // 减去字符串前面的0b
        } else if (str.match(/^0o/)) {
            n = 8;
            l -= 2
        } else if (str.match(/^0x/)) {
            n = 16;
            l -= 2
        }

        // 获取到的node.value 就是传入的数字字符串比如"65356",下面的while循环是将字符串"65356"转换为10进制的65356
        while (l--) {
            let c = str.charCodeAt(str.length - l - 1)
            if (c >= 'a'.charCodeAt(0)) {
                c = c - 'a'.charCodeAt(0) + 10;
            } else if (c >= 'A'.charCodeAt(0)) {
                c = c - 'A'.charCodeAt(0) + 10;
            } else if (c >= '0'.charCodeAt(0)) {
                c = c - '0'.charCodeAt(0);
            }
            value = value * n + c;
        }
        console.log(value);
        // return evaluate(node.children[0]);
    },
    StringLiteral(node) {

        let result = [];

        for (let i = 1; i < node.value.length - 1; i++) {
            if (node.value[i] === '\\') {
                ++i;
                let c = node.value[i];
                let map = {
                    "\"": "\"",
                    "\'": "\'",
                    "\\": "\\",
                    "0": String.fromCharCode(0x0000),
                    "b": String.fromCharCode(0x0008),
                    "f": String.fromCharCode(0x000C),
                    "n": String.fromCharCode(0x000A),
                    "r": String.fromCharCode(0x000D),
                    "t": String.fromCharCode(0x0009),
                    "v": String.fromCharCode(0x000B),
                };
                if (c in map) {
                    result.push(map[c]);
                } else {
                    result.push(c);
                }
            } else {
                result.push(node.value[i])
            }
        }
        console.log(result);
        return result.join("");
    },
    ObjectLiteral(node) {
        if (node.children.length === 2) {
            return {}
        }
        if (node.children.length === 3) {
            let object = new Map();

            // object.prototype = 
            return object;
        }

    },
    PropertyList(node, Object) {

    },
    Property(node, Object) {

    }
}

function evaluate(node) {
    if (evaluator[node.type]) {
        return evaluator[node.type](node)
    }
}

//////////////////////////////////////////

window.js = {
    evaluate, parse
}