var FoodParent;
(function (FoodParent) {
    var Setting = (function () {
        function Setting(args) {
            if (Setting._instance) {
                throw new Error("Error: Instantiation failed: Use Setting.getInstance() instead of new.");
            }
            Setting._instance = this;
        }
        Setting.getInstance = function () {
            return Setting._instance;
        };
        Setting.setBaseUrl = function (url) {
            return Setting._instance._baseUrl = url;
        };
        Setting.getBaseUrl = function () {
            return Setting._instance._baseUrl;
        };
        Setting.getPhpDir = function () {
            return Setting._instance._baseUrl + "core/php/";
        };
        Setting.getContentsImageDir = function () {
            return Setting._instance._baseUrl + "content/image/";
        };
        Setting.getCoreImageDir = function () {
            return Setting._instance._baseUrl + "core/image/";
        };
        Setting.getNavWrapperElement = function () {
            return $('#wrapper-nav');
        };
        Setting.getMainWrapperElement = function () {
            return $('#wrapper-main');
        };
        Setting.getPopWrapperElement = function () {
            return $('#wrapper-pop');
        };
        Setting._instance = new Setting();
        return Setting;
    })();
    FoodParent.Setting = Setting;
})(FoodParent || (FoodParent = {}));
