module FoodParent {
    export class TreesMapViewForGuest extends TreesMapView {
        protected static TAG: string = "TreesMapViewForGuest - ";
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: TreesMapViewForGuest = this;
            self.events = <any>{
                "click .evt-close": "removeTreeInfo",
                "click .btn-mapfilter": "_toggleMapFilter",
                "click .btn-filter": "_clickFilter",
                "keydown #wrapper-food-search": "_searchFood",
                "click #input-search-food": "_searchFood",
                "click #wrapper-food-search .form-control-feedback": "_resetSearchFood",
                "click .item-food": "_applySearch",
                "click .evt-reset-filter": "_resetFilter",
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
            // Render filter the left side filter panel
            var template = _.template(Template.getTreesFilterListTemplateForGuest());
            Controller.fetchAllFlagsAndOwners(function () {
                self.$('#content-mapfilter').html(template({
                    header: 'Filter List',
                    flags: Model.getFlags(),
                    ownerships: Model.getOwnerships(),
                }));
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
            // Render bootstrap list-filter for the food list
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
    }
}