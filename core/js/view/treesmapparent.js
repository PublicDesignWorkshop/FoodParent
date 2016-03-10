var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var TreesMapViewForParent = (function (_super) {
        __extends(TreesMapViewForParent, _super);
        function TreesMapViewForParent(options) {
            var _this = this;
            _super.call(this, options);
            this.renderFilterList = function () {
                var self = _this;
                // Render filter the left side filter panel
                var template = _.template(FoodParent.Template.getTreesFilterListTemplateForParent());
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
            this.renderTreeInfo = function (tree) {
                var self = _this;
                FoodParent.Controller.fetchAllFlagsAndOwners(function () {
                    var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                    var ownership = FoodParent.Model.getOwnerships().findWhere({ id: tree.getOwnershipId() });
                    var template = _.template(FoodParent.Template.getTreeInfoTemplateForParent());
                    var data = {
                        foodname: food.getName(),
                        treename: tree.getName(),
                        //lat: tree.getLat().toFixed(4),
                        //lng: tree.getLng().toFixed(4),
                        //flags: Model.getFlags(),
                        //ownerships: Model.getOwnerships(),
                        description: tree.getDescription(),
                    };
                    self.$('#wrapper-treeinfo').html(template(data));
                    self.$('#wrapper-treeinfo').removeClass('hidden');
                    self.renderRecentComments(tree);
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
            };
            self.delegateEvents();
        }
        TreesMapViewForParent.prototype.resize = function () {
            _super.prototype.resize.call(this);
            var self = this;
        };
        TreesMapViewForParent.prototype.render = function (args) {
            _super.prototype.render.call(this, args);
            var self = this;
            if (self.bDebug)
                console.log(TreesMapViewForParent.TAG + "render()");
            var template = _.template(FoodParent.Template.getTreesMapViewTemplateForParent());
            self.$el.html(template({}));
            self.$('#checkbox-mytrees').bootstrapToggle({
                on: 'My Trees (On)',
                off: 'My Trees (Off)'
            });
            FoodParent.Controller.updateGeoLocation(self.renderMap, self.renderMapError);
            return self;
        };
        TreesMapViewForParent.prototype.update = function (args) {
            _super.prototype.update.call(this, args);
            var self = this;
            if (self.bDebug)
                console.log(TreesMapViewForParent.TAG + "update()");
            return self;
        };
        TreesMapViewForParent.prototype._toggleMyTrees = function (event) {
            var self = this;
            self._applyFilter();
        };
        TreesMapViewForParent.prototype._applyFilter = function (event) {
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
        TreesMapViewForParent.TAG = "TreesMapViewForParent - ";
        return TreesMapViewForParent;
    })(FoodParent.TreesMapView);
    FoodParent.TreesMapViewForParent = TreesMapViewForParent;
})(FoodParent || (FoodParent = {}));
