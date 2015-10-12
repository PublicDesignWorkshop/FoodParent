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
            this.bCentered = true;
            this.bClosePopupOnClick = true;
            this.bGraphicView = true;
            this.createMap = function (position) {
                var that = _this;
                var accuracy = position.coords.accuracy;
                that.location = new L.LatLng(position.coords.latitude, position.coords.longitude);
                if (that.map == undefined) {
                    that.setLocation(new L.LatLng(position.coords.latitude, position.coords.longitude));
                    that.map = L.map(that.$el[0].id, {
                        zoomControl: false,
                        closePopupOnClick: that.bClosePopupOnClick,
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
                    that.map.whenReady(that.afterCreateMap);
                    that.map.on("moveend", that.afterMoveMap);
                }
            };
            this.afterCreateMap = function () {
                var that = _this;
                if (that.bDebug)
                    console.log("afterCreateMap()");
                FoodParent.Controller.getInstance().fetchTrees(that.map.getBounds());
                FoodParent.Controller.getInstance().setMapView(that);
            };
            this.afterMoveMap = function () {
                var that = _this;
                if (that.bDebug)
                    console.log("afterMoveMap()");
                FoodParent.Controller.getInstance().fetchTrees(that.map.getBounds());
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
            that.$el.html("");
            if (that.bCentered) {
                console.log("render()");
                FoodParent.Controller.getInstance().updateGeoLocation(that.createMap);
            }
            return that;
        };
        MapView.prototype.setIsCentered = function (bCentered) {
            this.bCentered = bCentered;
        };
        MapView.prototype.setIsClosePopupOnClick = function (bClosePopupOnClick) {
            this.bClosePopupOnClick = bClosePopupOnClick;
        };
        MapView.prototype.setZoom = function (zoom) {
            this.zoom = zoom;
        };
        MapView.prototype.setLocation = function (location) {
            var that = this;
            that.location = location;
        };
        MapView.prototype.updateLocation = function () {
            var that = this;
            that.map.setView(that.location, that.zoom);
        };
        MapView.prototype.getLocation = function () {
            return this.location;
        };
        MapView.prototype.addMarker = function (marker) {
            var that = this;
            marker.addTo(that.map);
        };
        MapView.prototype.getAllMarkers = function () {
            var that = this;
            var result = new Array();
            $.each(that.map._layers, function (index, model) {
                if (model instanceof L.Marker) {
                    result.push(model);
                }
            });
            return result;
        };
        MapView.prototype.removeMarker = function (marker) {
            var that = this;
            marker.off('click');
            that.map.removeLayer(marker);
            return marker;
        };
        MapView.prototype.SetIsGraphicView = function (bGraphicView) {
            var that = this;
            that.bGraphicView = bGraphicView;
            if (that.bGraphicView) {
                that.render();
            }
            else {
                that.render2();
            }
        };
        MapView.prototype.getIsGraphicView = function () {
            return this.bGraphicView;
        };
        MapView.prototype.render2 = function () {
            console.log("render2()");
            var that = this;
            that.map.remove();
            that.map = undefined;
            that.$el.removeClass('leaflet-container');
            that.$el.removeClass('leaflet-touch');
            that.$el.removeClass('leaflet-fade-anim');
            that.$el.removeAttr('tabindex');
            var template = _.template(FoodParent.Template.getInstance().getLocationTableTemplate());
            var data = {
                title: FoodParent.Localization.getInstance().getTreeListText(),
            };
            that.$el.html(template(data));
            TreeColumn[1].cell = Backgrid.SelectCell.extend({
                optionValues: FoodParent.Model.getInstance().getFoods().toArray(),
            });
            var trees = new FoodParent.Trees(FoodParent.Model.getInstance().getTrees().where({ type: 1 }));
            var grid = new Backgrid.Grid({
                columns: TreeColumn,
                collection: trees,
                emptyText: FoodParent.Localization.getInstance().getNoDataText(),
            });
            grid.render();
            that.$(".list-location").append(grid.el);
        };
        return MapView;
    })(Backbone.View);
    FoodParent.MapView = MapView;
})(FoodParent || (FoodParent = {}));
