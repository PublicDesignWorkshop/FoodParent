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
        Setting.getNavAnimDuration = function () {
            return 100;
        };
        Setting.getRemovePopupDuration = function () {
            return 250;
        };
        Setting.getDefaultMapZoomLevel = function () {
            return 10;
        };
        Setting.getTileMapAddress = function () {
            return 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
            //return 'http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg'
            //return 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        };
        Setting.getMapMinZoomLevel = function () {
            return 5;
        };
        Setting.getMapMaxZoomLevel = function () {
            return 19;
        };
        Setting.getDateTimeFormat = function () {
            return "YYYY-MM-DD HH:mm:ss";
        };
        Setting.getDevContact = function () {
            return "captainwhale52@gmail.com";
        };
        Setting.getManagerContact = function () {
            return "captainwhale52@gmail.com";
        };
        Setting._instance = new Setting();
        return Setting;
    })();
    FoodParent.Setting = Setting;
})(FoodParent || (FoodParent = {}));
