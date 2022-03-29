const images = require('images')

function render(viewport, element) {
    if (element.style) {
        var img = images(element.style.width, element.style.height);

        if (element.style["background-color"]) {
            // 此处仅仅只是绘制背景颜色
            // 如果元素设置了背景颜色就渲染该颜色，如果没有设置，那么就将背景颜色设置为白色
            let color = element.style["background-color"] || "rgb(0,0,0)";
            color.match(/rgb\((\d+),(\d+),(\d+)\)/);
            img.fill(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3));
            viewport.draw(img, element.style.left || 0, element.style.top || 0);
        }
    }
}

module.exports = render