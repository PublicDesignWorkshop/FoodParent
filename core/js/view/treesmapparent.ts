module FoodParent {
    export class TreesMapViewForParent extends TreesMapView {
        protected static TAG: string = "TreesMapViewForParent - ";
        private _timeout1: any;
        private _timeout2: any;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: TreesMapViewForParent = this;
            self.events = <any>{
                "click .evt-close": "removeTreeInfo",
                "keydown #wrapper-food-search": "_searchFood",
                "click #wrapper-food-search .form-control-feedback": "_resetSearchFood",
                "click .item-food": "_applySearch",
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
            var self: TreesMapViewForParent = this;
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
            var self: TreesMapViewForParent = this;
            self.$('#input-search-food').val("");
            var trees: Trees = Model.getTrees();
            self.updateMarkers(trees);
            self.$('#wrapper-list-food').addClass('hidden');
        }

        private _applySearch(event: Event): void {
            var self: TreesMapViewForParent = this;
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

        public renderTreeInfo = (tree: Tree) => {
            var self: TreesMapViewForParent = this;
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