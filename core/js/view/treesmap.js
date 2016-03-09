var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var TreesMapView = (function (_super) {
        __extends(TreesMapView, _super);
        function TreesMapView(options) {
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
                self.renderMap({
                    coords: {
                        accuracy: 4196,
                        altitude: null,
                        altitudeAccuracy: null,
                        heading: null,
                        latitude: 33.7946333,
                        longitude: -84.448771,
                        speed: null
                    },
                    timestamp: new Date().valueOf()
                });
            };
            this.renderMap = function (position) {
                var self = _this;
                if (self.bDebug)
                    console.log(TreesMapView.TAG + "renderMap()");
                var accuracy = position.coords.accuracy;
                self._location = new L.LatLng(position.coords.latitude, position.coords.longitude);
                // Rener map only when the map is not rendered in a browswer
                if (self._map == undefined) {
                    self.$('#list-donation').css({ height: FoodParent.View.getHeight() - 60 });
                    self.setLocation(new L.LatLng(position.coords.latitude, position.coords.longitude));
                    self._map = L.map($('#content-map')[0].id, {
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
                        $(marker.label._container).addClass('active');
                        var tree = FoodParent.Model.getTrees().findWhere({ id: marker.options.id });
                        self.renderTreeInfo(tree);
                        self._selectedMarker = marker;
                        // Make MessageView invisible.
                        if (FoodParent.View.getMessageView()) {
                            FoodParent.View.getMessageView().setInvisible();
                        }
                        if (FoodParent.View.getWidth() > FoodParent.View.getHeight()) {
                            self._map.panTo(new L.LatLng(marker.getLatLng().lat, marker.getLatLng().lng + self._map.getSize().x * 0.00005));
                        }
                        else {
                            self._map.panTo(new L.LatLng(marker.getLatLng().lat + self._map.getSize().y * 0.000075, marker.getLatLng().lng));
                        }
                        //self.closeMapFilter();
                        FoodParent.Router.getInstance().navigate("trees/" + FoodParent.VIEW_MODE.MAP + "/" + tree.getId(), { trigger: false, replace: true });
                    });
                    self._map.on('popupclose', function (event) {
                        var marker = event.popup._source;
                        marker._resetZIndex();
                        $(marker.label._container).removeClass('active');
                        self.$('#wrapper-treeinfo').addClass('hidden');
                        self._selectedMarker = null;
                        FoodParent.Router.getInstance().navigate("trees/" + FoodParent.VIEW_MODE.MAP + "/0", { trigger: false, replace: true });
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
                FoodParent.Controller.fetchAllTrees(function () {
                    // Render filter list
                    self.renderFilterList();
                    self.renderMarkers();
                }, function (errorMode) {
                    FoodParent.EventHandler.handleError(errorMode);
                });
            };
            this.renderMarkers = function () {
                var self = _this;
                console.log(TreesMapView.TAG + "renderMarkers()");
                // Iterate all trees and add markers for trees in database but not being rendered in the map
                $.each(FoodParent.Model.getTrees().models, function (index, tree) {
                    var bFound = false;
                    for (var j = 0; j < self._markers.length && !bFound; j++) {
                        if (tree.getId() == self._markers[j].options.id) {
                            bFound = true;
                        }
                    }
                    if (!bFound) {
                        self.addMarker(tree, false);
                    }
                });
                // Open tree info popup if the hash address has an existing tree id
                if (self._id != undefined && self._id != 0) {
                    for (var j = 0; j < self._markers.length; j++) {
                        if (self._markers[j].options.id == self._id) {
                            self._markers[j].openPopup();
                            break;
                        }
                    }
                }
            };
            this.updateMarkers = function (trees) {
                var self = _this;
                console.log(TreesMapView.TAG + "updateMarkers()");
                // Add new markers
                $.each(trees.models, function (index, tree) {
                    var bFound = false;
                    for (var j = 0; j < self._markers.length && !bFound; j++) {
                        if (tree.getId() == self._markers[j].options.id) {
                            bFound = true;
                        }
                    }
                    if (!bFound) {
                        self.addMarker(tree, false);
                    }
                });
                // Remove unnecessary markers
                for (var j = 0; j < self._markers.length;) {
                    var bFound = false;
                    $.each(trees.models, function (index, tree) {
                        if (tree.getId() == self._markers[j].options.id) {
                            bFound = true;
                        }
                    });
                    if (!bFound) {
                        // close popup if the marker is selected
                        if (self._markers[j] == self._selectedMarker) {
                            self._selectedMarker.closePopup();
                        }
                        self.removeMarker(self._markers[j]);
                        self._markers = _.without(self._markers, self._markers[j]);
                        j--;
                    }
                    j++;
                }
            };
            this.removeTreeInfo = function () {
                var self = _this;
                self._map.closePopup();
            };
            this.closeMapFilter = function () {
                var self = _this;
                self.$('#wrapper-mapfilter').animate({ left: -260 }, FoodParent.Setting.getFilterAnimDuration());
            };
            this.openMapFilter = function () {
                var self = _this;
                self.$('#wrapper-mapfilter').animate({ left: 0 }, FoodParent.Setting.getFilterAnimDuration());
            };
            var self = this;
            self.bDebug = true;
            self._zoom = FoodParent.Setting.getDefaultMapZoomLevel();
            self._markers = new Array();
            self.events = {
                "click .evt-close": "removeTreeInfo",
                "click .btn-mapfilter": "_toggleMapFilter",
            };
            self.delegateEvents();
        }
        TreesMapView.prototype.resize = function () {
            var self = this;
            self._map.invalidateSize(false);
            if (self._selectedMarker) {
                if (FoodParent.View.getWidth() > FoodParent.View.getHeight()) {
                    self._map.panTo(new L.LatLng(self._selectedMarker.getLatLng().lat, self._selectedMarker.getLatLng().lng + self._map.getSize().x * 0.0001));
                }
                else {
                    self._map.panTo(new L.LatLng(self._selectedMarker.getLatLng().lat + self._map.getSize().y * 0.000075, self._selectedMarker.getLatLng().lng));
                }
            }
        };
        TreesMapView.prototype.render = function (args) {
            _super.prototype.render.call(this, args);
            var self = this;
            if (self.bDebug)
                console.log(TreesMapView.TAG + "render()");
            var template = _.template(FoodParent.Template.getTreesMapViewWrapperTemplate());
            self.$el.html(template({}));
            self.setElement(self.$('#wrapper-trees'));
            return self;
        };
        TreesMapView.prototype.update = function (args) {
            _super.prototype.update.call(this, args);
            var self = this;
            if (self.bDebug)
                console.log(TreesMapView.TAG + "update()");
            return self;
        };
        TreesMapView.prototype.setLocation = function (location) {
            var self = this;
            self._location = location;
        };
        TreesMapView.prototype.addMarker = function (tree, editable) {
            var self = this;
            var marker = FoodParent.MarkerFractory.create(tree, true, editable);
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
            // Re-render marker for dragend event
            marker.on("dragend", function (event) {
                if (marker.options.id != undefined) {
                    var tree = FoodParent.Model.getTrees().findWhere({
                        id: marker.options.id
                    });
                    FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.UPDATE_LOCATION, { marker: marker, location: marker.getLatLng() }, function () {
                        var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                        self.renderRecentComments(tree);
                        FoodParent.EventHandler.handleDataChange("Location of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                        self.renderTreeInfo(tree);
                    }, function () {
                        FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                }
            });
        };
        TreesMapView.prototype.removeMarker = function (marker) {
            var self = this;
            self._map.removeLayer(marker);
        };
        TreesMapView.prototype.renderRecentComments = function (tree) {
            var self = this;
            var trees = new Array();
            trees.push(tree);
            FoodParent.Controller.fetchNotesOfTrees(trees, FoodParent.NoteType.IMAGE, FoodParent.Setting.getNumRecentActivitiesShown(), 0, function () {
                var notes = new FoodParent.Notes(FoodParent.Model.getNotes().where({ tree: tree.getId(), type: FoodParent.NoteType.IMAGE }));
                notes.sortByDescendingDate();
                var template = _.template(FoodParent.Template.getRecentCommentsTemplate());
                var data = {
                    notes: notes,
                    size: FoodParent.Setting.getNumRecentActivitiesShown(),
                    coordinate: '@ ' + tree.getLat().toFixed(4) + ", " + tree.getLng().toFixed(4),
                    flags: FoodParent.Model.getFlags(),
                    ownerships: FoodParent.Model.getOwnerships(),
                };
                self.$('#list-comments').html(template(data));
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        };
        TreesMapView.prototype._toggleMapFilter = function (event) {
            var self = this;
            if (parseFloat(self.$('#wrapper-mapfilter').css('left')) == 0) {
                self.closeMapFilter();
            }
            else {
                self.openMapFilter();
            }
        };
        TreesMapView.TAG = "TreesMapView - ";
        return TreesMapView;
    })(FoodParent.TreesView);
    FoodParent.TreesMapView = TreesMapView;
})(FoodParent || (FoodParent = {}));
