function animate(element, newContent, speed, callback=function () {}) {
    element.fadeOut(speed, function () {
        element.html(newContent).fadeIn(speed, callback);
    });
}

export {animate};
