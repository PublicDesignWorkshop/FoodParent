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
            this._bClosePopupOnClick = true;
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
                self._location = new L.LatLng(position.coords.latitude, position.coords.longitude);
                if (self._map == undefined) {
                    self.setLocation(new L.LatLng(position.coords.latitude, position.coords.longitude));
                    self._map = L.map(self.$el[0].id, {
                        zoomControl: false,
                        closePopupOnClick: self._bClosePopupOnClick,
                        doubleClickZoom: true,
                        touchZoom: true,
                        zoomAnimation: true,
                        markerZoomAnimation: true,
                    }).setView(self._location, self._zoom);
                    L.tileLayer(FoodParent.Setting.getTileMapAddress(), {
                        minZoom: FoodParent.Setting.getMapMinZoomLevel(),
                        maxZoom: FoodParent.Setting.getMapMaxZoomLevel(),
                    }).addTo(self._map);
                    self._map.invalidateSize(false);
                    // add event listener for finishing map creation.
                    self._map.whenReady(self.renderTrees);
                    // add event listener for dragging map
                    self._map.on("moveend", self.afterMoveMap);
                    //Controller.fetchAllTrees();
                    self._map.on('popupopen', function (event) {
                        var marker = event.popup._source;
                        marker._bringToFront();
                        /*
                        
                        */
                        $(marker.label._container).addClass('active');
                        //$('.leaflet-popup-content .marker-control-item').off('click');
                        //$('.leaflet-popup-content .marker-control-item').on('click', function (event) {
                        //    //console.log($('.leaflet-popup-content .glyphicon').attr('data-id'));
                        //    Router.getInstance().navigate("tree/" + $('.leaflet-popup-content .glyphicon').attr('data-id'), { trigger: true });
                        //});
                        self._selectedMarker = marker;
                    });
                    self._map.on('popupclose', function (event) {
                        var marker = event.popup._source;
                        marker._resetZIndex();
                        $(marker.label._container).removeClass('active');
                        self._selectedMarker = null;
                    });
                }
            };
            this.afterMoveMap = function () {
                var self = _this;
                if (self._selectedMarker) {
                    self._selectedMarker._bringToFront();
                }
            };
            this.renderTrees = function () {
                var self = _this;
                FoodParent.Controller.fetchAllTrees(self.renderMarkers, self.renderMarkersError);
            };
            this.renderMarkers = function () {
                var self = _this;
                console.log(ManageTreesMapView.TAG + "renderMarkers()");
                console.log(FoodParent.Model.getTrees());
                $.each(FoodParent.Model.getTrees().models, function (index, tree) {
                    var bFound = false;
                    for (var j = 0; j < self._markers.length && !bFound; j++) {
                        if (tree.getId() == self._markers[j].options.id) {
                            bFound = true;
                        }
                    }
                    if (!bFound) {
                        self.addMarker(tree);
                    }
                });
            };
            this.renderMarkersError = function (errorMode) {
                var self = _this;
                console.log(ManageTreesMapView.TAG + "renderMarkersError()");
                FoodParent.EventHandler.handleError(errorMode);
            };
            var self = this;
            self.bDebug = true;
            self._zoom = FoodParent.Setting.getDefaultMapZoomLevel();
            self._markers = new Array();
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = {
                //"mouseover .home-menu-left": "_mouseOver",
                //"mouseover .home-menu-right": "_mouseOver",
                "click .marker-control-item": "_mouseClick",
            };
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
        ManageTreesMapView.prototype.addMarker = function (tree) {
            var self = this;
            var marker = FoodParent.MarkerFractory.create(tree, true);
            self._markers.push(marker);
            marker.addTo(self._map);
            /*
            marker.on('dblclick', function (event) {
                if (self._map.getZoom() < Setting.getMapCenterZoomLevel()) {
                    self._map.setView(marker.getLatLng(), Setting.getMapCenterZoomLevel(), { animate: true });
                } else {
                    self._map.setView(marker.getLatLng(), self._map.getZoom(), { animate: true });
                }
            });
            */
            marker.on("dragend", function (event) {
                if (marker.options.id != undefined) {
                    var tree = FoodParent.Model.getTrees().findWhere({
                        id: marker.options.id
                    });
                    FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.UPDATE_LOCATION, { marker: marker, location: marker.getLatLng() });
                }
                /*
                if (item.get("type") == ItemType.None || item.id == undefined) {	// new item
                    item.set({ lat: item.marker.getLatLng().lat, lng: item.marker.getLatLng().lng });
                } else {                                    // existing item
                    item.save(
                        { lat: item.marker.getLatLng().lat, lng: item.marker.getLatLng().lng },
                        {
                            success: function (model, response) {
                                FMV.getMsgView().renderSuccess("'" + model.get("name") + "' " + FML.getViewMarkerSaveSuccessMsg());
                            },
                            error: function (error) {
                                FMV.getMsgView().renderError(FML.getViewMarkerSaveErrorMsg());
                            }
                        }
                    );
                }
                
                // update ui if UIMode is Info or Add
                if (FMV.getUIView().getMode() == UIMode.INFO || FMV.getUIView().getMode() == UIMode.ADD) {
                    FMV.getUIView().$("#item-info-lat").val(item.marker.getLatLng().lat.toString());
                    FMV.getUIView().$("#item-info-lng").val(item.marker.getLatLng().lng.toString());
                }
                // open popup
                if (item.marker != null) {
                    item.marker.openPopup();
                }
                */
            });
        };
        ManageTreesMapView.prototype.setLocation = function (location) {
            var self = this;
            self._location = location;
        };
        ManageTreesMapView.prototype._mouseOver = function (event) {
            var self = this;
            //EventHandler.handleMouseOver($(event.currentTarget), self);
        };
        ManageTreesMapView.prototype._mouseClick = function (event) {
            var self = this;
            FoodParent.EventHandler.handleMouseClick($(event.currentTarget), self, { marker: self._selectedMarker });
        };
        ManageTreesMapView.TAG = "ManageTreesMapView - ";
        return ManageTreesMapView;
    })(ManageTreesView);
    FoodParent.ManageTreesMapView = ManageTreesMapView;
})(FoodParent || (FoodParent = {}));
