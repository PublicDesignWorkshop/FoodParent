module FoodParent {
    export class TreesMapViewForParent extends TreesMapView {
        protected static TAG: string = "TreesMapViewForParent - ";
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: TreesMapViewForParent = this;
            self.events = <any>{
                "click .evt-close": "removeTreeInfo",
                "click .btn-mapfilter": "_toggleMapFilter",
                "click .btn-filter": "_clickFilter",
                "keydown #wrapper-food-search": "_searchFood",
                "click #input-search-food": "_searchFood",
                "click #wrapper-food-search .form-control-feedback": "_resetSearchFood",
                "click .item-food": "_applySearch",
                "change #checkbox-mytrees": "_toggleMyTrees",
            };
            self.delegateEvents();
        }

        public resize(): any {
            super.resize();
            var self: TreesMapViewForParent = this;
        }

        public render(args?: any): any {
            super.render(args);
            var self: TreesMapViewForParent = this;
            if (self.bDebug) console.log(TreesMapViewForParent.TAG + "render()");
            var template = _.template(Template.getTreesMapViewTemplateForParent());
            self.$el.html(template({}));
            self.$('#checkbox-mytrees').bootstrapToggle({
                on: 'My Trees (On)',
                off: 'My Trees (Off)'
            });
            Controller.updateGeoLocation(self.renderMap, self.renderMapError);
            return self;
        }

        public update(args?: any): any {
            super.update(args);
            var self: TreesMapViewForParent = this;
            if (self.bDebug) console.log(TreesMapViewForParent.TAG + "update()");
            return self;
        }

        public renderFilterList = () => {
            var self: TreesMapViewForParent = this;
            // Render filter the left side filter panel
            var template = _.template(Template.getTreesFilterListTemplateForParent());
            Controller.fetchAllFlagsAndOwners(function () {
                self.$('#content-mapfilter').html(template({
                    header: 'Filter List',
                    flags: Model.getFlags(),
                    ownerships: Model.getOwnerships(),
                }));
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
            // Render a bootstrap list-filter for the food list
            Controller.fetchAllFoods(function () {
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
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });

            Controller.checkIsLoggedIn(function (response) {
                self.$('#checkbox-mytrees').attr({ 'data-id': response.id });
            }, function () {
                // Handled as refreshing the page if it's not logged in
                Backbone.history.loadUrl(Backbone.history.fragment);
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }

        public renderTreeInfo = (tree: Tree) => {
            var self: TreesMapViewForParent = this;
            Controller.fetchAllFlagsAndOwners(function () {
                var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                var ownership: Ownership = Model.getOwnerships().findWhere({ id: tree.getOwnershipId() });
                var template = _.template(Template.getTreeInfoTemplateForParent());
                var data = {
                    foodname: food.getName(),
                    treename: tree.getName(),
                    //lat: tree.getLat().toFixed(4),
                    //lng: tree.getLng().toFixed(4),
                    //flags: Model.getFlags(),
                    //ownerships: Model.getOwnerships(),
                    description: tree.getDescription(),
                    //persons: tree.getParents(),
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

        public _toggleMyTrees(event: Event) {
            var self: TreesMapViewForParent = this;
            self._applyFilter();
        }

        public _applyFilter(event?: any): void {
            var self: TreesMapViewForParent = this;
            // Find all trees
            var trees: Trees = Model.getTrees();
            // Apply food filtering
            if (self._selectedFood != null) {
                trees = trees.filterByFoodIds([self._selectedFood.getId()]);
            }
            // Apply ownership filtering
            var ownershipIds = new Array<number>();
            if (self.$('.filter-owner-all').hasClass('active')) {
                $.each(self.$('.filter-owner-item'), function (index: number, element: JQuery) {
                    ownershipIds.push(parseInt($(element).attr('data-id')));
                });
            } else {
                $.each(self.$('.filter-owner-item'), function (index: number, element: JQuery) {
                    if ($(element).hasClass('active')) {
                        ownershipIds.push(parseInt($(element).attr('data-id')));
                    }
                });
            }
            trees = trees.filterByOwnershipIds(ownershipIds);
            // Apply adoption flitering
            var adoptIds = new Array<number>();
            if (self.$('.filter-adopt-all').hasClass('active')) {
                $.each(self.$('.filter-adopt-item'), function (index: number, element: JQuery) {
                    adoptIds.push(parseInt($(element).attr('data-id')));
                });
            } else {
                $.each(self.$('.filter-adopt-item'), function (index: number, element: JQuery) {
                    if ($(element).hasClass('active')) {
                        adoptIds.push(parseInt($(element).attr('data-id')));
                    }
                });
            }
            trees = trees.filterByAdoptStatus(adoptIds);
            // Apply flag / status flitering
            var flagIds = new Array<number>();
            if (self.$('.filter-flag-all').hasClass('active')) {
                $.each(self.$('.filter-flag-item'), function (index: number, element: JQuery) {
                    flagIds.push(parseInt($(element).attr('data-id')));
                });
            } else {
                $.each(self.$('.filter-flag-item'), function (index: number, element: JQuery) {
                    if ($(element).hasClass('active')) {
                        flagIds.push(parseInt($(element).attr('data-id')));
                    }
                });
            }
            trees = trees.filterByFlagIds(flagIds);

            // Apply mytrees filtering (for parent / admin mode)
            if (self.$('#checkbox-mytrees').prop('checked')) {   // When the toggle is on
                trees = trees.filterByParent(parseInt(self.$('#checkbox-mytrees').attr('data-id')));
            }

            // Update markers
            self.updateMarkers(trees);
        }
    }
}