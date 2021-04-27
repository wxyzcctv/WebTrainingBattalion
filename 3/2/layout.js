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
    var items = element.children.filter(e => e.style === 'element')
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

    var isAutoMainSize = false;
    // 如果父元素没有设置主轴尺寸就将所有子元素放到一行里
    if (!style[mainSize]) {
        elementStyle[mainSize] = 0;
        for (let i = 0; i < items.length; i++) {
            var item = items[i];
            if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== (void 0)) {
                elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize]
            }
        }
        isAutoMainSize = true;
    }

    var flexLine = [];
    var flexLines = [flexLine];

    var mainSpace = elementStyle[mainSize];
    var crossSpace = 0;

    for (let i = 0; i < items.length; i++) {
        var item = items[i];
        var itemStyle = getStyle(item);

        if (itemStyle[mainSize] === null) {
            itemStyle[mainSize] = 0;
        }

        if (itemStyle.flex) {
            flexLine.push(item);
        } else if (style.flexWrap === "nowrap" && isAutoMainSize) {
            mainSpace -= itemStyle[mainSize];
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            }
            flexLine.push(item)
        } else {
            // 如果子元素的尺寸比父元素的尺寸大就将子元素的尺寸压缩到父元素尺寸
            if (itemStyle[mainSize] > style[mainSize]) {
                itemStyle[mainSize] = style[mainSize]
            }
            // 如果新加入子元素后，主轴尺寸没有比子所加入的子元素的主轴尺寸小，就需要换行了
            if (mainSpace < itemStyle[mainSize]) {
                // 首先是保留上一行遗留的信息包括主轴空间和交叉轴空间
                flexLine.mainSpace = mainSpace;
                flexLine.crossSpace = crossSpace;
                // 新加一行需要将没装下的元素加入到新行中
                flexLine = [item]
                // 将新行加入到flex布局数组中
                flexLines.push(flexLine)
                // 重置主轴尺寸和交叉轴尺寸
                mainSize = style[mainSize]
                crossSpace = 0;
            } else {
                flexLine.push(item)
            }
            if (itemStyle[crossSize !== null && itemStyle[crossSize] !== (void 0)]) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);

            }
            mainSpace -= itemStyle[mainSize]
        }
    }
    // 给最后一行加上mainSpace,写循环的技巧
    flexLine.mainSpace = mainSpace
}

module.exports = layout