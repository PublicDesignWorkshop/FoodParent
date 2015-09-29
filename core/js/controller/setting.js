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
        Setting.prototype.getTileMapAddress = function () {
            //return 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
            //return 'http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg'
            return 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        };
        Setting.prototype.getDefaultMapZoomLevel = function () {
            return 18;
        };
        Setting.prototype.getMapMinZoomLevel = function () {
            return 17;
        };
        Setting.prototype.getMapMaxZoomLevel = function () {
            return 19;
        };
        Setting._instance = new Setting();
        return Setting;
    })();
    FoodParent.Setting = Setting;
})(FoodParent || (FoodParent = {}));
//# sourceMappingURL=setting.js.map