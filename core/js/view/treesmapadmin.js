var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var TreesMapViewForAdmin = (function (_super) {
        __extends(TreesMapViewForAdmin, _super);
        function TreesMapViewForAdmin(options) {
            var _this = this;
            _super.call(this, options);
            this.renderFilterList = function () {
                var self = _this;
                // Render filter the left side filter panel
                var template = _.template(FoodParent.Template.getTreesFilterListTemplateForAdmin());
                FoodParent.Controller.fetchAllFlagsAndOwners(function () {
                    self.$('#content-mapfilter').html(template({
                        header: 'Filter List',
                        flags: FoodParent.Model.getFlags(),
                        ownerships: FoodParent.Model.getOwnerships(),
                    }));
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
                // Render a bootstrap list-filter for the food list
                FoodParent.Controller.fetchAllFoods(function () {
                    var template = _.template(FoodParent.Template.getFoodItemTemplate());
                    self.$('#list-food').html(template({
                        foods: FoodParent.Model.getFoods(),
                    }));
                    $('#list-food').btsListFilter('#input-search-food', {
                        itemChild: 'span',
                        //sourceTmpl: '<div class="food-item">{title}</div>',
                        itemEl: '.item-food',
                        emptyNode: function (data) {
                            return '';
                        },
                    });
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
                FoodParent.Controller.checkIsLoggedIn(function (response) {
                    self.$('#checkbox-mytrees').attr({ 'data-id': response.id });
                }, function () {
                    // Handled as refreshing the page if it's not logged in
                    Backbone.history.loadUrl(Backbone.history.fragment);
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            };
            this.renderMarkers = function () {
                var self = _this;
                console.log(FoodParent.TreesMapView.TAG + "renderMarkers()");
                // Iterate all trees and add markers for trees in database but not being rendered in the map
                $.each(FoodParent.Model.getTrees().models, function (index, tree) {
                    var bFound = false;
                    for (var j = 0; j < self._markers.length && !bFound; j++) {
                        if (tree.getId() == self._markers[j].options.id) {
                            bFound = true;
                        }
                    }
                    if (!bFound) {
                        self.addMarker(tree, true);
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
            this.renderTreeInfo = function (tree) {
                var self = _this;
                if (tree == undefined && self._selectedMarker != undefined) {
                    var tree = FoodParent.Model.getTrees().findWhere({ id: parseInt(self._selectedMarker.options.id) });
                }
                FoodParent.Controller.fetchAllFlagsAndOwners(function () {
                    FoodParent.Controller.checkIsLoggedIn(function (response) {
                        if (self._selectedMarker) {
                            var adopt = FoodParent.Model.getAdopts().findWhere({ tree: self._selectedMarker.options.id, parent: parseInt(response.id) });
                            var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                            var ownership = FoodParent.Model.getOwnerships().findWhere({ id: tree.getOwnershipId() });
                            if (adopt) {
                                var template = _.template(FoodParent.Template.getAdoptedTreeInfoTemplateForAdmin());
                            }
                            else {
                                var template = _.template(FoodParent.Template.getUnadoptedTreeInfoTemplateForAdmin());
                            }
                            self.$('#wrapper-treeinfo').html(template({
                                foodname: food.getName(),
                                treename: tree.getName(),
                                lat: tree.getLat().toFixed(4),
                                lng: tree.getLng().toFixed(4),
                                flags: FoodParent.Model.getFlags(),
                                ownerships: FoodParent.Model.getOwnerships(),
                                description: tree.getDescription(),
                                persons: tree.getParents(),
                            }));
                            self.$('#wrapper-treeinfo').removeClass('hidden');
                            self.renderFlagInfo(tree.getFlags());
                            self.renderOwnershipInfo(ownership);
                            self.renderRecentComments(tree);
                            // Render address either from the reverse geo-coding server or stored address
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
                            // Event listner for changing address
                            self.$('.input-address').on('click', function (event) {
                                $(this).replaceWith("<input type='text' class='input-address form-control' value='" + htmlEncode($(this).text()) + "' />");
                                self.$('.input-address').focus();
                                self.$('.input-address').on('focusout', function (event) {
                                    self.updateTreeAddress(tree, self.$('.input-address').val());
                                });
                                self.$('.input-address').on('keydown', function (event) {
                                    if (event.keyCode == 13) {
                                        self.updateTreeAddress(tree, self.$('.input-address').val());
                                    }
                                    else if (event.keyCode == 27) {
                                        self.renderTreeInfo(tree);
                                    }
                                });
                            });
                            // Event listner for changing description
                            self.$('.input-description').on('click', function (event) {
                                $(this).replaceWith("<input type='text' class='input-description form-control' value='" + htmlEncode($(this).text()) + "' />");
                                self.$('.input-description').focus();
                                self.$('.input-description').on('focusout', function (event) {
                                    self.updateTreeDescription(tree, self.$('.input-description').val());
                                });
                                self.$('.input-description').on('keydown', function (event) {
                                    if (event.keyCode == 13) {
                                        self.updateTreeDescription(tree, self.$('.input-description').val());
                                    }
                                    else if (event.keyCode == 27) {
                                        self.renderTreeInfo(tree);
                                    }
                                });
                            });
                            // Event listner for changing food type
                            self.$('.input-food').on('click', function (event) {
                                var template = _.template(FoodParent.Template.FoodSelectTemplate());
                                var data = {
                                    foods: FoodParent.Model.getFoods(),
                                };
                                $(this).replaceWith(template(data));
                                self.$('.input-food').selectpicker();
                                self.$('.input-food').selectpicker("val", food.getId());
                                self.$('.input-food').on('hide.bs.dropdown', function (event) {
                                    self.updateTreeFoodType(tree, parseInt($(this).find("option:selected").val()));
                                });
                                self.$('.input-lat').on('focusout', function (event) {
                                    self.renderTreeInfo(tree);
                                });
                                self.$('.input-lat').on('keydown', function (event) {
                                    if (event.keyCode == 27) {
                                        self.renderTreeInfo(tree);
                                    }
                                });
                            });
                            // Event listner for changing latitude
                            self.$('.input-lat').on('click', function (event) {
                                $(this).replaceWith("<input class='input-lat form-control' value='" + $(this).html() + "' />");
                                self.$('.input-lat').focus();
                                self.$('.input-lat').on('focusout', function (event) {
                                    self.updateTreeLocation(tree, new L.LatLng(parseFloat(self.$('.input-lat').val()), self._selectedMarker.getLatLng().lng));
                                });
                                self.$('.input-lat').on('keydown', function (event) {
                                    if (event.keyCode == 13) {
                                        self.updateTreeLocation(tree, new L.LatLng(parseFloat(self.$('.input-lat').val()), self._selectedMarker.getLatLng().lng));
                                    }
                                    else if (event.keyCode == 27) {
                                        self.renderTreeInfo(tree);
                                    }
                                });
                            });
                            // Event listner for changing longitude
                            self.$('.input-lng').on('click', function (event) {
                                var width = self.$('.input-lng').outerWidth() + 8;
                                $(this).replaceWith("<input class='input-lng form-control' value='" + $(this).html() + "' />");
                                //self.$('.input-lng').css({ width: width });
                                self.$('.input-lng').focus();
                                self.$('.input-lng').on('focusout', function (event) {
                                    self.updateTreeLocation(tree, new L.LatLng(self._selectedMarker.getLatLng().lat, parseFloat(self.$('.input-lng').val())));
                                });
                                self.$('.input-lng').on('keydown', function (event) {
                                    if (event.keyCode == 13) {
                                        self.updateTreeLocation(tree, new L.LatLng(self._selectedMarker.getLatLng().lat, parseFloat(self.$('.input-lng').val())));
                                    }
                                    else if (event.keyCode == 27) {
                                        self.renderTreeInfo(tree);
                                    }
                                });
                            });
                        }
                    }, function (response) {
                        // Handled as refreshing the page if it's not logged in
                        new FoodParent.RenderMessageViewCommand({ el: FoodParent.Setting.getMessageWrapperElement(), message: FoodParent.Setting.getErrorMessage(response.code), undoable: false }).execute();
                    }, function () {
                        FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            };
            var self = this;
            self.events = {
                "click .evt-close": "removeTreeInfo",
                "click .btn-mapfilter": "_toggleMapFilter",
                "click .btn-filter": "_clickFilter",
                "keydown #wrapper-food-search": "_searchFood",
                "click #input-search-food": "_searchFood",
                "click #wrapper-food-search .form-control-feedback": "_resetSearchFood",
                "click .item-food": "_applySearch",
                "change #checkbox-mytrees": "_toggleMyTrees",
                "click .evt-reset-filter": "_resetFilter",
                "click .btn-action": "_mouseClick",
                "click .flag-radio": "_updateFlag",
                "click .ownership-radio": "_updateOwnership",
            };
            self.delegateEvents();
        }
        TreesMapViewForAdmin.prototype.resize = function () {
            _super.prototype.resize.call(this);
            var self = this;
        };
        TreesMapViewForAdmin.prototype.render = function (args) {
            _super.prototype.render.call(this, args);
            var self = this;
            if (self.bDebug)
                console.log(TreesMapViewForAdmin.TAG + "render()");
            var template = _.template(FoodParent.Template.getTreesMapViewTemplateForAdmin());
            self.$el.html(template({}));
            self.$('#checkbox-mytrees').bootstrapToggle({
                on: 'My Trees (On)',
                off: 'My Trees (Off)'
            });
            FoodParent.Controller.updateGeoLocation(self.renderMap, self.renderMapError);
            return self;
        };
        TreesMapViewForAdmin.prototype.update = function (args) {
            _super.prototype.update.call(this, args);
            var self = this;
            if (self.bDebug)
                console.log(TreesMapViewForAdmin.TAG + "update()");
            return self;
        };
        TreesMapViewForAdmin.prototype._toggleMyTrees = function (event) {
            var self = this;
            self._applyFilter();
        };
        TreesMapViewForAdmin.prototype._applyFilter = function (event) {
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
            // Apply mytrees filtering (for parent / admin mode)
            if (self.$('#checkbox-mytrees').prop('checked')) {
                trees = trees.filterByParent(parseInt(self.$('#checkbox-mytrees').attr('data-id')));
            }
            // Update markers
            self.updateMarkers(trees);
        };
        TreesMapViewForAdmin.TAG = "TreesMapViewForAdmin - ";
        return TreesMapViewForAdmin;
    })(FoodParent.TreesMapView);
    FoodParent.TreesMapViewForAdmin = TreesMapViewForAdmin;
})(FoodParent || (FoodParent = {}));
