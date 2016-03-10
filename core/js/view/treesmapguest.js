var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var TreesMapViewForGuest = (function (_super) {
        __extends(TreesMapViewForGuest, _super);
        function TreesMapViewForGuest(options) {
            var _this = this;
            _super.call(this, options);
            this.renderFilterList = function () {
                var self = _this;
                // Render filter the left side filter panel
                var template = _.template(FoodParent.Template.getTreesFilterListTemplateForGuest());
                FoodParent.Controller.fetchAllFlagsAndOwners(function () {
                    self.$('#content-mapfilter').html(template({
                        header: 'Filter List',
                        flags: FoodParent.Model.getFlags(),
                        ownerships: FoodParent.Model.getOwnerships(),
                    }));
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
                // Render bootstrap list-filter for the food list
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
            };
            this.renderTreeInfo = function (tree) {
                var self = _this;
                if (tree == undefined && self._selectedMarker != undefined) {
                    var tree = FoodParent.Model.getTrees().findWhere({ id: parseInt(self._selectedMarker.options.id) });
                }
                FoodParent.Controller.fetchAllFlagsAndOwners(function () {
                    var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                    var ownership = FoodParent.Model.getOwnerships().findWhere({ id: tree.getOwnershipId() });
                    var template = _.template(FoodParent.Template.getTreeInfoTemplateForGuest());
                    var data = {
                        foodname: food.getName(),
                        treename: tree.getName(),
                        description: tree.getDescription(),
                        flags: FoodParent.Model.getFlags(),
                    };
                    self.$('#wrapper-treeinfo').html(template(data));
                    self.$('#wrapper-treeinfo').removeClass('hidden');
                    self.renderFlagInfo(tree.getFlags());
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
                "click .evt-reset-filter": "_resetFilter",
                "click .btn-action": "_mouseClick",
            };
            self.delegateEvents();
        }
        TreesMapViewForGuest.prototype.resize = function () {
            _super.prototype.resize.call(this);
            var self = this;
        };
        TreesMapViewForGuest.prototype.render = function (args) {
            _super.prototype.render.call(this, args);
            var self = this;
            if (self.bDebug)
                console.log(TreesMapViewForGuest.TAG + "render()");
            var template = _.template(FoodParent.Template.getTreesMapViewTemplateForGuest());
            self.$el.html(template({}));
            FoodParent.Controller.updateGeoLocation(self.renderMap, self.renderMapError);
            return self;
        };
        TreesMapViewForGuest.prototype.update = function (args) {
            _super.prototype.update.call(this, args);
            var self = this;
            if (self.bDebug)
                console.log(TreesMapViewForGuest.TAG + "update()");
            return self;
        };
        TreesMapViewForGuest.TAG = "TreesMapViewForGuest - ";
        return TreesMapViewForGuest;
    })(FoodParent.TreesMapView);
    FoodParent.TreesMapViewForGuest = TreesMapViewForGuest;
})(FoodParent || (FoodParent = {}));
