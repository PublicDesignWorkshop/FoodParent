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
        Setting.prototype.setBaseUrl = function (url) {
            return this.baseUrl = url;
        };
        Setting.prototype.getBaseUrl = function () {
            return this.baseUrl;
        };
        Setting.prototype.getPhpDir = function () {
            return this.baseUrl + "core/php/";
        };
        Setting.prototype.getContentsImageDir = function () {
            return this.baseUrl + "contents/image/";
        };
        Setting.prototype.getCoreImageDir = function () {
            return this.baseUrl + "core/image/";
        };
        Setting.prototype.getMarkerShadowPath = function () {
            return this.getCoreImageDir() + "marker-shadow.png";
        };
        Setting.prototype.getTileMapAddress = function () {
            return 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
        };
        Setting.prototype.getDefaultMapZoomLevel = function () {
            return 10;
        };
        Setting.prototype.getDefaultSmallMapZoomLevel = function () {
            return 11;
        };
        Setting.prototype.getMapMinZoomLevel = function () {
            return 5;
        };
        Setting.prototype.getMapMaxZoomLevel = function () {
            return 19;
        };
        Setting.prototype.getDateTimeFormat = function () {
            return "YYYY-MM-DD HH:mm:ss";
        };
        Setting.prototype.getDateFormat = function () {
            return "DD MMM";
        };
        Setting.prototype.getResetUpdateDelay = function () {
            return 100;
        };
        Setting.prototype.getNumRecentActivityShown = function () {
            return 5;
        };
        Setting._instance = new Setting();
        return Setting;
    })();
    FoodParent.Setting = Setting;
})(FoodParent || (FoodParent = {}));
