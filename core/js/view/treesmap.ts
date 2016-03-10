﻿module FoodParent {
    export class TreesMapView extends TreesView {
        protected _map: L.Map;
        protected _location: L.LatLng;
        protected _zoom: number;
        protected _bClosePopupOnClick: boolean = true;
        protected _markers: Array<L.Marker>;
        protected _selectedMarker: L.Marker;
        protected _selectedFood: Food;
        private _timeout1: any;
        private _timeout2: any;
        protected static TAG: string = "TreesMapView - ";
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: TreesMapView = this;
            self.bDebug = true;
            self._zoom = Setting.getDefaultMapZoomLevel();
            self._markers = new Array<L.Marker>();
            self.events = <any>{
                "click .evt-close": "removeTreeInfo",
                "click .btn-mapfilter": "_toggleMapFilter",
            };
            self.delegateEvents();
        }

        public resize(): any {
            var self: TreesMapView = this;
            self._map.invalidateSize(false)
            if (self._selectedMarker) {
                if (View.getWidth() > View.getHeight()) {
                    self._map.panTo(new L.LatLng(self._selectedMarker.getLatLng().lat, self._selectedMarker.getLatLng().lng + self._map.getSize().x * 0.0001));
                } else {
                    self._map.panTo(new L.LatLng(self._selectedMarker.getLatLng().lat + self._map.getSize().y * 0.000075, self._selectedMarker.getLatLng().lng));
                }
            }
        }

        public render(args?: any): any {
            super.render(args);
            var self: TreesMapView = this;
            if (self.bDebug) console.log(TreesMapView.TAG + "render()");
            var template = _.template(Template.getTreesMapViewWrapperTemplate());
            self.$el.html(template({}));
            self.setElement(self.$('#wrapper-trees'));
            return self;
        }

        public update(args?: any): any {
            super.update(args);
            var self: TreesMapView = this;
            if (self.bDebug) console.log(TreesMapView.TAG + "update()");
            return self;
        }

        protected renderMapError = (error: PositionError) => {
            var self: TreesMapView = this;
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    EventHandler.handleError(ERROR_MODE.GEO_PERMISSION_ERROR);
                    break;
                case error.POSITION_UNAVAILABLE:
                    EventHandler.handleError(ERROR_MODE.GEO_PERMISSION_ERROR);
                    break;
                case error.TIMEOUT:
                    break;
            }
            self.renderMap({
                coords: {
                    accuracy: 4196,
                    altitude: null,
                    altitudeAccuracy: null,
                    heading: null,
                    latitude: 33.7946333,
                    longitude: -84.448771,
                    speed: null
                },
                timestamp: new Date().valueOf()
            });
        }

        public setLocation(location: L.LatLng): void {
            var self: TreesMapView = this;
            self._location = location;
        }

        public renderMap = (position: Position) => {
            var self: TreesMapView = this;
            if (self.bDebug) console.log(TreesMapView.TAG + "renderMap()");
            var accuracy = position.coords.accuracy;
            self._location = new L.LatLng(position.coords.latitude, position.coords.longitude);
            // Rener map only when the map is not rendered in a browswer
            if (self._map == undefined) {
                self.$('#list-donation').css({ height: View.getHeight() - 60 });
                self.setLocation(new L.LatLng(position.coords.latitude, position.coords.longitude));
                self._map = L.map($('#content-map')[0].id, {
                    zoomControl: false,
                    closePopupOnClick: self._bClosePopupOnClick,
                    doubleClickZoom: true,
                    touchZoom: true,
                    zoomAnimation: true,
                    markerZoomAnimation: true,
                }).setView(self._location, self._zoom);
                L.tileLayer(Setting.getTileMapAddress(), {
                    minZoom: Setting.getMapMinZoomLevel(),
                    maxZoom: Setting.getMapMaxZoomLevel(),
                }).addTo(self._map);
                self._map.invalidateSize(false);

                // add event listener for finishing map creation.
                self._map.whenReady(self.renderTrees);
                // add event listener for dragging map
                self._map.on("moveend", self.afterMoveMap);

                //Controller.fetchAllTrees();
                self._map.on('popupopen', function (event: any) {
                    var marker: L.Marker = event.popup._source;
                    marker._bringToFront();
                    $(marker.label._container).addClass('active');
                    var tree: Tree = Model.getTrees().findWhere({ id: marker.options.id });
                    self.renderTreeInfo(tree);
                    self._selectedMarker = marker;
                    // Make MessageView invisible.
                    if (View.getMessageView()) {
                        View.getMessageView().setInvisible();
                    }
                    
                    if (View.getWidth() > View.getHeight()) {
                        self._map.panTo(new L.LatLng(marker.getLatLng().lat, marker.getLatLng().lng + self._map.getSize().x * 0.00005));
                    } else {
                        self._map.panTo(new L.LatLng(marker.getLatLng().lat + self._map.getSize().y * 0.000075, marker.getLatLng().lng));
                    }
                    if (View.getWidth() < View.getHeight()) {
                        self.closeMapFilter();
                    }
                    
                    Router.getInstance().navigate("trees/" + VIEW_MODE.MAP + "/" + tree.getId(), { trigger: false, replace: true });
                });
                self._map.on('popupclose', function (event: any) {
                    var marker: L.Marker = event.popup._source;
                    marker._resetZIndex();
                    $(marker.label._container).removeClass('active');
                    self.$('#wrapper-treeinfo').addClass('hidden');
                    self._selectedMarker = null;
                    Router.getInstance().navigate("trees/" + VIEW_MODE.MAP + "/0", { trigger: false, replace: true });
                });
            }
        }
        private afterMoveMap = () => {
            var self: TreesMapView = this;
            if (self._selectedMarker) {
                self._selectedMarker._bringToFront();
            }
        }
        private renderTrees = () => {
            var self: TreesMapView = this;
            Controller.fetchAllTrees(function () {
                // Render filter list
                self.renderFilterList();
                self.renderMarkers();
            }, function (errorMode: ERROR_MODE) {
                EventHandler.handleError(errorMode);
            });
        }

        protected renderMarkers = () => {
            var self: TreesMapView = this;
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
                    self.addMarker(tree, false);
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

        protected addMarker(tree: Tree, editable: boolean): void {
            var self: TreesMapView = this;
            var marker: L.Marker = MarkerFractory.create(tree, true, editable);
            self._markers.push(marker);
            marker.addTo(self._map);
            /*
            marker.on('dblclick', function (event) {
                if (self._map.getZoom() < Setting.getMapCenterZoomLevel()) {
                    self._map.setView(marker.getLatLng(), Setting.getMapCenterZoomLevel(), { animate: true });
                } else {
                    self._map.setView(marker.getLatLng(), self._map.getZoom(), { animate: true });
                }
            });
            */

            // Re-render marker for dragend event
            marker.on("dragend", function (event) {
                if (marker.options.id != undefined) {
                    var tree: Tree = Model.getTrees().findWhere({
                        id: marker.options.id
                    });
                    EventHandler.handleTreeData(tree, DATA_MODE.UPDATE_LOCATION, { marker: marker, location: marker.getLatLng() }, function () {
                        var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                        self.renderRecentComments(tree);
                        EventHandler.handleDataChange("Location of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                        self.renderTreeInfo(tree);
                    }, function () {
                        EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                }
            });
        }

        protected updateMarkers = (trees: Trees) => {
            var self: TreesMapView = this;
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
                    self.addMarker(tree, false);
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

        private removeMarker(marker: L.Marker): void {
            var self: TreesMapView = this;
            self._map.removeLayer(marker);
        }

        protected renderRecentComments(tree: Tree): void {
            var self: TreesMapView = this;
            var trees: Array<Tree> = new Array<Tree>();
            trees.push(tree);
            Controller.fetchNotesOfTrees(trees, NoteType.IMAGE, Setting.getNumRecentActivitiesShown(), 0, function () {
                var notes: Notes = new Notes(Model.getNotes().where({ tree: tree.getId(), type: NoteType.IMAGE }));
                notes.sortByDescendingDate();
                var template = _.template(Template.getRecentCommentsTemplate());
                var data = {
                    notes: notes,
                    size: Setting.getNumRecentActivitiesShown(),
                    coordinate: '@ ' + tree.getLat().toFixed(4) + ", " + tree.getLng().toFixed(4),
                    flags: Model.getFlags(),
                    ownerships: Model.getOwnerships(),
                }
                self.$('#list-comments').html(template(data));
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }

        public removeTreeInfo = () => {
            var self: TreesMapView = this;
            self._map.closePopup();
        }

        public _toggleMapFilter(event: Event): any {
            var self: TreesMapView = this;
            if (parseFloat(self.$('#wrapper-mapfilter').css('left')) == 0) {
                self.closeMapFilter();
            } else {
                self.openMapFilter();
            }
        }

        public closeMapFilter = () => {
            var self: TreesMapView = this;
            self.$('#wrapper-mapfilter').animate({ left: -260 }, Setting.getFilterAnimDuration());
        }

        public openMapFilter = () => {
            var self: TreesMapView = this;
            self.$('#wrapper-mapfilter').animate({ left: 0 }, Setting.getFilterAnimDuration());
        }

        private _searchFood(event: any): void {
            var self: TreesMapView = this;
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
                        self.$('#wrapper-list-food').scrollTop(0);
                    }, 500);
                } else {
                    self.$('#wrapper-list-food').addClass('hidden');
                    self._resetSearchFood();
                }
            }, 10);
        }

        private _resetSearchFood(event?: Event): void {
            var self: TreesMapView = this;
            self._selectedFood = null;
            self.$('#input-search-food').val("");
            self.$('#wrapper-list-food').addClass('hidden');
            // Apply filter
            self._applyFilter();
        }

        private _applySearch(event: Event): void {
            var self: TreesMapView = this;
            var food: Food = Model.getFoods().findWhere({
                'id': parseInt($(event.currentTarget).attr('data-id'))
            });
            if (food != null) {
                self._selectedFood = food;
                self.$('#search-food').val(food.getName());
            }
            // Hide search list
            self.$('#input-search-food').val(food.getName());
            self.$('#wrapper-list-food').addClass('hidden');
            // Apply filter
            self._applyFilter();
        }

        protected _clickFilter(event: Event): void {
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

            // Rating filter
            if ($(event.currentTarget).hasClass('filter-rating-item')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                } else {
                    $(event.currentTarget).addClass('active');
                }

                if (self.$('.filter-rating-item').length == self.$('.filter-rating-item.active').length) {
                    self.$('.filter-rating-all').addClass('active');
                } else {
                    self.$('.filter-rating-all').removeClass('active');
                }
            }
            if ($(event.currentTarget).hasClass('filter-rating-all')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                    self.$('.filter-rating-item').removeClass('active');
                } else {
                    $(event.currentTarget).addClass('active');
                    self.$('.filter-rating-item').addClass('active');
                }
            }

            // Last updated filter
            if ($(event.currentTarget).hasClass('filter-last-item')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                } else {
                    $(event.currentTarget).addClass('active');
                }

                if (self.$('.filter-last-item').length == self.$('.filter-last-item.active').length) {
                    self.$('.filter-last-all').addClass('active');
                } else {
                    self.$('.filter-last-all').removeClass('active');
                }
            }
            if ($(event.currentTarget).hasClass('filter-last-all')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                    self.$('.filter-last-item').removeClass('active');
                } else {
                    $(event.currentTarget).addClass('active');
                    self.$('.filter-last-item').addClass('active');
                }
            }

            // Apply filter
            self._applyFilter();
        }

        public _applyFilter(event?: any): void {
            var self: TreesMapView = this;
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

            // Update markers
            self.updateMarkers(trees);
        }
    }
}