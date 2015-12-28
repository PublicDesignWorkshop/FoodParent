var replaceAt = function (str, index, character) {
    return str.substr(0, index) + character + str.substr(index + character.length);
};
$(document).ready(function () {
    var url = window.location;
    console.log(url.origin + window.location.pathname);
    FoodParent.Setting.setBaseUrl(url.origin + window.location.pathname);
    // Start Router
    Backbone.history.start();
});
