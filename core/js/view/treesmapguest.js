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
                FoodParent.Controller.checkIsLoggedIn(function (response) {
                    var template = _.template(FoodParent.Template.getTreesFilterListTemplateForGuest());
                    self.$('#content-mapfilter').html(template({
                        header: 'Filter List',
                        flags: FoodParent.Model.getFlags(),
                        ownerships: FoodParent.Model.getOwnerships(),
                        userid: parseInt(response.id),
                    }));
                }, function () {
                    var template = _.template(FoodParent.Template.getTreesFilterListTemplateForGuest());
                    self.$('#content-mapfilter').html(template({
                        header: 'Filter List',
                        flags: FoodParent.Model.getFlags(),
                        ownerships: FoodParent.Model.getOwnerships(),
                    }));
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
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
                "click .btn-mapfilter": "_toggleMapFilter",
                "keydown #wrapper-food-search": "_searchFood",
                "click #wrapper-food-search .form-control-feedback": "_resetSearchFood",
                "click .item-food": "_applySearch",
                "click .btn-filter": "_clickFilter",
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
        TreesMapViewForGuest.prototype._searchFood = function (event) {
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
        TreesMapViewForGuest.prototype._resetSearchFood = function (event) {
            var self = this;
            self.$('#input-search-food').val("");
            var trees = FoodParent.Model.getTrees();
            self.updateMarkers(trees);
            self.$('#wrapper-list-food').addClass('hidden');
        };
        TreesMapViewForGuest.prototype._applySearch = function (event) {
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
        TreesMapViewForGuest.prototype._clickFilter = function (event) {
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
        };
        TreesMapViewForGuest.TAG = "TreesMapViewForGuest - ";
        return TreesMapViewForGuest;
    })(FoodParent.TreesMapView);
    FoodParent.TreesMapViewForGuest = TreesMapViewForGuest;
})(FoodParent || (FoodParent = {}));
