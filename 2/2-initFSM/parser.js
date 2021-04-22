const EOF = Symbol("EDF");
function data(c) {

}

module.exports.parseHTML = function parserHTML(html) {
    let state = data; // 初始状态为data
    for (const c of html) {
        // 对每一个HTML中的字符进行循环，使用状态机进行处理
        state = state(c);
    }
    state = state(EOF); // 使用symbol的唯一性作为状态机的结束状态
}