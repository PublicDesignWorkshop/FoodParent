declare var Pace;

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