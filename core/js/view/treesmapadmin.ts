module FoodParent {
    export class TreesMapViewForAdmin extends TreesMapView {
        protected static TAG: string = "TreesMapViewForAdmin - ";
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: TreesMapViewForAdmin = this;
            self.events = <any>{
                "click .evt-close": "removeTreeInfo",
                "click .btn-mapfilter": "_toggleMapFilter",
                "click .evt-marker-lock": "_toggleMarkerLock",
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

        public resize(): any {
            super.resize();
            var self: TreesMapViewForAdmin = this;
        }

        public render(args?: any): any {
            super.render(args);
            var self: TreesMapViewForAdmin = this;
            if (self.bDebug) console.log(TreesMapViewForAdmin.TAG + "render()");
            var template = _.template(Template.getTreesMapViewTemplateForAdmin());
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
            var self: TreesMapViewForAdmin = this;
            if (self.bDebug) console.log(TreesMapViewForAdmin.TAG + "update()");
            return self;
        }

        public renderFilterList = () => {
            var self: TreesMapViewForAdmin = this;
            // Render filter the left side filter panel
            var template = _.template(Template.getTreesFilterListTemplateForAdmin());
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

        protected renderMarkers = () => {
            var self: TreesMapViewForAdmin = this;
            console.log(TreesMapView.TAG + "renderMarkers()");
            // Iterate all trees and add markers for trees in database but not being rendered in the map
            $.each(Model.getTrees().models, function (index: number, tree: Tree) {
                var bFound: boolean = false;
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
        }

        protected updateMarkers = (trees: Trees) => {
            var self: TreesMapViewForAdmin = this;
            console.log(TreesMapView.TAG + "updateMarkers()");
            // Add new markers
            $.each(trees.models, function (index: number, tree: Tree) {
                var bFound: boolean = false;
                for (var j = 0; j < self._markers.length && !bFound; j++) {
                    if (tree.getId() == self._markers[j].options.id) {
                        bFound = true;
                    }
                }
                if (!bFound) {
                    self.addMarker(tree, true);
                }
            });
            // Remove unnecessary markers
            for (var j = 0; j < self._markers.length;) {
                var bFound: boolean = false;
                $.each(trees.models, function (index: number, tree: Tree) {
                    if (tree.getId() == self._markers[j].options.id) {
                        bFound = true;
                    }
                });
                if (!bFound) {
                    // close popup if the marker is selected
                    if (self._markers[j] == self._selectedMarker) {
                        self._selectedMarker.closePopup();
                    }
                    self.removeMarker(self._markers[j]);
                    self._markers = _.without(self._markers, self._markers[j]);
                    j--;
                }
                j++;
            }
        }

        public renderTreeInfo = (tree?: Tree) => {
            var self: TreesMapViewForAdmin = this;
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
                            var template = _.template(Template.getAdoptedTreeInfoTemplateForAdmin());
                        } else {
                            var template = _.template(Template.getUnadoptedTreeInfoTemplateForAdmin());
                        }
                        self.$('#wrapper-treeinfo').html(template({
                            foodname: food.getName(),
                            treename: tree.getName(),
                            lat: tree.getLat().toFixed(4),
                            lng: tree.getLng().toFixed(4),
                            flags: Model.getFlags(),
                            ownerships: Model.getOwnerships(),
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
                            GeoLocation.reverseGeocoding(tree.getLocation(), function (data: ReverseGeoLocation) {
                                self.$(".input-address").html(data.road + ", " + data.county + ", " + data.state + ", " + data.country + ", " + data.postcode);
                            }, function () {
                                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                            });
                        } else {
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
                                if (event.keyCode == 13) {  // enter
                                    self.updateTreeAddress(tree, self.$('.input-address').val());
                                } else if (event.keyCode == 27) {   // esc
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
                                if (event.keyCode == 13) {  // enter
                                    self.updateTreeDescription(tree, self.$('.input-description').val());
                                } else if (event.keyCode == 27) {   // esc
                                    self.renderTreeInfo(tree);
                                }
                            });
                        });

                        // Event listner for changing food type
                        self.$('.input-food').on('click', function (event) {
                            var template = _.template(Template.FoodSelectTemplate());
                            var data = {
                                foods: Model.getFoods(),
                            }
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
                                if (event.keyCode == 27) {   // esc
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
                                if (event.keyCode == 13) { // enter
                                    self.updateTreeLocation(tree, new L.LatLng(parseFloat(self.$('.input-lat').val()), self._selectedMarker.getLatLng().lng));
                                } else if (event.keyCode == 27) {   // esc
                                    self.renderTreeInfo(tree);
                                }
                            });
                        });

                        // Event listner for changing longitude
                        self.$('.input-lng').on('click', function (event) {
                            var width: number = self.$('.input-lng').outerWidth() + 8;
                            $(this).replaceWith("<input class='input-lng form-control' value='" + $(this).html() + "' />");
                            //self.$('.input-lng').css({ width: width });
                            self.$('.input-lng').focus();
                            self.$('.input-lng').on('focusout', function (event) {
                                self.updateTreeLocation(tree, new L.LatLng(self._selectedMarker.getLatLng().lat, parseFloat(self.$('.input-lng').val())));
                            });
                            self.$('.input-lng').on('keydown', function (event) {
                                if (event.keyCode == 13) {  // enter
                                    self.updateTreeLocation(tree, new L.LatLng(self._selectedMarker.getLatLng().lat, parseFloat(self.$('.input-lng').val())));
                                } else if (event.keyCode == 27) {   // esc
                                    self.renderTreeInfo(tree);
                                }
                            });
                        });
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
            var self: TreesMapViewForAdmin = this;
            self._applyFilter();
        }

        public _applyFilter(event?: any): void {
            var self: TreesMapViewForAdmin = this;
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
            var self: TreesMapViewForAdmin = this;
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