let currentToken = null

function emit(token) {
    console.log(token);
}

const EOF = Symbol("EDF");

// 解析传入的字符时，如果字符开始为<则进入标签开始状态机，如果状态为EOF则为结束状态，其余字符依然进行该状态机的判断，包括>
function data(c) {
    if (c === '<') {
        return tagOpen;
    } else if (c === EOF) {
        emit({
            type: "EOF"
        })
        return;
    } else {
        // 暂时将字符一个一个的传输出去
        emit({
            type: "text",
            content: c
        })
        return data
    }
}
// 标签开始，接/表示结束标签，接英文单词表示标签名，
// 接其他字符如?\!就直接return，报错
function tagOpen(c) {
    if (c === '/') {
        // <之后如果为/就表示此时为结束标签开始
        return endTagOpen
    } else if (c.match(/^[a-zA-Z]$/)) {
        // <之后为字母就表示为标签名，跳转到标签名状态机
        currentToken = {
            type: "startTag",
            tagName: ""
        }
        return tagName(c)
    } else {
        return;
    }
}

function endTagOpen(c) {
    if (c.match(/^[a-zA-Z]$/)) {
        // 结束标签开始后紧跟着的是字符就跳转到标签名，其余的都会报错
        currentToken = {
            type: "endTag",
            tagName: ""
        }
        return tagName(c)
    } else if (c === '>') {

    } else if (c === EOF) {

    } else {

    }
}
// 此处是没有考虑是从那个状态跳转过来的，如果是结束标签跳转过来的时候只能跳转到>才行
function tagName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        // tagName之后紧跟着的是空白符就进入属性名状态
        return beforAttributeNameOrselfClosingStartTag
    } else if (c === '/') {
        // tagName之后紧跟着/表示自封闭标签（如果是闭合标签中tagName后的/会报错，此处没有判断处理）
        return selfClosingStartTag;
    } else if (c.match(/^[a-zA-Z]$/)) {
        // 如果是字符串中是字母则表示依然为标签名
        currentToken.tagName += c;
        return tagName;
    } else if (c === '>') {
        // 如果标签名之后为>表示解析完成一个标签,进入下一个标签的判断
        emit(currentToken)
        return data
    } else {
        return tagName
    }
}
// tagName后如果跟着一个空格还需要判断后面跟着的是否为/，如果跟着的是/才是自闭和标签
function beforAttributeNameOrselfClosingStartTag(c) {
    if (c.match(/^[a-zA-Z]$/)) {
        return beforAttributeName;
    } else if (c === '/') {
        return selfClosingStartTag
    }
}
// 此时没有对属性的解析做处理，一直等待处理>
function beforAttributeName(c) {
    if (c.match(/^[\t\n\g ]$/)) {
        return beforAttributeName;
    } else if (c === '>') {
        return data
    } else if (c === '=') {
        return beforAttributeName
    } else {
        return beforAttributeName
    }
}

function selfClosingStartTag(c) {
    if (c === '>') {
        // 自闭合标签后面只有接>才是有效的,其余的都是会报错
        currentToken.isSelfClosing = true;
        emit(currentToken)
        return data
    } else if (c === 'EOF') {

    } else {

    }
}

module.exports.parserHTML = function parserHTML(html) {
    let state = data; // 初始状态为data
    for (const c of html) {
        // 对每一个HTML中的字符进行循环，使用状态机进行处理
        state = state(c);
    }
    state = state(EOF); // 使用symbol的唯一性作为状态机的结束状态
}