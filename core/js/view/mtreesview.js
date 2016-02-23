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
        ManageTreesViewFractory.create = function (el, viewMode, id) {
            var view;
            if (viewMode == FoodParent.VIEW_MODE.MAP) {
                view = new ManageTreesMapView({ el: el });
                view.setTreeId(id);
            }
            else if (viewMode == FoodParent.VIEW_MODE.TABLE) {
                view = new ManageTreesTableView({ el: el });
                view.setTreeId(id);
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
            this.renderTreeInfo = function (tree) {
            };
            this.renderFilterList = function () {
            };
        }
        ManageTreesView.prototype.setTreeId = function (id) {
            this._id = id;
        };
        ManageTreesView.prototype._applyFilter = function (event) {
        };
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
                    self.renderTreeList(FoodParent.Model.getTrees());
                    self.renderFilterList();
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            };
            this.renderTreeList = function (trees) {
                var self = _this;
                var optionValues = new Array();
                optionValues.push({ name: "Food", values: FoodParent.Model.getFoods().toArray() });
                TreeColumn[0].cell = Backgrid.SelectCell.extend({
                    editor: Backgrid.FoodSelectCellEditor,
                    optionValues: optionValues,
                });
                var grid = new Backgrid.Grid({
                    columns: TreeColumn,
                    collection: trees,
                    emptyText: FoodParent.Setting.getNoDataText(),
                });
                grid.render();
                grid.sort("id", "ascending");
                self.$(".list-tree").html(grid.el);
            };
            this._addNewTree = function () {
                var self = _this;
                if (self.$(".new-tree").hasClass('hidden')) {
                    FoodParent.Controller.updateGeoLocation(self.renderNewTree, self.renderGeoLocationError);
                }
                else {
                    self.$(".new-tree").addClass('hidden');
                }
            };
            this.renderNewTree = function (position) {
                var self = _this;
                var tree = new FoodParent.Tree({ lat: position.coords.latitude, lng: position.coords.longitude, food: 1, type: 0, flag: 0, owner: 0, ownership: 1, description: "", address: "" });
                var trees = new FoodParent.Trees();
                trees.add(tree);
                var optionValues = new Array();
                optionValues.push({ name: "Food", values: FoodParent.Model.getFoods().toArray() });
                NewTreeColumn[0].cell = Backgrid.SelectCell.extend({
                    editor: Backgrid.FoodSelectCellEditor,
                    optionValues: optionValues,
                });
                var grid = new Backgrid.Grid({
                    columns: NewTreeColumn,
                    collection: trees,
                    emptyText: FoodParent.Setting.getNoDataText(),
                });
                grid.render();
                //grid.sort("name", "ascending");
                self.$(".new-tree").html('<div class="list-title">Add a New Tree</div>');
                self.$(".new-tree").append(grid.el);
                self.$(".new-tree").removeClass('hidden');
            };
            this.renderGeoLocationError = function (error) {
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
            };
            this.renderFilterList = function () {
                var self = _this;
                FoodParent.Controller.checkLogin(function (data) {
                    if (data.result == true || data.result == 'true') {
                        var template = _.template(FoodParent.Template.getTreeFilterListTemplate());
                        self.$('#filter-list').html(template({
                            foods: FoodParent.Model.getFoods(),
                            userid: parseInt(data.id),
                            flags: FoodParent.Model.getFlags(),
                            ownerships: FoodParent.Model.getOwnerships(),
                        }));
                    }
                    else if (data.result == false || data.result == 'false') {
                        var template = _.template(FoodParent.Template.getTreeFilterListTemplate2());
                        self.$('#filter-list').html(template({
                            foods: FoodParent.Model.getFoods(),
                            flags: FoodParent.Model.getFlags(),
                            ownerships: FoodParent.Model.getOwnerships(),
                        }));
                    }
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            };
            var self = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = {
                "click .switch-map": "_mouseClick",
                "click .filter-checkbox": "_applyFilter",
                "click .add-tree": "_addNewTree",
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
            return self;
        };
        ManageTreesTableView.prototype.resize = function () {
            $('#content-mtrees-table').css({ width: FoodParent.View.getWidth() - $('#wrapper-tablemenu').outerWidth() });
            $('.collapsible-list').css({ height: FoodParent.View.getHeight() - 60 - 34 * 4 - 20 });
        };
        ManageTreesTableView.prototype._applyFilter = function (event) {
            var self = this;
            var trees = FoodParent.Model.getTrees();
            setTimeout(function () {
                // Apply only my trees
                if (self.$('input[name="onlymine"]').prop('checked') == true) {
                    trees = trees.filterByParent(parseInt(self.$('input[name="onlymine"]').attr('data-target')));
                }
                // Filtering ownership type.
                if (event != undefined) {
                    if ($(event.target).find('input').prop('name') == 'ownershipsall') {
                        if ($(event.target).find('input').prop('checked') == true) {
                            $('.filter-ownership').addClass('active');
                            $('.filter-ownership input').prop({ 'checked': 'checked' });
                        }
                        else {
                            $('.filter-ownership').removeClass('active');
                            $('.filter-ownership input').prop({ 'checked': '' });
                        }
                    }
                }
                // Apply ownership filtering
                var ownershipIds = new Array();
                $.each(self.$('.filter-ownership input'), function (index, item) {
                    if ($(item).prop('checked') == true) {
                        ownershipIds.push(Math.floor($(item).prop('name')));
                    }
                });
                trees = trees.filterByOwnershipIds(ownershipIds);
                // Filtering flag type.
                if (event != undefined) {
                    if ($(event.target).find('input').prop('name') == 'flagsall') {
                        if ($(event.target).find('input').prop('checked') == true) {
                            $('.filter-flag').addClass('active');
                            $('.filter-flag input').prop({ 'checked': 'checked' });
                        }
                        else {
                            $('.filter-flag').removeClass('active');
                            $('.filter-flag input').prop({ 'checked': '' });
                        }
                    }
                }
                // Apply flag filtering
                var flagIds = new Array();
                $.each(self.$('.filter-flag input'), function (index, item) {
                    if ($(item).prop('checked') == true) {
                        flagIds.push(Math.floor($(item).prop('name')));
                    }
                });
                trees = trees.filterByFlagIds(flagIds);
                // Filtering food type.
                if (event != undefined) {
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
                }
                // Apply food filtering
                var foodIds = new Array();
                $.each(self.$('.filter-food input'), function (index, item) {
                    if ($(item).prop('checked') == true) {
                        foodIds.push(Math.floor($(item).prop('name')));
                    }
                });
                trees = trees.filterByFoodIds(foodIds);
                // Filtering adoption status.
                if (event != undefined) {
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
                }
                // Apply adopt filtering
                var adoptIds = new Array();
                $.each(self.$('.filter-adopt input'), function (index, item) {
                    if ($(item).prop('checked') == true) {
                        adoptIds.push(Math.floor($(item).prop('name')));
                    }
                });
                trees = trees.filterByAdoptStatus(adoptIds);
                // update markers
                self.renderTreeList(trees);
            }, 1);
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
                FoodParent.Controller.checkLogin(function (data) {
                    if (data.result == true || data.result == 'true') {
                        var template = _.template(FoodParent.Template.getTreeFilterListTemplate());
                        self.$('#filter-list').html(template({
                            foods: FoodParent.Model.getFoods(),
                            flags: FoodParent.Model.getFlags(),
                            ownerships: FoodParent.Model.getOwnerships(),
                            userid: parseInt(data.id),
                        }));
                    }
                    else if (data.result == false || data.result == 'false') {
                        var template = _.template(FoodParent.Template.getFoodItemTemplate());
                        self.$('#list-food').html(template({
                            foods: FoodParent.Model.getFoods(),
                        }));
                        $('#list-food').btsListFilter('#search-food', {
                            itemChild: 'span',
                            //sourceTmpl: '<div class="food-item">{title}</div>',
                            itemEl: '.food-item',
                            emptyNode: function (data) {
                                return '<div class="user-item-none">No Result</div><div class="clear" />';
                            },
                        });
                    }
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            };
            this.renderForagableList = function () {
            };
            this.renderTreeInfo = function (tree) {
                var self = _this;
                var bAdmin = false;
                var bLogIn = false;
                FoodParent.Controller.checkLogin(function (response1) {
                    if (response1.result == true || response1.result == 'true') {
                        bLogIn = true;
                    }
                    else {
                        bLogIn = false;
                    }
                    FoodParent.Controller.checkAdmin(function (data) {
                        if (data.result == true || data.result == 'true') {
                            bAdmin = true;
                        }
                        else if (data.result == false || data.result == 'false') {
                            bAdmin = false;
                        }
                        FoodParent.Controller.fetchAllFlagsAndOwners(function () {
                            var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                            var ownership = FoodParent.Model.getOwnerships().findWhere({ id: tree.getOwnershipId() });
                            if (!bLogIn) {
                                var template = _.template(FoodParent.Template.getTreeInfoTemplate4());
                                var data = {
                                    foodname: food.getName(),
                                    treename: tree.getName(),
                                    lat: tree.getLat().toFixed(4),
                                    lng: tree.getLng().toFixed(4),
                                    flags: FoodParent.Model.getFlags(),
                                    ownerships: FoodParent.Model.getOwnerships(),
                                    description: tree.getDescription(),
                                    persons: tree.getParents(),
                                };
                                self.$('#wrapper-treeinfo').html(template(data));
                            }
                            else {
                                if (bAdmin) {
                                    var template = _.template(FoodParent.Template.getTreeInfoTemplate());
                                    var data = {
                                        foodname: food.getName(),
                                        treename: tree.getName(),
                                        lat: tree.getLat().toFixed(4),
                                        lng: tree.getLng().toFixed(4),
                                        flags: FoodParent.Model.getFlags(),
                                        ownerships: FoodParent.Model.getOwnerships(),
                                        description: tree.getDescription(),
                                        persons: tree.getParents(),
                                    };
                                    self.$('#wrapper-treeinfo').html(template(data));
                                }
                                else {
                                    var adopt;
                                    if (self._selectedMarker) {
                                        adopt = FoodParent.Model.getAdopts().findWhere({ tree: self._selectedMarker.options.id, parent: parseInt(response1.id) });
                                    }
                                    if (adopt) {
                                        var template = _.template(FoodParent.Template.getTreeInfoTemplate5());
                                        var data = {
                                            foodname: food.getName(),
                                            treename: tree.getName(),
                                            lat: tree.getLat().toFixed(4),
                                            lng: tree.getLng().toFixed(4),
                                            flags: FoodParent.Model.getFlags(),
                                            ownerships: FoodParent.Model.getOwnerships(),
                                            description: tree.getDescription(),
                                            persons: tree.getParents(),
                                        };
                                        self.$('#wrapper-treeinfo').html(template(data));
                                    }
                                    else {
                                        var template = _.template(FoodParent.Template.getTreeInfoTemplate4());
                                        var data = {
                                            foodname: food.getName(),
                                            treename: tree.getName(),
                                            lat: tree.getLat().toFixed(4),
                                            lng: tree.getLng().toFixed(4),
                                            flags: FoodParent.Model.getFlags(),
                                            ownerships: FoodParent.Model.getOwnerships(),
                                            description: tree.getDescription(),
                                            persons: tree.getParents(),
                                        };
                                        self.$('#wrapper-treeinfo').html(template(data));
                                    }
                                }
                            }
                            self.$('#wrapper-treeinfo').removeClass('hidden');
                            self.renderFlagInfo(tree.getFlags());
                            self.renderOwnershipInfo(ownership);
                            self.renderRecentActivities(tree);
                            self.$('.input-address').replaceWith('<div class="input-address"></div>');
                            if (tree.getAddress().trim() == '') {
                                FoodParent.GeoLocation.reverseGeocoding(tree.getLocation(), function (data) {
                                    self.$(".input-address").html(data.road + ", " + data.county + ", " + data.state + ", " + data.country + ", " + data.postcode);
                                }, function () {
                                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                                });
                            }
                            else {
                                self.$(".input-address").html(tree.getAddress());
                            }
                            if (bAdmin) {
                                self.$('.input-address').on('click', function (event) {
                                    $(this).replaceWith("<input type='text' class='input-address form-control' value='" + htmlEncode($(this).text()) + "' />");
                                    self.$('.input-address').focus();
                                    self.$('.input-address').on('focusout', function (event) {
                                        var address = self.$('.input-address').val();
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
                                    });
                                });
                                self.$('.input-description').on('click', function (event) {
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
                            }
                        }, function () {
                            FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    }, function () {
                        FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                }, function (response1) {
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
                        FoodParent.Router.getInstance().navigate("mtrees/" + FoodParent.VIEW_MODE.MAP + "/" + tree.getId(), { trigger: false, replace: true });
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
                FoodParent.Controller.checkAdmin(function (data) {
                    $.each(FoodParent.Model.getTrees().models, function (index, tree) {
                        var bFound = false;
                        for (var j = 0; j < self._markers.length && !bFound; j++) {
                            if (tree.getId() == self._markers[j].options.id) {
                                bFound = true;
                            }
                        }
                        if (!bFound) {
                            if (data.result == true || data.result == 'true') {
                                self.addMarker(tree, true);
                            }
                            else if (data.result == false || data.result == 'false') {
                                self.addMarker(tree, false);
                            }
                        }
                    });
                    if (self._id != undefined && self._id != 0) {
                        for (var j = 0; j < self._markers.length; j++) {
                            if (self._markers[j].options.id == self._id) {
                                self._markers[j].openPopup();
                                self._map.setView(self._markers[j].getLatLng());
                                break;
                            }
                        }
                    }
                    // Render filter list
                    self.renderFilterList();
                    // Render foragable list
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            };
            this.updateMarkers = function (trees) {
                var self = _this;
                console.log(ManageTreesMapView.TAG + "updateMarkers()");
                FoodParent.Controller.checkAdmin(function (data) {
                    // Add new markers
                    $.each(trees.models, function (index, tree) {
                        var bFound = false;
                        for (var j = 0; j < self._markers.length && !bFound; j++) {
                            if (tree.getId() == self._markers[j].options.id) {
                                bFound = true;
                            }
                        }
                        if (!bFound) {
                            if (data.result == true || data.result == 'true') {
                                self.addMarker(tree, true);
                            }
                            else if (data.result == false || data.result == 'false') {
                                self.addMarker(tree, false);
                            }
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
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
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
                "click .food-item": "_applySearch",
                "click #wrapper-food-search span.btn": "_resetSearch",
                "click .marker-control-item": "_mouseClick",
                "click .collapsible-button": "_openCollapsible",
                "click .filter-checkbox": "_applyFilter",
                "click .flag-radio": "_applyFlag",
                "click .ownership-radio": "_applyOwnership",
                "click .add-tree": "_addNewTree",
                "click .switch-table": "_mouseClick",
                "click .button-tree-detail": "_mouseClick",
                "click .button-manage-adoption": "_mouseClick",
                "click .button-tree-adopt": "_mouseClick",
                "click .button-tree-unadopt": "_mouseClick",
                "click .button-new-note": "_mouseClick",
                "keydown #search-food": "_searchKeyDown",
            };
            self.delegateEvents();
        }
        ManageTreesMapView.prototype.resize = function () {
            FoodParent.Controller.checkAdmin(function (data) {
                if (data.result == true || data.result == 'true') {
                    $('.collapsible-list').css({ height: FoodParent.View.getHeight() - 60 - 34 * 4 - 20 });
                }
                else if (data.result == false || data.result == 'false') {
                    $('.collapsible-list').css({ height: FoodParent.View.getHeight() - 60 - 34 * 2 - 20 });
                }
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        };
        ManageTreesMapView.prototype.render = function (args) {
            if (this.bRendered) {
                this.update(args);
                return self;
            }
            this.bRendered = true;
            var self = this;
            FoodParent.Controller.checkAdmin(function (data) {
                if (data.result == true || data.result == 'true') {
                    if (self.bDebug)
                        console.log(ManageTreesMapView.TAG + "render()");
                    var template = _.template(FoodParent.Template.getManageTreesMapViewTemplate());
                    self.$el.html(template({}));
                    self.setElement(self.$('#wrapper-mtrees'));
                    $('.collapsible-list').css({ height: FoodParent.View.getHeight() - 60 - 34 * 4 - 20 });
                }
                else if (data.result == false || data.result == 'false') {
                    if (self.bDebug)
                        console.log(ManageTreesMapView.TAG + "render()");
                    var template = _.template(FoodParent.Template.getManageTreesMapViewTemplate2());
                    self.$el.html(template({}));
                    self.setElement(self.$('#wrapper-mtrees'));
                    $('.collapsible-list').css({ height: FoodParent.View.getHeight() - 60 - 34 * 2 - 20 });
                }
                FoodParent.Controller.updateGeoLocation(self.renderMap, self.renderMapError);
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
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
        ManageTreesMapView.prototype.renderOwnershipInfo = function (ownership) {
            var self = this;
            FoodParent.Controller.checkAdmin(function (data) {
                if (data.result == true || data.result == 'true') {
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
                }
                else if (data.result == false || data.result == 'false') {
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
                            $(item).css({ 'pointer-events': 'none' });
                        }
                    });
                }
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        };
        ManageTreesMapView.prototype.renderFlagInfo = function (flags) {
            var self = this;
            FoodParent.Controller.checkAdmin(function (data) {
                if (data.result == true || data.result == 'true') {
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
                }
                else if (data.result == false || data.result == 'false') {
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
                        $(item).css({ 'pointer-events': 'none' });
                    });
                }
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        };
        ManageTreesMapView.prototype.renderRecentActivities = function (tree) {
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
                self.$('#list-activities').html(template(data));
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        };
        ManageTreesMapView.prototype.removeMarker = function (marker) {
            var self = this;
            self._map.removeLayer(marker);
        };
        ManageTreesMapView.prototype.addMarker = function (tree, editable) {
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
            if (self._selectedMarker != undefined) {
                FoodParent.EventHandler.handleMouseClick($(event.currentTarget), self, { marker: self._selectedMarker, tree: self._selectedMarker.options.id });
            }
            else {
                FoodParent.EventHandler.handleMouseClick($(event.currentTarget), self, { marker: self._selectedMarker });
            }
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
                // Apply only my trees
                if (self.$('input[name="onlymine"]').prop('checked') == true) {
                    trees = trees.filterByParent(parseInt(self.$('input[name="onlymine"]').attr('data-target')));
                }
                // Filtering ownership type.
                if (event != undefined) {
                    if ($(event.target).find('input').prop('name') == 'ownershipsall') {
                        if ($(event.target).find('input').prop('checked') == true) {
                            $('.filter-ownership').addClass('active');
                            $('.filter-ownership input').prop({ 'checked': 'checked' });
                        }
                        else {
                            $('.filter-ownership').removeClass('active');
                            $('.filter-ownership input').prop({ 'checked': '' });
                        }
                    }
                }
                // Apply ownership filtering
                var ownershipIds = new Array();
                $.each(self.$('.filter-ownership input'), function (index, item) {
                    if ($(item).prop('checked') == true) {
                        ownershipIds.push(Math.floor($(item).prop('name')));
                    }
                });
                trees = trees.filterByOwnershipIds(ownershipIds);
                // Filtering flag type.
                if (event != undefined) {
                    if ($(event.target).find('input').prop('name') == 'flagsall') {
                        if ($(event.target).find('input').prop('checked') == true) {
                            $('.filter-flag').addClass('active');
                            $('.filter-flag input').prop({ 'checked': 'checked' });
                        }
                        else {
                            $('.filter-flag').removeClass('active');
                            $('.filter-flag input').prop({ 'checked': '' });
                        }
                    }
                }
                // Apply flag filtering
                var flagIds = new Array();
                $.each(self.$('.filter-flag input'), function (index, item) {
                    if ($(item).prop('checked') == true) {
                        flagIds.push(Math.floor($(item).prop('name')));
                    }
                });
                trees = trees.filterByFlagIds(flagIds);
                // Filtering food type.
                if (event != undefined) {
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
                }
                // Apply food filtering
                var foodIds = new Array();
                $.each(self.$('.filter-food input'), function (index, item) {
                    if ($(item).prop('checked') == true) {
                        foodIds.push(Math.floor($(item).prop('name')));
                    }
                });
                trees = trees.filterByFoodIds(foodIds);
                // Filtering adoption status.
                if (event != undefined) {
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
                }
                // Apply adopt filtering
                var adoptIds = new Array();
                $.each(self.$('.filter-adopt input'), function (index, item) {
                    if ($(item).prop('checked') == true) {
                        adoptIds.push(Math.floor($(item).prop('name')));
                    }
                });
                trees = trees.filterByAdoptStatus(adoptIds);
                // update markers
                self.updateMarkers(trees);
            }, 1);
        };
        ManageTreesMapView.prototype._applyFlag = function (event) {
            var self = this;
            //.prop('checked')
            FoodParent.Controller.checkAdmin(function (data) {
                if (data.result == true || data.result == 'true') {
                    var tree = FoodParent.Model.getTrees().findWhere({ id: self._selectedMarker.options.id });
                    var flag = parseInt($(event.target).attr('data-target'));
                    if ($(event.target).find('input[type="checkbox"]').prop('checked')) {
                        FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.UPDATE_FLAG, { flag: flag, addmode: true }, function () {
                            var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                            self.renderFlagInfo(tree.getFlags());
                            self.renderRecentActivities(tree);
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
                            self.renderRecentActivities(tree);
                            FoodParent.EventHandler.handleDataChange("Status of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                            self._applyFilter();
                        }, function () {
                            FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    }
                }
                else {
                    var tree = FoodParent.Model.getTrees().findWhere({ id: self._selectedMarker.options.id });
                    self.renderFlagInfo(tree.getFlags());
                }
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        };
        ManageTreesMapView.prototype._applyOwnership = function (event) {
            var self = this;
            FoodParent.Controller.checkAdmin(function (data) {
                if (data.result == true || data.result == 'true') {
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
                }
                else {
                    var tree = FoodParent.Model.getTrees().findWhere({ id: self._selectedMarker.options.id });
                    self.renderOwnershipInfo(FoodParent.Model.getOwnerships().findWhere({ id: tree.getOwnershipId() }));
                }
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        };
        ManageTreesMapView.prototype._addNewTree = function (event) {
            var self = this;
            var tree = new FoodParent.Tree({ lat: self._map.getCenter().lat, lng: self._map.getCenter().lng, food: 1, type: 0, flag: 0, owner: 0, ownership: 1, description: "", address: "" });
            FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.CREATE, {}, function () {
                var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                //self.updateMarkers(Model.getTrees());
                self._applyFilter();
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
        ManageTreesMapView.prototype._searchKeyDown = function (event) {
            var self = this;
            //console.log($(event.currentTarget));
            setTimeout(function () {
                if (self.$('#search-food').val().trim() != "") {
                    setTimeout(function () {
                        self.$('#wrapper-list-food').removeClass('hidden');
                    }, 500);
                }
                else {
                    self.$('#wrapper-list-food').addClass('hidden');
                }
            }, 1);
        };
        ManageTreesMapView.prototype._applySearch = function (event) {
            var self = this;
            console.log($(event.currentTarget).attr('data-id'));
            var food = FoodParent.Model.getFoods().findWhere({
                'id': parseInt($(event.currentTarget).attr('data-id'))
            });
            console.log(food.getName());
            self.$('#search-food').val(food.getName());
            // Find all trees
            var trees = FoodParent.Model.getTrees();
            // Apply food filtering
            trees = trees.filterByFoodIds([parseInt($(event.currentTarget).attr('data-id'))]);
            // update markers
            self.updateMarkers(trees);
        };
        ManageTreesMapView.prototype._resetSearch = function (event) {
            var self = this;
            self.$('#search-food').val("");
            var trees = FoodParent.Model.getTrees();
            self.updateMarkers(trees);
            self.$('#wrapper-list-food').addClass('hidden');
        };
        ManageTreesMapView.TAG = "ManageTreesMapView - ";
        return ManageTreesMapView;
    })(ManageTreesView);
    FoodParent.ManageTreesMapView = ManageTreesMapView;
})(FoodParent || (FoodParent = {}));
