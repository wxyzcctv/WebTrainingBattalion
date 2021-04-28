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
            // 如果子元素的主轴尺寸不为null或者0时，主轴尺寸就等于所有子元素主轴尺寸之和
            if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== (void 0)) {
                elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize]
            }
        }
        isAutoMainSize = true;
    }
    // 定义一个数组用于装每一行的元素
    var flexLine = [];
    // 定义flex布局数组用于装下所有行
    var flexLines = [flexLine];
    // 获取父元素的主轴尺寸大小
    var mainSpace = elementStyle[mainSize];
    // 定义交叉轴尺寸大小
    var crossSpace = 0;
    // 循环遍历每一个元素
    for (let i = 0; i < items.length; i++) {
        var item = items[i];
        // 获取每一个元素的样式
        var itemStyle = getStyle(item);
        // 如果遍历的当前元素没有主轴尺寸就定义其主轴尺寸大小为0
        if (itemStyle[mainSize] === null) {
            itemStyle[mainSize] = 0;
        }
        if (itemStyle.flex) {
            // 如果遍历的当前元素具有flex属性，就将当前元素加入到flex布局中的一行中
            flexLine.push(item);
        } else if (style.flexWrap === "nowrap" && isAutoMainSize) {
            // 不需要换行的情况
            // 如果父元素具有nowrap属性并且排除了装一行的情况，每次遍历主轴尺寸减去当前元素主抽尺寸
            mainSpace -= itemStyle[mainSize];
            // 如果当前元素的交叉轴尺寸不为0就与之前的较差轴尺寸进行比较大小，获取最大的交叉轴尺寸
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            }
            // 将该元素加入flex中的一行中
            flexLine.push(item)
        } else {
            // 需要换行的情况
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
                // 当前元素能放入flex中的一行中就直接放入
                flexLine.push(item)
            }
            // 获取最大交叉轴的值
            if (itemStyle[crossSize !== null && itemStyle[crossSize] !== (void 0)]) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);

            }
            // 没变遍历一次主轴减一次当前元素的主轴尺寸
            mainSpace -= itemStyle[mainSize]
        }
    }
    // mainSpace是主轴方向上剩余的尺寸，给最后一行加上mainSpace,写循环的技巧
    flexLine.mainSpace = mainSpace;


    // 计算主轴
    // 保存交叉轴尺寸到当前flex行中
    if (style.flexWrap === "nowrap" || isAutoMainSize) {
        // 如果父元素设置了nowrap属性或者没有设置主轴尺寸时，交叉轴尺寸就等于父元素交叉轴尺寸，或者等于最大交叉轴尺寸
        flexLine.crossSpace = (style[crossSize] !== undefined) ? style[crossSize] : crossSpace;
    } else {
        flexLine.crossSpace = crossSpace;
    }
    if (mainSpace < 0) {
        // 主轴尺寸小于0时，即为所有的元素排在了一行中，此时所有的元素需要按照比例进行缩放
        // 获取缩放比例
        var scale = style[mainSize] / (style[mainSize] - mainSpace);
        // mainBase表示的是元素的起始位置，如果主轴是行，那么第一个元素的mainBase就是0或者父元素的宽
        // mainSign表示排列的方向，+1表示从前往后，-1表示从后往前
        var currentMain = mainBase;
        // 循环每一个元素，设置每一个元素的宽，left、right，并记录下一个位置的起始位置为上一个位置的结束位置
        for (let i = 0; i < items.length; i++) {
            var item = items[i];
            var itemStyle = getStyle(item);

            if (itemStyle.flex) {
                itemStyle[mainSize] = 0
            }

            itemStyle[mainSize] = itemStyle[mainSize] * scale;

            itemStyle[mainStart] = currentMain;
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
            currentMain = itemStyle[mainEnd]
        }
    } else {
        // 如果存在主轴剩余空间，则表明存在多行，需要对每一行的布局进行单独处理
        flexLines.forEach((items) => {
            // 对所有flex行进行遍历
            // 获取一行的主轴尺寸
            var mainSpace = items.mainSpace;
            var flexTotal = 0;
            // 通过循环一行的元素，获得所有元素的flex值总和
            for (let i = 0; i < items.length; i++) {
                var item = items[i];
                var itemStyle = getStyle(item);

                if ((itemStyle.flex !== null) && (itemStyle.flex !== (void 0))) {
                    flexTotal += itemStyle.flex;
                    continue;
                }
            }

            if (flexTotal > 0) {
                // 如果存在元素中包含具有flex大小的属性，具有flex=1的元素会在具有多余空间时按照flex的值的比例填充剩余空间
                var currentMain = mainBase;
                for (let i = 0; i < items.length; i++) {
                    var item = items[i];

                    // 计算具有flex值的元素的主轴尺寸实际填充的主轴尺寸大小
                    if (itemStyle.flex) {
                        itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
                    }
                    // 获取元素的位置
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd];
                }
            } else {
                // 如果元素中没有flex值时需要根据justifyContent进行计算，set为间隔，currentMain为起始位置
                if (style.justifyContent === 'flex-start') {
                    var currentMain = mainBase;
                    var step = 0;
                }
                if (style.justifyContent === 'flex-end') {
                    var currentMain = mainSpace * mainSign + mainBase;
                    var step = 0;
                }
                if (style.justifyContent === 'center') {
                    var currentMain = mainSpace / 2 * mainSign + mainBase;
                    var step = 0;
                }
                if (style.justifyContent === 'space-between') {
                    var currentMain = mainBase;
                    var step = mainSpace / (item.length - 1) * mainSign;
                    // 此时的间隔数量是item个数减一
                }
                if (style.justifyContent === 'space-around') {
                    var step = mainSpace / item.length * mainSign;
                    // 此时的间隔数量是item个数
                    var currentMain = step / 2 + mainBase;
                }
                // 获取每一个元素的定位
                for (let i = 0; i < items.length; i++) {
                    var item = items[i];
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd] + step;
                }
            }
        })
    }
}

module.exports = layout