module FoodParent {
    export class TreesMapViewForGuest extends TreesMapView {
        protected static TAG: string = "TreesMapViewForGuest - ";
        private _timeout1: any;
        private _timeout2: any;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: TreesMapViewForGuest = this;
            self.events = <any>{
                "click .evt-close": "removeTreeInfo",
                "click .btn-mapfilter": "_toggleMapFilter",
                "keydown #wrapper-food-search": "_searchFood",
                "click #wrapper-food-search .form-control-feedback": "_resetSearchFood",
                "click .item-food": "_applySearch",
                "click .btn-filter": "_clickFilter",
            };
            self.delegateEvents();
        }

        public resize(): any {
            super.resize();
            var self: TreesMapViewForGuest = this;
        }

        public render(args?: any): any {
            super.render(args);
            var self: TreesMapViewForGuest = this;
            if (self.bDebug) console.log(TreesMapViewForGuest.TAG + "render()");
            var template = _.template(Template.getTreesMapViewTemplateForGuest());
            self.$el.html(template({}));
            Controller.updateGeoLocation(self.renderMap, self.renderMapError);
            return self;
        }

        public update(args?: any): any {
            super.update(args);
            var self: TreesMapViewForGuest = this;
            if (self.bDebug) console.log(TreesMapViewForGuest.TAG + "update()");
            return self;
        }

        public renderFilterList = () => {
            var self: TreesMapViewForGuest = this;
            Controller.checkIsLoggedIn(function (response) {
                var template = _.template(Template.getTreesFilterListTemplateForGuest());
                self.$('#content-mapfilter').html(template({
                    header: 'Filter List',
                    flags: Model.getFlags(),
                    ownerships: Model.getOwnerships(),
                    userid: parseInt(response.id),
                }));
            }, function () {
                var template = _.template(Template.getTreesFilterListTemplateForGuest());
                self.$('#content-mapfilter').html(template({
                    header: 'Filter List',
                    flags: Model.getFlags(),
                    ownerships: Model.getOwnerships(),
                }));
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });

            var template = _.template(Template.getFoodItemTemplate());
            self.$('#list-food').html(template({
                foods: Model.getFoods(),
            }));

            $('#list-food').btsListFilter('#input-search-food', {
                itemChild: 'span',
                //sourceTmpl: '<div class="food-item">{title}</div>',
                itemEl: '.item-food',
                emptyNode: function (data) {
                    return '';
                },
            });
        }

        private _searchFood(event: any): void {
            var self: TreesMapViewForGuest = this;
            if (self._timeout1) {
                clearTimeout(self._timeout1);
            }
            if (self._timeout2) {
                clearTimeout(self._timeout2);
            }
            self._timeout1 = setTimeout(function () {
                if (event.keyCode == 27) {  // esc
                    self.$('#input-search-food').val("");
                    self._resetSearchFood();
                } else if (self.$('#input-search-food').val().trim() != "") {
                    self._timeout2 = setTimeout(function () {
                        self.$('#wrapper-list-food').removeClass('hidden');
                    }, 500);
                } else {
                    self.$('#wrapper-list-food').addClass('hidden');
                    self._resetSearchFood();
                }
            }, 10);
        }

        private _resetSearchFood(event?: Event): void {
            var self: TreesMapViewForGuest = this;
            self.$('#input-search-food').val("");
            var trees: Trees = Model.getTrees();
            self.updateMarkers(trees);
            self.$('#wrapper-list-food').addClass('hidden');
        }

        private _applySearch(event: Event): void {
            var self: TreesMapViewForGuest = this;
            var food: Food = Model.getFoods().findWhere({
                'id': parseInt($(event.currentTarget).attr('data-id'))
            });
            self.$('#search-food').val(food.getName());
            // Find all trees
            var trees: Trees = Model.getTrees();
            // Apply food filtering
            trees = trees.filterByFoodIds([parseInt($(event.currentTarget).attr('data-id'))]);
            // Update markers
            self.updateMarkers(trees);
        }

        private _clickFilter(event: Event): void {
            var self: TreesMapViewForGuest = this;
            // Ownership filter
            if ($(event.currentTarget).hasClass('filter-owner-item')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                } else {
                    $(event.currentTarget).addClass('active');
                }
                if (self.$('.filter-owner-item').length == self.$('.filter-owner-item.active').length) {
                    self.$('.filter-owner-all').addClass('active');
                } else {
                    self.$('.filter-owner-all').removeClass('active');
                }
            }
            if ($(event.currentTarget).hasClass('filter-owner-all')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                    self.$('.filter-owner-item').removeClass('active');
                } else {
                    $(event.currentTarget).addClass('active');
                    self.$('.filter-owner-item').addClass('active');
                }
            }
            
            // Adoption filter
            if ($(event.currentTarget).hasClass('filter-adopt-item')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                } else {
                    $(event.currentTarget).addClass('active');
                }
                if (self.$('.filter-adopt-item').length == self.$('.filter-adopt-item.active').length) {
                    self.$('.filter-adopt-all').addClass('active');
                } else {
                    self.$('.filter-adopt-all').removeClass('active');
                }
            }
            if ($(event.currentTarget).hasClass('filter-adopt-all')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                    self.$('.filter-adopt-item').removeClass('active');
                } else {
                    $(event.currentTarget).addClass('active');
                    self.$('.filter-adopt-item').addClass('active');
                }
            }

            // Status filter
            if ($(event.currentTarget).hasClass('filter-flag-item')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                } else {
                    $(event.currentTarget).addClass('active');
                }

                if (self.$('.filter-flag-item').length == self.$('.filter-flag-item.active').length) {
                    self.$('.filter-flag-all').addClass('active');
                } else {
                    self.$('.filter-flag-all').removeClass('active');
                }
            }
            if ($(event.currentTarget).hasClass('filter-flag-all')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                    self.$('.filter-flag-item').removeClass('active');
                } else {
                    $(event.currentTarget).addClass('active');
                    self.$('.filter-flag-item').addClass('active');
                }
            }
            
        }

        public renderTreeInfo = (tree: Tree) => {
            var self: TreesMapViewForGuest = this;
            Controller.fetchAllFlagsAndOwners(function () {
                var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                var ownership: Ownership = Model.getOwnerships().findWhere({ id: tree.getOwnershipId() });
                var template = _.template(Template.getTreeInfoTemplateForGuest());
                var data = {
                    foodname: food.getName(),
                    treename: tree.getName(),
                    lat: tree.getLat().toFixed(4),
                    lng: tree.getLng().toFixed(4),
                    flags: Model.getFlags(),
                    ownerships: Model.getOwnerships(),
                    description: tree.getDescription(),
                    persons: tree.getParents(),
                }
                self.$('#wrapper-treeinfo').html(template(data));
                self.$('#wrapper-treeinfo').removeClass('hidden');

                self.renderRecentComments(tree);

                self.$('.input-address').replaceWith('<div class="input-address"></div>');
                if (tree.getAddress().trim() == '') {
                    GeoLocation.reverseGeocoding(tree.getLocation(), function (data: ReverseGeoLocation) {
                        self.$(".input-address").html(data.road + ", " + data.county + ", " + data.state + ", " + data.country + ", " + data.postcode);
                    }, function () {
                        EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                } else {
                    self.$(".input-address").html(tree.getAddress());
                }
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }
    }
}