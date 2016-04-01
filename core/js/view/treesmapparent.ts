module FoodParent {
    export class TreesMapViewForParent extends TreesMapView {
        protected static TAG: string = "TreesMapViewForParent - ";
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: TreesMapViewForParent = this;
            self.events = <any>{
                "click .evt-close": "removeTreeInfo",
                "click .btn-mapfilter": "_toggleMapFilter",
                "click .btn-map-zoom-in": "_zoomIn",
                "click .btn-map-zoom-out": "_zoomOut",
                "click .btn-filter": "_clickFilter",
                "keydown #wrapper-food-search": "_searchFood",
                "click #input-search-food": "_searchFood",
                "click #wrapper-food-search .form-control-feedback": "_resetSearchFood",
                "click .item-food": "_applySearch",
                "change #checkbox-mytrees": "_toggleMyTrees",
                "click .evt-reset-filter": "_resetFilter",
                "click .btn-action": "_mouseClick",
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
            }, function (response) {
                // Handled as refreshing the page if it's not logged in
                new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: Setting.getErrorMessage(response.code), undoable: false }).execute();
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }

        public renderTreeInfo = (tree?: Tree) => {
            var self: TreesMapViewForParent = this;
            if (tree == undefined && self._selectedMarker != undefined) {
                var tree: Tree = Model.getTrees().findWhere({ id: parseInt(self._selectedMarker.options.id) });
            }
            Controller.fetchAllFlagsAndOwners(function () {
                Controller.checkIsLoggedIn(function (response) {
                    if (self._selectedMarker) {
                        var adopt: Adopt = Model.getAdopts().findWhere({ tree: self._selectedMarker.options.id, parent: parseInt(response.id) });
                        var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                        var ownership: Ownership = Model.getOwnerships().findWhere({ id: tree.getOwnershipId() });
                        if (adopt) {
                            var template = _.template(Template.getAdoptedTreeInfoTemplateForParent());
                        } else {
                            var template = _.template(Template.getUnadoptedTreeInfoTemplateForParent());
                        }
                        self.$('#wrapper-treeinfo').html(template({
                            foodname: food.getName(),
                            treename: tree.getName(),
                            description: tree.getDescription(),
                            flags: Model.getFlags(),
                        }));
                        self.$('#wrapper-treeinfo').removeClass('hidden');

                        self.renderFlagInfo(tree.getFlags());
                        self.renderRecentComments(tree);
                        // Render address either from the reverse geo-coding server or stored address
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
                    }
                }, function (response) {
                    // Handled as refreshing the page if it's not logged in
                    new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: Setting.getErrorMessage(response.code), undoable: false }).execute();
                }, function () {
                    EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
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

        protected _mouseClick(event: Event): void {
            var self: TreesMapViewForParent = this;
            if ($(event.currentTarget).hasClass('evt-add-tree')) {
                var tree: Tree = new Tree({ lat: self._map.getCenter().lat, lng: self._map.getCenter().lng, food: 1, type: 0, flag: 0, owner: 0, ownership: 1, description: "", address: "" });
                EventHandler.handleMouseClick($(event.currentTarget), self, { tree: tree });
            } else if (self._selectedMarker != undefined) {
                EventHandler.handleMouseClick($(event.currentTarget), self, { marker: self._selectedMarker, tree: self._selectedMarker.options.id });
            } else {
                EventHandler.handleMouseClick($(event.currentTarget), self, { marker: self._selectedMarker });
            }
        }

        
    }
}
