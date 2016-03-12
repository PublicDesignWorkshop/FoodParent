var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var TreesViewFractory = (function () {
        function TreesViewFractory(args) {
            if (TreesViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use TreesViewFractory.getInstance() instead of new.");
            }
            TreesViewFractory._instance = this;
        }
        TreesViewFractory.getInstance = function () {
            return TreesViewFractory._instance;
        };
        TreesViewFractory.create = function (el, id, credential) {
            var view;
            if (credential == FoodParent.CREDENTIAL_MODE.GUEST) {
                view = new FoodParent.TreesMapViewForGuest({ el: el });
            }
            else if (credential == FoodParent.CREDENTIAL_MODE.PARENT) {
                view = new FoodParent.TreesMapViewForParent({ el: el });
            }
            else if (credential == FoodParent.CREDENTIAL_MODE.ADMIN) {
                view = new FoodParent.TreesMapViewForAdmin({ el: el });
            }
            view.setTreeId(id);
            return view;
        };
        TreesViewFractory._instance = new TreesViewFractory();
        return TreesViewFractory;
    })();
    FoodParent.TreesViewFractory = TreesViewFractory;
    var TreesView = (function (_super) {
        __extends(TreesView, _super);
        function TreesView() {
            _super.apply(this, arguments);
            this.renderTreeInfo = function (tree) { };
            this.removeTreeInfo = function () { };
            this.renderFilterList = function () { };
            this.closeMapFilter = function () { };
            this.panToCurrentLocation = function () { };
        }
        TreesView.prototype.render = function (args) {
            _super.prototype.render.call(this, args);
            var self = this;
            return self;
        };
        TreesView.prototype.update = function (args) {
            _super.prototype.update.call(this, args);
            var self = this;
            return self;
        };
        TreesView.prototype.resize = function () {
            _super.prototype.resize.call(this);
            var self = this;
        };
        TreesView.prototype.setTreeId = function (id) {
            this._id = id;
        };
        TreesView.prototype._applyFilter = function (event) { };
        return TreesView;
    })(FoodParent.BaseView);
    FoodParent.TreesView = TreesView;
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
                if (self._id != 0) {
                    FoodParent.Controller.fetchAllTrees(function () {
                        var tree = FoodParent.Model.getTrees().findWhere({ id: Math.floor(self._id) });
                        self._location = tree.getLocation();
                        // Move the map slight off from the center using CRS projection
                        var point = L.CRS.EPSG3857.latLngToPoint(self._location, FoodParent.Setting.getMapCenterZoomLevel());
                        if (FoodParent.View.getWidth() > FoodParent.View.getHeight()) {
                            point.x += self.$('#content-map').outerWidth() * 0.2;
                        }
                        else {
                            point.y -= self.$('#content-map').outerHeight() * 0.2;
                        }
                        // Rener map only when the map is not rendered in a browswer
                        if (self._map == undefined) {
                            self.$('#list-donation').css({ height: FoodParent.View.getHeight() - 60 });
                            self.setLocation(L.CRS.EPSG3857.pointToLatLng(point, FoodParent.Setting.getMapCenterZoomLevel()));
                            self._map = L.map($('#content-map')[0].id, {
                                zoomControl: false,
                                closePopupOnClick: self._bClosePopupOnClick,
                                doubleClickZoom: true,
                                touchZoom: true,
                                zoomAnimation: true,
                                markerZoomAnimation: true,
                            }).setView(self._location, FoodParent.Setting.getMapCenterZoomLevel());
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
                                // Move the map slight off from the center using CRS projection
                                var point = L.CRS.EPSG3857.latLngToPoint(self._selectedMarker.getLatLng(), self._map.getZoom());
                                if (FoodParent.View.getWidth() > FoodParent.View.getHeight()) {
                                    point.x += self._map.getSize().x * 0.225;
                                }
                                else {
                                    point.y -= self._map.getSize().y * 0.25;
                                }
                                self._map.panTo(L.CRS.EPSG3857.pointToLatLng(point, self._map.getZoom()));
                                // Close map filter for mobile portrait view
                                if (FoodParent.View.getWidth() < FoodParent.View.getHeight()) {
                                    self.closeMapFilter();
                                }
                                // Refresh rating of a tree in popup control panel
                                FoodParent.Controller.fetchLatestCommentOfTrees([tree], function () {
                                    var note = FoodParent.Model.getNotes().getLatestImageNoteOfDate(tree.getId(), new Date().valueOf(), FoodParent.NoteType.IMAGE);
                                    if (note == null) {
                                        self.$('#text-rating').html("0");
                                    }
                                    else {
                                        self.$('#text-rating').html(note.getRate().toString());
                                    }
                                }, function (errorMode) {
                                    FoodParent.EventHandler.handleError(errorMode);
                                });
                                FoodParent.Router.getInstance().navigate("trees/" + tree.getId(), { trigger: false, replace: true });
                            });
                            self._map.on('popupclose', function (event) {
                                var marker = event.popup._source;
                                marker._resetZIndex();
                                $(marker.label._container).removeClass('active');
                                self.$('#wrapper-treeinfo').addClass('hidden');
                                self._selectedMarker = null;
                                FoodParent.Router.getInstance().navigate("trees/0", { trigger: false, replace: true });
                            });
                        }
                    }, function (errorMode) {
                        FoodParent.EventHandler.handleError(errorMode);
                    });
                }
                else {
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
                            // Move the map slight off from the center using CRS projection
                            var point = L.CRS.EPSG3857.latLngToPoint(self._selectedMarker.getLatLng(), self._map.getZoom());
                            if (FoodParent.View.getWidth() > FoodParent.View.getHeight()) {
                                point.x += self._map.getSize().x * 0.225;
                            }
                            else {
                                point.y -= self._map.getSize().y * 0.25;
                            }
                            self._map.panTo(L.CRS.EPSG3857.pointToLatLng(point, self._map.getZoom()));
                            // Close map filter for mobile portrait view
                            if (FoodParent.View.getWidth() < FoodParent.View.getHeight()) {
                                self.closeMapFilter();
                            }
                            // Refresh rating of a tree in popup control panel
                            FoodParent.Controller.fetchLatestCommentOfTrees([tree], function () {
                                var note = FoodParent.Model.getNotes().getLatestImageNoteOfDate(tree.getId(), new Date().valueOf(), FoodParent.NoteType.IMAGE);
                                if (note == null) {
                                    self.$('#text-rating').html("0");
                                }
                                else {
                                    self.$('#text-rating').html(note.getRate().toString());
                                }
                            }, function (errorMode) {
                                FoodParent.EventHandler.handleError(errorMode);
                            });
                            FoodParent.Router.getInstance().navigate("trees/" + tree.getId(), { trigger: false, replace: true });
                        });
                        self._map.on('popupclose', function (event) {
                            var marker = event.popup._source;
                            marker._resetZIndex();
                            $(marker.label._container).removeClass('active');
                            self.$('#wrapper-treeinfo').addClass('hidden');
                            self._selectedMarker = null;
                            FoodParent.Router.getInstance().navigate("trees/0", { trigger: false, replace: true });
                        });
                    }
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
            this.panToCurrentLocation = function () {
                var self = _this;
                FoodParent.Controller.updateGeoLocation(function (position) {
                    self._location = new L.LatLng(position.coords.latitude, position.coords.longitude);
                    // Move the map slight off from the center using CRS projection
                    var point = L.CRS.EPSG3857.latLngToPoint(self._location, self._map.getZoom());
                    if (FoodParent.View.getWidth() > FoodParent.View.getHeight()) {
                        point.x += self._map.getSize().x * 0.2;
                    }
                    else {
                        point.y -= self._map.getSize().y * 0.2;
                    }
                    self._map.panTo(L.CRS.EPSG3857.pointToLatLng(point, self._map.getZoom()));
                }, self.renderMapError);
            };
            var self = this;
            self.bDebug = true;
            self._zoom = FoodParent.Setting.getDefaultMapZoomLevel();
            self._markers = new Array();
            self.events = {
                "click .evt-close": "removeTreeInfo",
                "click .btn-mapfilter": "_toggleMapFilter",
                "click .evt-marker-lock": "_toggleMarkerLock",
            };
            self.delegateEvents();
        }
        TreesMapView.prototype.resize = function () {
            var self = this;
            self._map.invalidateSize(false);
            if (self._selectedMarker) {
                // Move the map slight off from the center using CRS projection
                var point = L.CRS.EPSG3857.latLngToPoint(self._selectedMarker.getLatLng(), self._map.getZoom());
                if (FoodParent.View.getWidth() > FoodParent.View.getHeight()) {
                    point.x += self._map.getSize().x * 0.225;
                }
                else {
                    point.y -= self._map.getSize().y * 0.25;
                }
                self._map.panTo(L.CRS.EPSG3857.pointToLatLng(point, self._map.getZoom()));
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
        TreesMapView.prototype._searchFood = function (event) {
            var self = this;
            if (self._timeout1) {
                clearTimeout(self._timeout1);
            }
            if (self._timeout2) {
                clearTimeout(self._timeout2);
            }
            self._timeout1 = setTimeout(function () {
                if (event.keyCode == 27) {
                    self.$('#input-search-food').val("");
                    self._resetSearchFood();
                }
                else if (self.$('#input-search-food').val().trim() != "") {
                    self._timeout2 = setTimeout(function () {
                        self.$('#wrapper-list-food').removeClass('hidden');
                        self.$('#wrapper-list-food').scrollTop(0);
                    }, 500);
                }
                else {
                    self.$('#wrapper-list-food').addClass('hidden');
                    self._resetSearchFood();
                }
            }, 10);
        };
        TreesMapView.prototype._resetSearchFood = function (event) {
            var self = this;
            self._selectedFood = null;
            self.$('#input-search-food').val("");
            self.$('#wrapper-list-food').addClass('hidden');
            // Apply filter
            self._applyFilter();
        };
        TreesMapView.prototype._applySearch = function (event) {
            var self = this;
            var food = FoodParent.Model.getFoods().findWhere({
                'id': parseInt($(event.currentTarget).attr('data-id'))
            });
            if (food != null) {
                self._selectedFood = food;
                self.$('#search-food').val(food.getName());
            }
            // Hide search list
            self.$('#input-search-food').val(food.getName());
            self.$('#wrapper-list-food').addClass('hidden');
            // Apply filter
            self._applyFilter();
        };
        TreesMapView.prototype._resetFilter = function (event) {
            var self = this;
            // Set the status of right corner button based on filter on / off status
            self.$('.filter-owner-all').addClass('active');
            self.$('.filter-adopt-all').addClass('active');
            self.$('.filter-flag-all').addClass('active');
            self.$('.filter-rating-all').addClass('active');
            self.$('.filter-last-all').addClass('active');
            self.$('.filter-owner-item').removeClass('active');
            self.$('.filter-adopt-item').removeClass('active');
            self.$('.filter-flag-item').removeClass('active');
            self.$('.filter-rating-item').removeClass('active');
            self.$('.filter-last-item').removeClass('active');
            if (self.$('.filter-owner-all').hasClass('active') && self.$('.filter-adopt-all').hasClass('active') && self.$('.filter-flag-all').hasClass('active') && self.$('.filter-rating-all').hasClass('active') && self.$('.filter-last-all').hasClass('active')) {
                self.$('.icon-mapfilter-status').removeClass('active');
                self.$('.text-mapfilter-status').removeClass('active');
                self.$('.text-mapfilter-status').html('off');
            }
            else {
                self.$('.icon-mapfilter-status').addClass('active');
                self.$('.text-mapfilter-status').addClass('active');
                self.$('.text-mapfilter-status').html('on');
            }
            self._applyFilter();
        };
        TreesMapView.prototype._clickFilter = function (event) {
            var self = this;
            // Ownership filter
            if ($(event.currentTarget).hasClass('filter-owner-item')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                }
                else {
                    $(event.currentTarget).addClass('active');
                }
                if (self.$('.filter-owner-item').length == self.$('.filter-owner-item.active').length) {
                    self.$('.filter-owner-all').addClass('active');
                }
                else {
                    self.$('.filter-owner-all').removeClass('active');
                }
            }
            if ($(event.currentTarget).hasClass('filter-owner-all')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                    self.$('.filter-owner-item').removeClass('active');
                }
                else {
                    $(event.currentTarget).addClass('active');
                    self.$('.filter-owner-item').addClass('active');
                }
            }
            // Adoption filter
            if ($(event.currentTarget).hasClass('filter-adopt-item')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                }
                else {
                    $(event.currentTarget).addClass('active');
                }
                if (self.$('.filter-adopt-item').length == self.$('.filter-adopt-item.active').length) {
                    self.$('.filter-adopt-all').addClass('active');
                }
                else {
                    self.$('.filter-adopt-all').removeClass('active');
                }
            }
            if ($(event.currentTarget).hasClass('filter-adopt-all')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                    self.$('.filter-adopt-item').removeClass('active');
                }
                else {
                    $(event.currentTarget).addClass('active');
                    self.$('.filter-adopt-item').addClass('active');
                }
            }
            // Status filter
            if ($(event.currentTarget).hasClass('filter-flag-item')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                }
                else {
                    $(event.currentTarget).addClass('active');
                }
                if (self.$('.filter-flag-item').length == self.$('.filter-flag-item.active').length) {
                    self.$('.filter-flag-all').addClass('active');
                }
                else {
                    self.$('.filter-flag-all').removeClass('active');
                }
            }
            if ($(event.currentTarget).hasClass('filter-flag-all')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                    self.$('.filter-flag-item').removeClass('active');
                }
                else {
                    $(event.currentTarget).addClass('active');
                    self.$('.filter-flag-item').addClass('active');
                }
            }
            // Rating filter
            if ($(event.currentTarget).hasClass('filter-rating-item')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                }
                else {
                    $(event.currentTarget).addClass('active');
                }
                if (self.$('.filter-rating-item').length == self.$('.filter-rating-item.active').length) {
                    self.$('.filter-rating-all').addClass('active');
                }
                else {
                    self.$('.filter-rating-all').removeClass('active');
                }
            }
            if ($(event.currentTarget).hasClass('filter-rating-all')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                    self.$('.filter-rating-item').removeClass('active');
                }
                else {
                    $(event.currentTarget).addClass('active');
                    self.$('.filter-rating-item').addClass('active');
                }
            }
            // Last updated filter
            if ($(event.currentTarget).hasClass('filter-last-item')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                }
                else {
                    $(event.currentTarget).addClass('active');
                }
                if (self.$('.filter-last-item').length == self.$('.filter-last-item.active').length) {
                    self.$('.filter-last-all').addClass('active');
                }
                else {
                    self.$('.filter-last-all').removeClass('active');
                }
            }
            if ($(event.currentTarget).hasClass('filter-last-all')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                    self.$('.filter-last-item').removeClass('active');
                }
                else {
                    $(event.currentTarget).addClass('active');
                    self.$('.filter-last-item').addClass('active');
                }
            }
            // Set the status of right corner button based on filter on / off status
            if (self.$('.filter-owner-all').hasClass('active') && self.$('.filter-adopt-all').hasClass('active') && self.$('.filter-flag-all').hasClass('active') && self.$('.filter-rating-all').hasClass('active') && self.$('.filter-last-all').hasClass('active')) {
                self.$('.icon-mapfilter-status').removeClass('active');
                self.$('.text-mapfilter-status').removeClass('active');
                self.$('.text-mapfilter-status').html('off');
            }
            else {
                self.$('.icon-mapfilter-status').addClass('active');
                self.$('.text-mapfilter-status').addClass('active');
                self.$('.text-mapfilter-status').html('on');
            }
            // Apply filter
            self._applyFilter();
        };
        TreesMapView.prototype._applyFilter = function (event) {
            var self = this;
            // Find all trees
            var trees = FoodParent.Model.getTrees();
            // Apply food filtering
            if (self._selectedFood != null) {
                trees = trees.filterByFoodIds([self._selectedFood.getId()]);
            }
            // Apply ownership filtering
            var ownershipIds = new Array();
            if (self.$('.filter-owner-all').hasClass('active')) {
                $.each(self.$('.filter-owner-item'), function (index, element) {
                    ownershipIds.push(parseInt($(element).attr('data-id')));
                });
            }
            else {
                $.each(self.$('.filter-owner-item'), function (index, element) {
                    if ($(element).hasClass('active')) {
                        ownershipIds.push(parseInt($(element).attr('data-id')));
                    }
                });
            }
            trees = trees.filterByOwnershipIds(ownershipIds);
            // Apply adoption flitering
            var adoptIds = new Array();
            if (self.$('.filter-adopt-all').hasClass('active')) {
                $.each(self.$('.filter-adopt-item'), function (index, element) {
                    adoptIds.push(parseInt($(element).attr('data-id')));
                });
            }
            else {
                $.each(self.$('.filter-adopt-item'), function (index, element) {
                    if ($(element).hasClass('active')) {
                        adoptIds.push(parseInt($(element).attr('data-id')));
                    }
                });
            }
            trees = trees.filterByAdoptStatus(adoptIds);
            // Apply flag / status flitering
            var flagIds = new Array();
            if (self.$('.filter-flag-all').hasClass('active')) {
                $.each(self.$('.filter-flag-item'), function (index, element) {
                    flagIds.push(parseInt($(element).attr('data-id')));
                });
            }
            else {
                $.each(self.$('.filter-flag-item'), function (index, element) {
                    if ($(element).hasClass('active')) {
                        flagIds.push(parseInt($(element).attr('data-id')));
                    }
                });
            }
            trees = trees.filterByFlagIds(flagIds);
            // Update markers
            self.updateMarkers(trees);
        };
        TreesMapView.prototype._mouseClick = function (event) {
            var self = this;
            if (self._selectedMarker != undefined) {
                FoodParent.EventHandler.handleMouseClick($(event.currentTarget), self, { marker: self._selectedMarker, tree: self._selectedMarker.options.id });
            }
            else {
                FoodParent.EventHandler.handleMouseClick($(event.currentTarget), self, { marker: self._selectedMarker });
            }
        };
        TreesMapView.prototype.renderFlagInfo = function (flags) {
            var self = this;
            FoodParent.Controller.checkIsAdmin(function (response) {
                $.each(self.$('.flag-radio'), function (index, item) {
                    var bFound = false;
                    $.each(flags, function (index2, flag) {
                        if (parseInt($(item).attr('data-target')) == flag) {
                            bFound = true;
                        }
                    });
                    if (bFound) {
                        $(item).addClass('active');
                        $(item).find('input').prop({ 'checked': 'checked' });
                    }
                    else {
                        $(item).removeClass('active');
                        $(item).find('input').prop({ 'checked': '' });
                    }
                    if (parseInt($(item).attr('data-target')) == 0) {
                        $(this).attr('disabled', 'disabled');
                        $(item).addClass('disabled');
                    }
                });
            }, function (response) {
                $.each(self.$('.flag-radio'), function (index, item) {
                    var bFound = false;
                    $.each(flags, function (index2, flag) {
                        if (parseInt($(item).attr('data-target')) == flag) {
                            bFound = true;
                        }
                    });
                    if (bFound) {
                        $(item).addClass('active');
                        $(item).find('input').prop({ 'checked': 'checked' });
                        $(item).removeClass('hidden');
                    }
                    else {
                        $(item).removeClass('active');
                        $(item).find('input').prop({ 'checked': '' });
                        $(item).addClass('hidden');
                    }
                    if (parseInt($(item).attr('data-target')) == 0) {
                        $(this).attr('disabled', 'disabled');
                        $(item).addClass('disabled');
                    }
                    $(item).css({ 'pointer-events': 'none' });
                });
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        };
        TreesMapView.prototype.renderOwnershipInfo = function (ownership) {
            var self = this;
            FoodParent.Controller.checkIsAdmin(function (response) {
                $.each(self.$('.ownership-radio'), function (index, item) {
                    if (ownership != undefined) {
                        if (parseInt($(item).attr('data-target')) == ownership.getId()) {
                            $(item).addClass('active');
                            $(item).find('input').prop({ 'checked': 'checked' });
                        }
                        else {
                            $(item).removeClass('active');
                            $(item).find('input').prop({ 'checked': '' });
                        }
                        if (parseInt($(item).attr('data-target')) == 0) {
                            $(this).attr('disabled', 'disabled');
                            $(item).addClass('disabled');
                        }
                    }
                });
            }, function (response) {
                $.each(self.$('.ownership-radio'), function (index, item) {
                    if (ownership != undefined) {
                        if (parseInt($(item).attr('data-target')) == ownership.getId()) {
                            $(item).addClass('active');
                            $(item).find('input').prop({ 'checked': 'checked' });
                        }
                        else {
                            $(item).removeClass('active');
                            $(item).find('input').prop({ 'checked': '' });
                            $(item).addClass('hidden');
                        }
                        if (parseInt($(item).attr('data-target')) == 0) {
                            $(this).attr('disabled', 'disabled');
                            $(item).addClass('disabled');
                        }
                        $(item).css({ 'pointer-events': 'none' });
                    }
                });
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        };
        TreesMapView.prototype.updateTreeAddress = function (tree, address) {
            var self = this;
            if (address.trim() == '') {
                FoodParent.GeoLocation.reverseGeocoding(tree.getLocation(), function (data) {
                    if ((data.road + ", " + data.county + ", " + data.state + ", " + data.postcode) != tree.getAddress()) {
                        FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.UPDATE_ADDRESS, { address: data.road + ", " + data.county + ", " + data.state + ", " + data.postcode }, function () {
                            var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                            FoodParent.EventHandler.handleDataChange("Address of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has been changed successfully.", true);
                            self.renderTreeInfo(tree);
                        }, function () {
                            FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    }
                    else {
                        self.renderTreeInfo(tree);
                    }
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            }
            else if (tree.getAddress().trim() != address.trim()) {
                FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.UPDATE_ADDRESS, { address: address.trim() }, function () {
                    var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                    FoodParent.EventHandler.handleDataChange("Address of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has been changed successfully.", true);
                    self.renderTreeInfo(tree);
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            }
            else {
                self.renderTreeInfo(tree);
            }
        };
        TreesMapView.prototype.updateTreeDescription = function (tree, description) {
            var self = this;
            if (tree.getDescription().trim() != description.trim()) {
                FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.UPDATE_DESCRIPTION, { description: description }, function () {
                    var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                    FoodParent.EventHandler.handleDataChange("Description of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                    self.renderTreeInfo(tree);
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            }
            else {
                self.renderTreeInfo(tree);
            }
        };
        TreesMapView.prototype.updateTreeFoodType = function (tree, selected) {
            var self = this;
            if (tree.getFoodId() != selected) {
                FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.UPDATE_FOODTYPE, { food: selected }, function () {
                    var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                    FoodParent.EventHandler.handleDataChange("Food type of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                    self._selectedMarker.label._container.innerHTML = food.getName() + " " + tree.getName();
                    self._selectedMarker.setIcon(FoodParent.MarkerFractory.getIcon(food));
                    self.renderTreeInfo(tree);
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
                self.renderTreeInfo(tree);
            }
            else {
                self.renderTreeInfo(tree);
            }
        };
        TreesMapView.prototype.updateTreeLocation = function (tree, location) {
            var self = this;
            if (location.lat != self._selectedMarker.getLatLng().lat || location.lng != self._selectedMarker.getLatLng().lng) {
                if (self._selectedMarker != undefined && self._selectedMarker.options.id != undefined) {
                    FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.UPDATE_LOCATION, { marker: self._selectedMarker, location: location }, function () {
                        var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                        FoodParent.EventHandler.handleDataChange("Location of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                        // Move marker to desired location & update info panel
                        self._selectedMarker.setLatLng(tree.getLocation());
                        self._map.setView(tree.getLocation());
                        self.renderTreeInfo(tree);
                    }, function () {
                        FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                }
            }
            else {
                self.renderTreeInfo(tree);
            }
        };
        TreesMapView.prototype._updateFlag = function (event) {
            var self = this;
            var tree = FoodParent.Model.getTrees().findWhere({ id: self._selectedMarker.options.id });
            var flag = parseInt($(event.target).attr('data-target'));
            setTimeout(function () {
                if ($(event.target).find('input[type="checkbox"]').prop('checked')) {
                    FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.UPDATE_FLAG, { flag: flag, addmode: true }, function () {
                        var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                        self.renderFlagInfo(tree.getFlags());
                        FoodParent.EventHandler.handleDataChange("Status of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                        self._applyFilter();
                    }, function () {
                        FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                }
                else {
                    FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.UPDATE_FLAG, { flag: flag, addmode: false }, function () {
                        var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                        self.renderFlagInfo(tree.getFlags());
                        FoodParent.EventHandler.handleDataChange("Status of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                        self._applyFilter();
                    }, function () {
                        FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                }
            }, 1);
        };
        TreesMapView.prototype._updateOwnership = function (event) {
            var self = this;
            var tree = FoodParent.Model.getTrees().findWhere({ id: self._selectedMarker.options.id });
            var ownership = parseInt($(event.target).attr('data-target'));
            if (tree.getOwnershipId() != ownership) {
                FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.UPDATE_OWNERSHIP, { ownership: ownership }, function () {
                    var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                    var ownership = FoodParent.Model.getOwnerships().findWhere({ id: tree.getOwnershipId() });
                    self.renderOwnershipInfo(ownership);
                    FoodParent.EventHandler.handleDataChange("Ownership of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            }
        };
        /**
         * Toggle marker draggable
         * @param event click event of marker popup control
         */
        TreesMapView.prototype._toggleMarkerLock = function (event) {
            var self = this;
            if (!self._selectedMarker.options.draggable) {
                self._selectedMarker.options.draggable = true;
                self._selectedMarker.dragging.enable();
                $(event.target).html('<i class="fa fa-unlock-alt fa-2x"></i>');
                self._selectedMarker._popup.setContent('<div class="marker-control-wrapper">' + $('.marker-control-wrapper').html() + '</div>');
            }
            else {
                self._selectedMarker.options.draggable = false;
                self._selectedMarker.dragging.disable();
                $(event.target).html('<i class="fa fa-lock fa-2x"></i>');
                self._selectedMarker._popup.setContent('<div class="marker-control-wrapper">' + $('.marker-control-wrapper').html() + '</div>');
            }
        };
        TreesMapView.TAG = "TreesMapView - ";
        return TreesMapView;
    })(TreesView);
    FoodParent.TreesMapView = TreesMapView;
})(FoodParent || (FoodParent = {}));
