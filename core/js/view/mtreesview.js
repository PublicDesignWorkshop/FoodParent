var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var ManageTreesViewFractory = (function () {
        function ManageTreesViewFractory(args) {
            if (ManageTreesViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use ManageTreesViewFractory.getInstance() instead of new.");
            }
            ManageTreesViewFractory._instance = this;
        }
        ManageTreesViewFractory.getInstance = function () {
            return ManageTreesViewFractory._instance;
        };
        ManageTreesViewFractory.create = function (el, viewMode) {
            var view;
            if (viewMode == FoodParent.VIEW_MODE.MAP) {
                view = new ManageTreesMapView({ el: el });
            }
            return view;
        };
        ManageTreesViewFractory._instance = new ManageTreesViewFractory();
        return ManageTreesViewFractory;
    })();
    FoodParent.ManageTreesViewFractory = ManageTreesViewFractory;
    var ManageTreesView = (function (_super) {
        __extends(ManageTreesView, _super);
        function ManageTreesView() {
            _super.apply(this, arguments);
        }
        return ManageTreesView;
    })(FoodParent.BaseView);
    FoodParent.ManageTreesView = ManageTreesView;
    var ManageTreesMapView = (function (_super) {
        __extends(ManageTreesMapView, _super);
        function ManageTreesMapView(options) {
            var _this = this;
            _super.call(this, options);
            this.bClosePopupOnClick = true;
            this.renderMapError = function (error) {
                var self = _this;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.GEO_PERMISSION_ERROR);
                        break;
                    case error.POSITION_UNAVAILABLE:
                        FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.GEO_PERMISSION_ERROR);
                        break;
                    case error.TIMEOUT:
                        break;
                }
                self.renderMap({ coords: { accuracy: 4196, altitude: null, altitudeAccuracy: null, heading: null, latitude: 33.7946333, longitude: -84.448771, speed: null }, timestamp: new Date().valueOf() });
            };
            this.renderMap = function (position) {
                var self = _this;
                var accuracy = position.coords.accuracy;
                self.location = new L.LatLng(position.coords.latitude, position.coords.longitude);
                if (self.map == undefined) {
                    self.setLocation(new L.LatLng(position.coords.latitude, position.coords.longitude));
                    self.map = L.map(self.$el[0].id, {
                        zoomControl: false,
                        closePopupOnClick: self.bClosePopupOnClick,
                        doubleClickZoom: true,
                        touchZoom: true,
                        zoomAnimation: true,
                        markerZoomAnimation: true,
                    }).setView(self.location, self.zoom);
                    L.tileLayer(FoodParent.Setting.getTileMapAddress(), {
                        minZoom: FoodParent.Setting.getMapMinZoomLevel(),
                        maxZoom: FoodParent.Setting.getMapMaxZoomLevel(),
                    }).addTo(self.map);
                    self.map.invalidateSize(false);
                    // add event listener for finishing map creation.
                    self.map.whenReady(self.renderTrees);
                }
            };
            this.renderTrees = function () {
                var self = _this;
                FoodParent.Controller.fetchAllTrees(self.renderMarkers, self.renderMarkersError);
            };
            this.renderMarkers = function () {
                var self = _this;
                console.log(ManageTreesMapView.TAG + "renderMarkers()");
            };
            this.renderMarkersError = function (errorMode) {
                var self = _this;
                console.log(ManageTreesMapView.TAG + "renderMarkersError()");
                FoodParent.EventHandler.handleError(errorMode);
            };
            var self = this;
            self.bDebug = true;
            self.zoom = FoodParent.Setting.getDefaultMapZoomLevel();
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = {};
            self.delegateEvents();
        }
        ManageTreesMapView.prototype.render = function (args) {
            _super.prototype.render.call(this);
            var self = this;
            if (self.bDebug)
                console.log(ManageTreesMapView.TAG + "render()");
            var template = _.template(FoodParent.Template.getManageTreesMapViewTemplate());
            var data = {};
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-mtrees'));
            FoodParent.Controller.updateGeoLocation(self.renderMap, self.renderMapError);
            return self;
        };
        ManageTreesMapView.prototype.update = function (args) {
            _super.prototype.update.call(this);
            var self = this;
            if (self.bDebug)
                console.log(ManageTreesMapView.TAG + "update()");
            return self;
        };
        ManageTreesMapView.prototype.setLocation = function (location) {
            var self = this;
            self.location = location;
        };
        ManageTreesMapView.prototype._mouseOver = function (event) {
            var self = this;
            //EventHandler.handleMouseOver($(event.currentTarget), self);
        };
        ManageTreesMapView.prototype._mouseClick = function (event) {
            var self = this;
            //EventHandler.handleMouseClick($(event.currentTarget), self);
        };
        ManageTreesMapView.TAG = "ManageTreesMapView - ";
        return ManageTreesMapView;
    })(ManageTreesView);
    FoodParent.ManageTreesMapView = ManageTreesMapView;
})(FoodParent || (FoodParent = {}));
