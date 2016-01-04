declare var Pace;

var htmlEncode = function (str) {
    str = str.replace(/&/g, "&amp;");
    str = str.replace(/>/g, "&gt;");
    str = str.replace(/</g, "&lt;");
    str = str.replace(/"/g, "&quot;");
    str = str.replace(/'/g, "&#039;");
    return str;
}

var replaceAt = function (str: string, index: number, character: string) {
    return str.substr(0, index) + character + str.substr(index + character.length);
}

$(document).ready(function () {
    var url: any = window.location;
    console.log(url.origin + window.location.pathname);
    FoodParent.Setting.setBaseUrl(url.origin + window.location.pathname);

    // Start Router
    Backbone.history.start();
});