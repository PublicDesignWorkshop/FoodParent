function CCSStylesheetRuleStyle(selectorText, style, value) {
    /* returns the value of the element style of the rule in the stylesheet
    *  If no value is given, reads the value
    *  If value is given, the value is changed and returned
    *  If '' (empty string) is given, erases the value.
    *  The browser will apply the default one
    *
    * string stylesheet: part of the .css name to be recognized, e.g. 'default'
    * string selectorText: css selector, e.g. '#myId', '.myClass', 'thead td'
    * string style: camelCase element style, e.g. 'fontSize'
    * string value optionnal : the new value
    */
    var CCSstyle = undefined, rules;
    rules = document.styleSheets[0][document.all ? 'rules' : 'cssRules'];
    for (var n in rules) {
        console.log(rules[n].selectorText);
        if (rules[n].selectorText == selectorText) {
            CCSstyle = rules[n].style;
            break;
        }
    }
    if (value == undefined)
        return CCSstyle[style];
    else
        return CCSstyle[style] = value;
}
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
