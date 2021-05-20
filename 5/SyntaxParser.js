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
        ["var", "Identifier"]
    ],
    FuntionDeclaration: [
        ["function", "Identifier", "(", ")", "{", "StatementList", "}"]
    ],
    ExpressionStatement: [
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