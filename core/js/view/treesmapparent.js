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
            };
            this.renderTreeInfo = function (tree) {
                var self = _this;
                FoodParent.Controller.fetchAllFlagsAndOwners(function () {
                    var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                    var ownership = FoodParent.Model.getOwnerships().findWhere({ id: tree.getOwnershipId() });
                    var template = _.template(FoodParent.Template.getTreeInfoTemplateForGuest());
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
                "keydown #wrapper-food-search": "_searchFood",
                "click #wrapper-food-search .form-control-feedback": "_resetSearchFood",
                "click .item-food": "_applySearch",
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
        TreesMapViewForParent.prototype._searchFood = function (event) {
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
                    }, 500);
                }
                else {
                    self.$('#wrapper-list-food').addClass('hidden');
                    self._resetSearchFood();
                }
            }, 10);
        };
        TreesMapViewForParent.prototype._resetSearchFood = function (event) {
            var self = this;
            self.$('#input-search-food').val("");
            var trees = FoodParent.Model.getTrees();
            self.updateMarkers(trees);
            self.$('#wrapper-list-food').addClass('hidden');
        };
        TreesMapViewForParent.prototype._applySearch = function (event) {
            var self = this;
            var food = FoodParent.Model.getFoods().findWhere({
                'id': parseInt($(event.currentTarget).attr('data-id'))
            });
            self.$('#search-food').val(food.getName());
            // Find all trees
            var trees = FoodParent.Model.getTrees();
            // Apply food filtering
            trees = trees.filterByFoodIds([parseInt($(event.currentTarget).attr('data-id'))]);
            // Update markers
            self.updateMarkers(trees);
        };
        TreesMapViewForParent.TAG = "TreesMapViewForParent - ";
        return TreesMapViewForParent;
    })(FoodParent.TreesMapView);
    FoodParent.TreesMapViewForParent = TreesMapViewForParent;
})(FoodParent || (FoodParent = {}));
