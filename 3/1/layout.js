function getStyle(element) {
    if (!element.style) {
        // 用一个新的style对象存储新增的css计算属性
        element.style = {}
    }
    for (let prop in element.computedStyle) {
        var p = element.computedStyle.value;
        element.style[prop] = element.computedStyle[prop].value;

        // 将style中带有px和纯数字的属性值转换为整数
        if (element.style[prop].toString().match(/px$/)) {
            element.style[prop] = parseInt(element.style[prop])
        }
        if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
            element.style[prop] = parseInt(element.style[prop])
        }
    }
    return element.style
}

function layout(element) {
    // 跳过没有样式计算属性的元素
    if (!element.computedStyle) {
        return
    }
    // 对style进行预处理
    var elementStyle = getStyle(element)
    // 此处只考虑flex布局
    if (elementStyle.display !== 'flex') {
        return
    }
    // 过滤掉文本节点
    var items = element.children.filter(e => e.type === 'element')
    // 进行sort排序是为了支持flex中的order属性
    items.sort(function (a, b) {
        return (a.order || 0) - (b.order || 0);
    });

    var style = elementStyle;

    // 对于width和height为auto或者为""统一置空
    ['width', 'height'].forEach(size => {
        if (style[size] === "auto" || style[size] === "") {
            style[size] = null
        }
    })
    // 设置flex的属性的默认值
    if (!style.flexDirection || style.flexDirection === "auto") {
        style.flexDirection = 'row';
    }
    if (!style.alignItems || style.alignItems === "auto") {
        style.alignItems = "stretch"
    }
    if (!style.justifyContent || style.justifyContent === "auto") {
        style.justifyContent === "flex-start"
    }
    if (!style.flexWrap || style.flexWrap === "auto") {
        style.flexWrap = "nowarp"
    }
    if (!style.alignContent || style.alignItems === "auto") {
        style.alignContent = "stretch"
    }

    var mainSize, mainStart, mainEnd, mainSign, mainBase, crossSize, crossStart, corssEnd, crossSign, crossBase;
    // 设置主轴交叉轴属性
    if (style.flexWrap === "row") {
        mainSize = "width";
        mainStart = "left";
        mainEnd = "right";
        mainSign = +1;
        mainBase = 0;

        crossSize = "height";
        crossStart = "top";
        corssEnd = "bottom";
    }
    if (style.flexDirection === "row-reverse") {
        mainSize = "width";
        mainStart = "right";
        mainEnd = "left";
        mainSign = -1;
        mainBase = style.width;

        crossSize = "height";
        crossStart = "top";
        corssEnd = "bottom";
    }
    if (style.flexDirection === "column") {
        mainSize = "height";
        mainStart = "top";
        mainEnd = "bottom";
        mainSign = +1;
        mainBase = 0;

        crossSize = "width";
        crossStart = "left";
        corssEnd = "right";
    }
    if (style.flexDirection === "column-reverse") {
        mainSize = "height";
        mainStart = "bottom";
        mainEnd = "top";
        mainSign = -1;
        mainBase = style.height;

        crossSize = "width";
        crossStart = "left";
        corssEnd = "right";
    }
    if (style.flexDirection === "wrap-reverse") {
        var tmp = crossStart;
        crossStart = corssEnd;
        corssEnd = tmp;
        crossSign = -1;
    } else {
        crossBase = 0;
        crossSign = 1;
    }
}

module.exports = layout