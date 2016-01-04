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
            else if (viewMode == FoodParent.VIEW_MODE.TABLE) {
                view = new ManageTreesTableView({ el: el });
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
    var ManageTreesTableView = (function (_super) {
        __extends(ManageTreesTableView, _super);
        function ManageTreesTableView(options) {
            var _this = this;
            _super.call(this, options);
            this.renderTrees = function () {
                var self = _this;
                FoodParent.Controller.fetchAllTrees(function () {
                    // add grid instance for existing data
                    var optionValues = new Array();
                    optionValues.push({ name: "Food", values: FoodParent.Model.getFoods().toArray() });
                    TreeColumn[0].cell = Backgrid.SelectCell.extend({
                        editor: Backgrid.FoodSelectCellEditor,
                        optionValues: optionValues,
                    });
                    var grid = new Backgrid.Grid({
                        columns: TreeColumn,
                        collection: FoodParent.Model.getTrees(),
                        emptyText: FoodParent.Setting.getNoDataText(),
                    });
                    grid.render();
                    //grid.sort("name", "ascending");
                    self.$(".list-tree").html(grid.el);
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            };
            var self = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = {
                "click .switch-map": "_mouseClick",
            };
            self.delegateEvents();
        }
        ManageTreesTableView.prototype.render = function (args) {
            if (this.bRendered) {
                this.update(args);
                return self;
            }
            this.bRendered = true;
            var self = this;
            if (self.bDebug)
                console.log(ManageTreesTableView.TAG + "render()");
            var template = _.template(FoodParent.Template.getManageTreesTableViewTemplate());
            var data = {};
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-mtrees'));
            self.resize();
            self.renderTrees();
        };
        ManageTreesTableView.prototype.resize = function () {
            $('#content-mtrees-table').css({ width: FoodParent.View.getWidth() - $('#wrapper-tablemenu').outerWidth() });
            $('#wrapper-main').css({ height: FoodParent.View.getHeight() - 60 });
            $('#wrapper-mtrees').css({ height: FoodParent.View.getHeight() - 60 });
            $('.collapsible-list').css({ height: FoodParent.View.getHeight() - 60 - 34 * 4 - 20 });
        };
        ManageTreesTableView.prototype._mouseOver = function (event) {
            var self = this;
            //EventHandler.handleMouseOver($(event.currentTarget), self);
        };
        ManageTreesTableView.prototype._mouseClick = function (event) {
            var self = this;
            FoodParent.EventHandler.handleMouseClick($(event.currentTarget), self);
        };
        ManageTreesTableView.TAG = "ManageTreesMapView - ";
        return ManageTreesTableView;
    })(ManageTreesView);
    FoodParent.ManageTreesTableView = ManageTreesTableView;
    var ManageTreesMapView = (function (_super) {
        __extends(ManageTreesMapView, _super);
        function ManageTreesMapView(options) {
            var _this = this;
            _super.call(this, options);
            this._bClosePopupOnClick = true;
            this.renderFilterList = function () {
                var self = _this;
                var template = _.template(FoodParent.Template.getTreeFilterListTemplate());
                var data = {
                    foods: FoodParent.Model.getFoods(),
                };
                self.$('#filter-list').html(template(data));
            };
            this.renderForagableList = function () {
            };
            this.renderTreeInfo = function (tree) {
                var self = _this;
                FoodParent.Controller.fetchAllFlagsAndOwners(function () {
                    var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                    var flag = FoodParent.Model.getFlags().findWhere({ id: tree.getFlagId() });
                    var ownership = FoodParent.Model.getOwnerships().findWhere({ id: tree.getOwnershipId() });
                    var template = _.template(FoodParent.Template.getTreeInfoTemplate());
                    var data = {
                        foodname: food.getName(),
                        treename: tree.getName(),
                        lat: tree.getLat().toFixed(4),
                        lng: tree.getLng().toFixed(4),
                        flags: FoodParent.Model.getFlags(),
                        ownerships: FoodParent.Model.getOwnerships(),
                        description: tree.getDescription(),
                    };
                    self.$('#wrapper-treeinfo').html(template(data));
                    self.$('#wrapper-treeinfo').removeClass('hidden');
                    self.renderFlagInfo(flag);
                    self.renderOwnershipInfo(ownership);
                    self.renderRecentActivities(tree);
                    FoodParent.GeoLocation.reverseGeocoding(tree.getLocation(), function (data) {
                        self.$(".tree-info-address").html("<div>" + data.road + ", " + data.county + "</div><div>" + data.state + ", " + data.country + ", " + data.postcode + "</div>");
                    }, function () {
                        FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                    self.$('.input-description').on('click', function (event) {
                        console.log($(this).text());
                        $(this).replaceWith("<input type='text' class='input-description form-control' value='" + htmlEncode($(this).text()) + "' />");
                        //self.$('.input-lat').css({ width: width });
                        self.$('.input-description').focus();
                        self.$('.input-description').on('focusout', function (event) {
                            var description = self.$('.input-description').val();
                            if (tree.getDescription().trim() != description.trim()) {
                                FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.UPDATE_DESCRIPTION, { description: description }, function () {
                                    var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                                    self.renderRecentActivities(tree);
                                    FoodParent.EventHandler.handleDataChange("Description of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                                    self.renderTreeInfo(tree);
                                }, function () {
                                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                                });
                            }
                            else {
                                self.renderTreeInfo(tree);
                            }
                        });
                    });
                    self.$('.input-food').on('click', function (event) {
                        var template = _.template(FoodParent.Template.FoodSelectTemplate());
                        var data = {
                            foods: FoodParent.Model.getFoods(),
                        };
                        $(this).replaceWith(template(data));
                        self.$('.input-food').selectpicker();
                        self.$('.input-food').selectpicker("val", food.getId());
                        self.$('.input-food').on('hide.bs.dropdown', function (event) {
                            var selected = parseInt($(this).find("option:selected").val());
                            if (tree.getFoodId() != selected) {
                                FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.UPDATE_FOODTYPE, { food: selected }, function () {
                                    var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                                    var flag = FoodParent.Model.getFlags().findWhere({ id: tree.getFlagId() });
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
                        });
                    });
                    self.$('.input-lat').on('click', function (event) {
                        $(this).replaceWith("<input class='input-lat form-control' value='" + $(this).html() + "' />");
                        //self.$('.input-lat').css({ width: width });
                        self.$('.input-lat').focus();
                        self.$('.input-lat').on('focusout', function (event) {
                            var location = new L.LatLng(parseFloat(self.$('.input-lat').val()), self._selectedMarker.getLatLng().lng);
                            if (location.lat != self._selectedMarker.getLatLng().lat) {
                                if (self._selectedMarker != undefined && self._selectedMarker.options.id != undefined) {
                                    FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.UPDATE_LOCATION, { marker: self._selectedMarker, location: location }, function () {
                                        var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                                        self.renderRecentActivities(tree);
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
                        });
                    });
                    self.$('.input-lng').on('click', function (event) {
                        var width = self.$('.input-lng').outerWidth() + 8;
                        $(this).replaceWith("<input class='input-lng form-control' value='" + $(this).html() + "' />");
                        //self.$('.input-lng').css({ width: width });
                        self.$('.input-lng').focus();
                        self.$('.input-lng').on('focusout', function (event) {
                            var location = new L.LatLng(self._selectedMarker.getLatLng().lat, parseFloat(self.$('.input-lng').val()));
                            if (location.lng != self._selectedMarker.getLatLng().lng) {
                                if (self._selectedMarker != undefined && self._selectedMarker.options.id != undefined) {
                                    FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.UPDATE_LOCATION, { marker: self._selectedMarker, location: location }, function () {
                                        var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                                        self.renderRecentActivities(tree);
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
                        });
                    });
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            };
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
                    self.$('#content-map').css({ height: FoodParent.View.getHeight() - 60 });
                    self.setLocation(new L.LatLng(position.coords.latitude, position.coords.longitude));
                    self._map = L.map(self.$('#content-map')[0].id, {
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
                        //$('.leaflet-popup-content .marker-control-item').off('click');
                        //$('.leaflet-popup-content .marker-control-item').on('click', function (event) {
                        //    //console.log($('.leaflet-popup-content .glyphicon').attr('data-id'));
                        //    Router.getInstance().navigate("tree/" + $('.leaflet-popup-content .glyphicon').attr('data-id'), { trigger: true });
                        //});
                        var tree = FoodParent.Model.getTrees().findWhere({ id: marker.options.id });
                        self.renderTreeInfo(tree);
                        self._selectedMarker = marker;
                        // Make MessageView invisible.
                        if (FoodParent.View.getMessageView()) {
                            FoodParent.View.getMessageView().setInvisible();
                        }
                    });
                    self._map.on('popupclose', function (event) {
                        var marker = event.popup._source;
                        marker._resetZIndex();
                        $(marker.label._container).removeClass('active');
                        self.$('#wrapper-treeinfo').addClass('hidden');
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
                // Render filter list
                self.renderFilterList();
                // Render foragable list
            };
            this.updateMarkers = function (trees) {
                var self = _this;
                console.log(ManageTreesMapView.TAG + "updateMarkers()");
                // Add new markers
                $.each(trees.models, function (index, tree) {
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
                "click .collapsible-button": "_openCollapsible",
                "click .filter-checkbox": "_applyFilter",
                "click .flag-radio": "_applyFlag",
                "click .ownership-radio": "_applyOwnership",
                "click .add-tree": "_addNewTree",
                "click .switch-table": "_mouseClick",
            };
            self.delegateEvents();
        }
        ManageTreesMapView.prototype.resize = function () {
            $('#wrapper-main').css({ height: FoodParent.View.getHeight() - 60 });
            $('#wrapper-mtrees').css({ height: FoodParent.View.getHeight() - 60 });
            $('.collapsible-list').css({ height: FoodParent.View.getHeight() - 60 - 34 * 4 - 20 });
        };
        ManageTreesMapView.prototype.render = function (args) {
            if (this.bRendered) {
                this.update(args);
                return self;
            }
            this.bRendered = true;
            var self = this;
            if (self.bDebug)
                console.log(ManageTreesMapView.TAG + "render()");
            var template = _.template(FoodParent.Template.getManageTreesMapViewTemplate());
            var data = {};
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-mtrees'));
            self.resize();
            FoodParent.Controller.updateGeoLocation(self.renderMap, self.renderMapError);
            return self;
        };
        ManageTreesMapView.prototype.update = function (args) {
            if (!this.bRendered) {
                this.render(args);
                return self;
            }
            ////
            var self = this;
            if (self.bDebug)
                console.log(ManageTreesMapView.TAG + "update()");
            return self;
        };
        ManageTreesMapView.prototype.renderOwnershipInfo = function (flag) {
            var self = this;
            $.each(self.$('.ownership-radio'), function (index, item) {
                if (parseInt($(item).attr('data-target')) == flag.getId()) {
                    $(item).addClass('active');
                    $(item).find('input').prop({ 'checked': 'checked' });
                }
                else {
                    $(item).removeClass('active');
                    $(item).find('input').prop({ 'checked': '' });
                }
            });
        };
        ManageTreesMapView.prototype.renderFlagInfo = function (flag) {
            var self = this;
            $.each(self.$('.flag-radio'), function (index, item) {
                if (parseInt($(item).attr('data-target')) == flag.getId()) {
                    $(item).addClass('active');
                    $(item).find('input').prop({ 'checked': 'checked' });
                }
                else {
                    $(item).removeClass('active');
                    $(item).find('input').prop({ 'checked': '' });
                }
            });
        };
        ManageTreesMapView.prototype.renderRecentActivities = function (tree) {
            var self = this;
            var trees = new Array();
            trees.push(tree);
            FoodParent.Controller.fetchNotesOfTrees(trees, FoodParent.Setting.getNumRecentActivitiesShown(), 0, function () {
                var notes = new FoodParent.Notes(FoodParent.Model.getNotes().where({ tree: tree.getId() }));
                notes.sortByDescendingDate();
                var template = _.template(FoodParent.Template.getRecentActivitiesTemplate());
                var data = {
                    notes: notes,
                    coordinate: '@ ' + tree.getLat().toFixed(4) + ", " + tree.getLng().toFixed(4),
                    flags: FoodParent.Model.getFlags(),
                    ownerships: FoodParent.Model.getOwnerships(),
                };
                self.$('#list-activities').html(template(data));
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        };
        ManageTreesMapView.prototype.removeMarker = function (marker) {
            var self = this;
            self._map.removeLayer(marker);
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
                    FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.UPDATE_LOCATION, { marker: marker, location: marker.getLatLng() }, function () {
                        var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                        self.renderRecentActivities(tree);
                        FoodParent.EventHandler.handleDataChange("Location of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                        self.renderTreeInfo(tree);
                    }, function () {
                        FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                }
            });
        };
        ManageTreesMapView.prototype.deleteTree = function (tree) {
            var self = this;
            FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.DELETE, {}, function () {
                var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                self.updateMarkers(FoodParent.Model.getTrees());
                FoodParent.EventHandler.handleDataChange("<strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has deleted successfully.", false);
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
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
        ManageTreesMapView.prototype._openCollapsible = function (event) {
            var self = this;
            $('.collapsible-list').addClass('hidden');
            $($(event.currentTarget).attr('data-target')).removeClass('hidden');
        };
        ManageTreesMapView.prototype._applyFilter = function (event) {
            var self = this;
            var trees = FoodParent.Model.getTrees();
            setTimeout(function () {
                // Filtering food type.
                if ($(event.target).find('input').prop('name') == 'foodsall') {
                    if ($(event.target).find('input').prop('checked') == true) {
                        $('.filter-food').addClass('active');
                        $('.filter-food input').prop({ 'checked': 'checked' });
                    }
                    else {
                        $('.filter-food').removeClass('active');
                        $('.filter-food input').prop({ 'checked': '' });
                    }
                }
                // Apply food filtering
                var foodIds = new Array();
                $.each($('.filter-food input'), function (index, item) {
                    if ($(item).prop('checked') == true) {
                        foodIds.push(Math.floor($(item).prop('name')));
                    }
                });
                trees = trees.filterByFoodIds(foodIds);
                // Filtering adoption status.
                if ($(event.target).find('input').prop('name') == 'adoptsall') {
                    if ($(event.target).find('input').prop('checked') == true) {
                        $('.filter-adopt').addClass('active');
                        $('.filter-adopt input').prop({ 'checked': 'checked' });
                    }
                    else {
                        $('.filter-adopt').removeClass('active');
                        $('.filter-adopt input').prop({ 'checked': '' });
                    }
                }
                // update markers
                self.updateMarkers(trees);
            }, 1);
        };
        ManageTreesMapView.prototype._applyFlag = function (event) {
            var self = this;
            var tree = FoodParent.Model.getTrees().findWhere({ id: self._selectedMarker.options.id });
            var flag = parseInt($(event.target).attr('data-target'));
            if (tree.getFlagId() != flag) {
                FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.UPDATE_FLAG, { flag: flag }, function () {
                    var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                    var flag = FoodParent.Model.getFlags().findWhere({ id: tree.getFlagId() });
                    self.renderFlagInfo(flag);
                    self.renderRecentActivities(tree);
                    FoodParent.EventHandler.handleDataChange("Status of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            }
        };
        ManageTreesMapView.prototype._applyOwnership = function (event) {
            var self = this;
            var tree = FoodParent.Model.getTrees().findWhere({ id: self._selectedMarker.options.id });
            var ownership = parseInt($(event.target).attr('data-target'));
            if (tree.getOwnershipId() != ownership) {
                FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.UPDATE_OWNERSHIP, { ownership: ownership }, function () {
                    var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                    var ownership = FoodParent.Model.getOwnerships().findWhere({ id: tree.getOwnershipId() });
                    self.renderOwnershipInfo(ownership);
                    self.renderRecentActivities(tree);
                    FoodParent.EventHandler.handleDataChange("Ownership of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            }
        };
        ManageTreesMapView.prototype._addNewTree = function (event) {
            var self = this;
            var tree = new FoodParent.Tree({ lat: self._map.getCenter().lat, lng: self._map.getCenter().lng, food: 0, type: 0, flag: 0, owner: 0, ownership: 0, description: "" });
            FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.CREATE, {}, function () {
                var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                self.updateMarkers(FoodParent.Model.getTrees());
                for (var j = 0; j < self._markers.length; j++) {
                    if (self._markers[j].options.id == tree.getId()) {
                        self._markers[j].openPopup();
                        break;
                    }
                }
                FoodParent.EventHandler.handleDataChange("<strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has been created successfully.", true);
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            }, function () {
                var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                FoodParent.EventHandler.handleDataChange("<strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has been deleted successfully.", false);
                self.updateMarkers(FoodParent.Model.getTrees());
            });
        };
        ManageTreesMapView.TAG = "ManageTreesMapView - ";
        return ManageTreesMapView;
    })(ManageTreesView);
    FoodParent.ManageTreesMapView = ManageTreesMapView;
})(FoodParent || (FoodParent = {}));
