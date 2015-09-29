var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var FoodParent;
(function (FoodParent) {
    var MapView = (function (_super) {
        __extends(MapView, _super);
        function MapView(options) {
            var _this = this;
            _super.call(this, options);
            this.bDebug = true;
            this.bActive = true;
            this.createMap = function (position) {
                var that = _this;
                var accuracy = position.coords.accuracy;
                that.location = new L.LatLng(position.coords.latitude, position.coords.longitude);
                if (that.map == undefined) {
                    that.setLocation(new L.LatLng(position.coords.latitude, position.coords.longitude));
                    that.map = L.map(that.$el[0].id, {
                        closePopupOnClick: true,
                        zoomControl: false,
                        doubleClickZoom: true,
                        touchZoom: true,
                        zoomAnimation: true,
                        markerZoomAnimation: true,
                    }).setView(that.location, that.zoom);
                    L.tileLayer(FoodParent.Setting.getInstance().getTileMapAddress(), {
                        minZoom: FoodParent.Setting.getInstance().getMapMinZoomLevel(),
                        maxZoom: FoodParent.Setting.getInstance().getMapMaxZoomLevel(),
                    }).addTo(that.map);
                    that.map.invalidateSize(false);
                    that.map.whenReady(that.createLayers);
                    // remove leaflet thumbnail
                    that.$('.leaflet-control-attribution.leaflet-control').html('');
                }
            };
            this.createLayers = function () {
                var that = _this;
                if (that.bDebug)
                    console.log("createLayers()");
            };
            var that = this;
            that.events = {
                "click .nav-home": "_navHome",
            };
            that.delegateEvents();
            that.views = new Array();
            that.zoom = FoodParent.Setting.getInstance().getDefaultMapZoomLevel();
        }
        MapView.prototype.render = function () {
            var that = this;
            FoodParent.Controller.getInstance().updateGeoLocation(that.createMap);
            return that;
        };
        MapView.prototype.setLocation = function (location) {
            var that = this;
            that.location = location;
        };
        MapView.prototype.getLocation = function () {
            return this.location;
        };
        return MapView;
    })(Backbone.View);
    FoodParent.MapView = MapView;
})(FoodParent || (FoodParent = {}));
//# sourceMappingURL=mapview.js.map