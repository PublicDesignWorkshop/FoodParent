declare var TreeColumn;
declare var NewTreeColumn;

module FoodParent {
    export class ManageTreesViewFractory {
        private static _instance: ManageTreesViewFractory = new ManageTreesViewFractory();
        private baseUrl: string;
        constructor(args?: any) {
            if (ManageTreesViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use ManageTreesViewFractory.getInstance() instead of new.");
            }
            ManageTreesViewFractory._instance = this;
        }
        public static getInstance(): ManageTreesViewFractory {
            return ManageTreesViewFractory._instance;
        }
        public static create(el: JQuery, viewMode: VIEW_MODE, id: number): ManageTreesView {
            var view: ManageTreesView;
            if (viewMode == VIEW_MODE.MAP) {
                view = new ManageTreesMapView({ el: el });
                view.setTreeId(id);
            } else if (viewMode == VIEW_MODE.TABLE) {
                view = new ManageTreesTableView({ el: el });
                view.setTreeId(id);
            }
            
            return view;
        }
    }

    export class ManageTreesView extends BaseView {
        protected _id: number;
        public setTreeId(id: number) {
            this._id = id;
        }
        public renderTreeInfo = (tree: Tree) => {

        }
    }

    
    export class ManageTreesTableView extends ManageTreesView {
        private static TAG: string = "ManageTreesMapView - ";
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: ManageTreesTableView = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = <any>{
                "click .switch-map": "_mouseClick",
                "click .filter-checkbox": "_applyFilter",
                "click .add-tree": "_addNewTree",
            };
            self.delegateEvents();
        }

        public render(args?: any): any {
            if (this.bRendered) {
                this.update(args);
                return self;
            }
            this.bRendered = true;
            var self: ManageTreesTableView = this;
            if (self.bDebug) console.log(ManageTreesTableView.TAG + "render()");
            var template = _.template(Template.getManageTreesTableViewTemplate());
            var data = {

            }
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-mtrees'));
            self.resize();
            self.renderTrees();

            return self;
        }

        private renderTrees = () => {
            var self: ManageTreesTableView = this;
            Controller.fetchAllTrees(function () {
                // add grid instance for existing data
                self.renderTreeList(Model.getTrees());
                self.renderFilterList();
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }

        public renderTreeList = (trees: Trees) => {
            var self: ManageTreesTableView = this;
            var optionValues = new Array<{ name: string, values: any }>();
            optionValues.push({ name: "Food", values: Model.getFoods().toArray() });
            TreeColumn[0].cell = Backgrid.SelectCell.extend({
                editor: Backgrid.FoodSelectCellEditor,
                optionValues: optionValues,
            });

            var grid = new Backgrid.Grid({
                columns: TreeColumn,
                collection: trees,
                emptyText: Setting.getNoDataText(),
            });
            grid.render();
            grid.sort("id", "ascending");
            self.$(".list-tree").html(grid.el);
        }

        

        private _addNewTree = () => {
            var self: ManageTreesTableView = this;
            if (self.$(".new-tree").hasClass('hidden')) {
                Controller.updateGeoLocation(self.renderNewTree, self.renderGeoLocationError);
            } else {
                self.$(".new-tree").addClass('hidden');
            }
            
        }

        public renderNewTree = (position: Position) => {
            var self: ManageTreesTableView = this;
            var tree: Tree = new Tree({ lat: position.coords.latitude, lng: position.coords.longitude, food: 0, type: 0, flag: 0, owner: 0, ownership: 0, description: "" });
            var trees: Trees = new Trees();
            trees.add(tree);
            var optionValues = new Array<{ name: string, values: any }>();
            optionValues.push({ name: "Food", values: Model.getFoods().toArray() });
            NewTreeColumn[0].cell = Backgrid.SelectCell.extend({
                editor: Backgrid.FoodSelectCellEditor,
                optionValues: optionValues,
            });
            var grid = new Backgrid.Grid({
                columns: NewTreeColumn,
                collection: trees,
                emptyText: Setting.getNoDataText(),
            });
            grid.render();
            //grid.sort("name", "ascending");
            self.$(".new-tree").html('<div class="list-title">Add a New Tree</div>');
            self.$(".new-tree").append(grid.el);
            self.$(".new-tree").removeClass('hidden');
        }

        private renderGeoLocationError = (error: PositionError) => {
            var self: ManageTreesTableView = this;
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
        }

        public resize(): any {
            $('#content-mtrees-table').css({ width: View.getWidth() - $('#wrapper-tablemenu').outerWidth() });
            $('#wrapper-main').css({ height: View.getHeight() - 60 });
            $('#wrapper-mtrees').css({ height: View.getHeight() - 60 });
            $('.collapsible-list').css({ height: View.getHeight() - 60 - 34 * 4 - 20 });
        }

        public renderFilterList = () => {
            var self: ManageTreesTableView = this;
            var template = _.template(Template.getTreeFilterListTemplate());
            var data = {
                foods: Model.getFoods(),
            }
            self.$('#filter-list').html(template(data));
        }

        public _applyFilter(event?: Event): void {
            var self: ManageTreesTableView = this;
            var trees: Trees = Model.getTrees();
            setTimeout(function () {
                // Filtering food type.
                if (event != undefined) {
                    if ($(event.target).find('input').prop('name') == 'foodsall') {
                        if ($(event.target).find('input').prop('checked') == true) {
                            $('.filter-food').addClass('active');
                            $('.filter-food input').prop({ 'checked': 'checked' });
                        } else {
                            $('.filter-food').removeClass('active');
                            $('.filter-food input').prop({ 'checked': '' });
                        }
                    }
                }
                

                // Apply food filtering
                var foodIds = new Array<number>();
                $.each(self.$('.filter-food input'), function (index: number, item: JQuery) {
                    if ($(item).prop('checked') == true) {
                        foodIds.push(Math.floor($(item).prop('name')));
                    }
                });

                trees = trees.filterByFoodIds(foodIds);

                // Filtering adoption status.
                if (event != undefined) {
                    if ($(event.target).find('input').prop('name') == 'adoptsall') {
                        if ($(event.target).find('input').prop('checked') == true) {
                            $('.filter-adopt').addClass('active');
                            $('.filter-adopt input').prop({ 'checked': 'checked' });
                        } else {
                            $('.filter-adopt').removeClass('active');
                            $('.filter-adopt input').prop({ 'checked': '' });
                        }
                    }
                }

                // Apply adopt filtering
                var adoptIds = new Array<number>();
                $.each(self.$('.filter-adopt input'), function (index: number, item: JQuery) {
                    if ($(item).prop('checked') == true) {
                        adoptIds.push(Math.floor($(item).prop('name')));
                    }
                });

                trees = trees.filterByAdoptStatus(adoptIds);

                // update markers
                self.renderTreeList(trees);
            }, 1);
        }

        private _mouseOver(event: Event): void {
            var self: ManageTreesTableView = this;
            //EventHandler.handleMouseOver($(event.currentTarget), self);
        }
        private _mouseClick(event: Event): void {
            var self: ManageTreesTableView = this;
            EventHandler.handleMouseClick($(event.currentTarget), self);
        }
    }

    export class ManageTreesMapView extends ManageTreesView {
        private _map: L.Map;
        private _location: L.LatLng;
        private _zoom: number;
        private _bClosePopupOnClick: boolean = true;
        private _markers: Array<L.Marker>;
        private _selectedMarker: L.Marker;
        private static TAG: string = "ManageTreesMapView - ";
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: ManageTreesMapView = this;
            self.bDebug = true;
            self._zoom = Setting.getDefaultMapZoomLevel();
            self._markers = new Array<L.Marker>();
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = <any>{
                //"mouseover .home-menu-left": "_mouseOver",
                //"mouseover .home-menu-right": "_mouseOver",
                "click .marker-control-item": "_mouseClick",
                "click .collapsible-button": "_openCollapsible",
                "click .filter-checkbox": "_applyFilter",
                "click .flag-radio": "_applyFlag",
                "click .ownership-radio": "_applyOwnership",
                "click .add-tree": "_addNewTree",
                "click .switch-table": "_mouseClick",
            };
            self.delegateEvents();
        }

        public resize(): any {
            $('#wrapper-main').css({ height: View.getHeight() - 60 });
            $('#wrapper-mtrees').css({ height: View.getHeight() - 60 });
            $('.collapsible-list').css({ height: View.getHeight() - 60 - 34 * 4 - 20 });
        }

        public render(args?: any): any {
            if (this.bRendered) {
                this.update(args);
                return self;
            }
            this.bRendered = true;
            var self: ManageTreesMapView = this;
            if (self.bDebug) console.log(ManageTreesMapView.TAG + "render()");
            var template = _.template(Template.getManageTreesMapViewTemplate());
            var data = {

            }
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-mtrees'));
            self.resize();
            Controller.updateGeoLocation(self.renderMap, self.renderMapError);
            return self;
        }

        public update(args?: any): any {
            if (!this.bRendered) {
                this.render(args);
                return self;
            }
            ////
            var self: ManageTreesMapView = this;
            if (self.bDebug) console.log(ManageTreesMapView.TAG + "update()");
            return self;
        }

        public renderFilterList = () => {
            var self: ManageTreesMapView = this;
            var template = _.template(Template.getTreeFilterListTemplate());
            var data = {
                foods: Model.getFoods(),
            }
            self.$('#filter-list').html(template(data));
        }

        public renderForagableList = () => {

        }

        public renderTreeInfo = (tree: Tree) => {
            var self: ManageTreesMapView = this;

            Controller.fetchAllFlagsAndOwners(function () {
                var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                var flag: Flag = Model.getFlags().findWhere({ id: tree.getFlagId() });
                var ownership: Ownership = Model.getOwnerships().findWhere({ id: tree.getOwnershipId() });

                var template = _.template(Template.getTreeInfoTemplate());
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
                
                self.renderFlagInfo(flag);
                self.renderOwnershipInfo(ownership);
                self.renderRecentActivities(tree);
                GeoLocation.reverseGeocoding(tree.getLocation(), function (data: ReverseGeoLocation) {
                    self.$(".tree-info-address").html("<div>" + data.road + ", " + data.county + "</div><div>" + data.state + ", " + data.country + ", " + data.postcode + "</div>");
                }, function () {
                    EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
                self.$('.input-description').on('click', function (event) {
                    $(this).replaceWith("<input type='text' class='input-description form-control' value='" + htmlEncode($(this).text()) + "' />");
                    //self.$('.input-lat').css({ width: width });
                    self.$('.input-description').focus();
                    self.$('.input-description').on('focusout', function (event) {
                        var description: string = self.$('.input-description').val();
                        if (tree.getDescription().trim() != description.trim()) {
                            EventHandler.handleTreeData(tree, DATA_MODE.UPDATE_DESCRIPTION, { description: description }, function () {
                                var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                                self.renderRecentActivities(tree);
                                EventHandler.handleDataChange("Description of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                                self.renderTreeInfo(tree);
                            }, function () {
                                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                            });
                        } else {
                            self.renderTreeInfo(tree);
                        }
                    });
                });

                self.$('.input-food').on('click', function (event) {
                    var template = _.template(Template.FoodSelectTemplate());
                    var data = {
                        foods: Model.getFoods(),
                    }
                    $(this).replaceWith(template(data));
                    
                    self.$('.input-food').selectpicker();
                    self.$('.input-food').selectpicker("val", food.getId());
                    self.$('.input-food').on('hide.bs.dropdown', function (event) {
                        var selected: number = parseInt($(this).find("option:selected").val());
                        if (tree.getFoodId() != selected) {
                            EventHandler.handleTreeData(tree, DATA_MODE.UPDATE_FOODTYPE, { food: selected }, function () {
                                var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                                var flag: Flag = Model.getFlags().findWhere({ id: tree.getFlagId() });
                                EventHandler.handleDataChange("Food type of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                                self._selectedMarker.label._container.innerHTML = food.getName() + " " + tree.getName();
                                self._selectedMarker.setIcon(MarkerFractory.getIcon(food));
                                self.renderTreeInfo(tree);
                            }, function () {
                                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                            });
                            self.renderTreeInfo(tree);
                        } else {
                            self.renderTreeInfo(tree);
                        }
                    });
                });

                self.$('.input-lat').on('click', function (event) {
                    $(this).replaceWith("<input class='input-lat form-control' value='" + $(this).html() + "' />");
                    //self.$('.input-lat').css({ width: width });
                    self.$('.input-lat').focus();
                    self.$('.input-lat').on('focusout', function (event) {
                        var location: L.LatLng = new L.LatLng(parseFloat(self.$('.input-lat').val()), self._selectedMarker.getLatLng().lng);
                        if (location.lat != self._selectedMarker.getLatLng().lat) {
                            if (self._selectedMarker != undefined && self._selectedMarker.options.id != undefined) {
                                EventHandler.handleTreeData(tree, DATA_MODE.UPDATE_LOCATION, { marker: self._selectedMarker, location: location }, function () {
                                    var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                                    self.renderRecentActivities(tree);
                                    EventHandler.handleDataChange("Location of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                                    // Move marker to desired location & update info panel
                                    self._selectedMarker.setLatLng(tree.getLocation());
                                    self._map.setView(tree.getLocation());
                                    self.renderTreeInfo(tree);
                                }, function () {
                                    EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                                });
                            }
                        } else {
                            self.renderTreeInfo(tree);
                        }
                    });
                });
                self.$('.input-lng').on('click', function (event) {
                    var width: number = self.$('.input-lng').outerWidth() + 8;
                    $(this).replaceWith("<input class='input-lng form-control' value='" + $(this).html() + "' />");
                    //self.$('.input-lng').css({ width: width });
                    self.$('.input-lng').focus();
                    self.$('.input-lng').on('focusout', function (event) {
                        var location: L.LatLng = new L.LatLng(self._selectedMarker.getLatLng().lat, parseFloat(self.$('.input-lng').val()));
                        if (location.lng != self._selectedMarker.getLatLng().lng) {
                            if (self._selectedMarker != undefined && self._selectedMarker.options.id != undefined) {
                                EventHandler.handleTreeData(tree, DATA_MODE.UPDATE_LOCATION, { marker: self._selectedMarker, location: location }, function () {
                                    var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                                    self.renderRecentActivities(tree);
                                    EventHandler.handleDataChange("Location of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                                    // Move marker to desired location & update info panel
                                    self._selectedMarker.setLatLng(tree.getLocation());
                                    self._map.setView(tree.getLocation());
                                    self.renderTreeInfo(tree);
                                }, function () {
                                    EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                                });
                            }
                        } else {
                            self.renderTreeInfo(tree);
                        }
                        
                    });
                });
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }

        private renderOwnershipInfo(flag: Flag): void {
            var self: ManageTreesMapView = this;
            $.each(self.$('.ownership-radio'), function (index: number, item: JQuery) {
                if (parseInt($(item).attr('data-target')) == flag.getId()) {
                    $(item).addClass('active');
                    $(item).find('input').prop({ 'checked': 'checked' });
                } else {
                    $(item).removeClass('active');
                    $(item).find('input').prop({ 'checked': '' });
                }
                if (parseInt($(item).attr('data-target')) == 0) {
                    $(this).attr('disabled', 'disabled');
                    $(item).addClass('disabled');
                }
            });
        }

       private renderFlagInfo(flag: Flag): void {
           var self: ManageTreesMapView = this;
           $.each(self.$('.flag-radio'), function (index: number, item: JQuery) {
               if (parseInt($(item).attr('data-target')) == flag.getId()) {
                   $(item).addClass('active');
                   $(item).find('input').prop({ 'checked': 'checked' });
               } else {
                   $(item).removeClass('active');
                   $(item).find('input').prop({ 'checked': '' });
               }
               if (parseInt($(item).attr('data-target')) == 0) {
                   $(this).attr('disabled', 'disabled');
                   $(item).addClass('disabled');
               }
           });
        }

       private renderRecentActivities(tree: Tree): void {
           var self: ManageTreesMapView = this;
           var trees: Array<Tree> = new Array<Tree>();
           trees.push(tree);
           Controller.fetchNotesOfTrees(trees, Setting.getNumRecentActivitiesShown(), 0, function () {
               var notes: Notes = new Notes(Model.getNotes().where({ tree: tree.getId() }));
               notes.sortByDescendingDate();
               var template = _.template(Template.getRecentActivitiesTemplate());
               var data = {
                   notes: notes,
                   size: Setting.getNumRecentActivitiesShown(),
                   coordinate: '@ ' + tree.getLat().toFixed(4) + ", " + tree.getLng().toFixed(4),
                   flags: Model.getFlags(),
                   ownerships: Model.getOwnerships(),
               }
               self.$('#list-activities').html(template(data));
           }, function () {
               EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
           });
       }

        private renderMapError = (error: PositionError) => {
            var self: ManageTreesMapView = this;
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
            self.renderMap({ coords: { accuracy: 4196, altitude: null, altitudeAccuracy: null, heading: null, latitude: 33.7946333, longitude: -84.448771, speed: null }, timestamp: new Date().valueOf() });
        }

        public renderMap = (position: Position) => {
            var self: ManageTreesMapView = this;
            var accuracy = position.coords.accuracy;
            self._location = new L.LatLng(position.coords.latitude, position.coords.longitude);

            if (self._map == undefined) {
                self.$('#list-donation').css({ height: View.getHeight() - 60 });
                self.setLocation(new L.LatLng(position.coords.latitude, position.coords.longitude));
                self._map = L.map(self.$('#content-map')[0].id, {
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

                    //$('.leaflet-popup-content .marker-control-item').off('click');
                    //$('.leaflet-popup-content .marker-control-item').on('click', function (event) {
                    //    //console.log($('.leaflet-popup-content .glyphicon').attr('data-id'));
                    //    Router.getInstance().navigate("tree/" + $('.leaflet-popup-content .glyphicon').attr('data-id'), { trigger: true });
                    //});
                    var tree: Tree = Model.getTrees().findWhere({ id: marker.options.id });
                    self.renderTreeInfo(tree);
                    self._selectedMarker = marker;
                    // Make MessageView invisible.
                    if (View.getMessageView()) {
                        View.getMessageView().setInvisible();
                    }
                });
                self._map.on('popupclose', function (event: any) {
                    var marker: L.Marker = event.popup._source;
                    marker._resetZIndex();
                    $(marker.label._container).removeClass('active');
                    self.$('#wrapper-treeinfo').addClass('hidden');
                    self._selectedMarker = null;
                });
            }
        }

        private afterMoveMap = () => {
            var self: ManageTreesMapView = this;
            if (self._selectedMarker) {
                self._selectedMarker._bringToFront();
            }
        }



        private renderTrees = () => {
            var self: ManageTreesMapView = this;
            Controller.fetchAllTrees(self.renderMarkers, self.renderMarkersError);
        }

        private renderMarkers = () => {
            var self: ManageTreesMapView = this;
            console.log(ManageTreesMapView.TAG + "renderMarkers()");
            $.each(Model.getTrees().models, function (index: number, tree: Tree) {
                var bFound: boolean = false;
                for (var j = 0; j < self._markers.length && !bFound; j++) {
                    if (tree.getId() == self._markers[j].options.id) {
                        bFound = true;
                    }
                }
                if (!bFound) {
                    self.addMarker(tree);
                }
            });

            if (self._id != undefined && self._id != 0) {
                for (var j = 0; j < self._markers.length; j++) {
                    if (self._markers[j].options.id == self._id) {
                        self._markers[j].openPopup();
                        self._map.setView(self._markers[j].getLatLng());
                        break;
                    }
                }
            }

            // Render filter list
            self.renderFilterList();
            // Render foragable list
        }

        private updateMarkers = (trees: Trees) => {
            var self: ManageTreesMapView = this;
            console.log(ManageTreesMapView.TAG + "updateMarkers()");
            // Add new markers
            $.each(trees.models, function (index: number, tree: Tree) {
                var bFound: boolean = false;
                for (var j = 0; j < self._markers.length && !bFound; j++) {
                    if (tree.getId() == self._markers[j].options.id) {
                        bFound = true;
                    }
                }
                if (!bFound) {
                    self.addMarker(tree);
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
            var self: ManageTreesMapView = this;
            self._map.removeLayer(marker);
        }

        private addMarker(tree: Tree): void {
            var self: ManageTreesMapView = this;
            var marker: L.Marker = MarkerFractory.create(tree, true);
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
            marker.on("dragend", function (event) {
                if (marker.options.id != undefined) {
                    var tree: Tree = Model.getTrees().findWhere({
                        id: marker.options.id
                    });
                    EventHandler.handleTreeData(tree, DATA_MODE.UPDATE_LOCATION, { marker: marker, location: marker.getLatLng() }, function () {
                        var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                        self.renderRecentActivities(tree);
                        EventHandler.handleDataChange("Location of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                        self.renderTreeInfo(tree);
                    }, function () {
                        EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                }
            });
        }

        private renderMarkersError = (errorMode: ERROR_MODE) => {
            var self: ManageTreesMapView = this;
            console.log(ManageTreesMapView.TAG + "renderMarkersError()");
            EventHandler.handleError(errorMode);
        }

        public deleteTree(tree: Tree) {
            var self: ManageTreesMapView = this;
            EventHandler.handleTreeData(tree, DATA_MODE.DELETE, {}, function () {
                var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                self.updateMarkers(Model.getTrees());
                EventHandler.handleDataChange("<strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has deleted successfully.", false);
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }

        public setLocation(location: L.LatLng): void {
            var self: ManageTreesMapView = this;
            self._location = location;
        }

        private _mouseOver(event: Event): void {
            var self: ManageTreesMapView = this;
            //EventHandler.handleMouseOver($(event.currentTarget), self);
        }
        private _mouseClick(event: Event): void {
            var self: ManageTreesMapView = this;
            if (self._selectedMarker != undefined) {
                EventHandler.handleMouseClick($(event.currentTarget), self, { marker: self._selectedMarker, tree: self._selectedMarker.options.id });
            } else {
                EventHandler.handleMouseClick($(event.currentTarget), self, { marker: self._selectedMarker });
            }
            
        }
        private _openCollapsible(event: Event): void {
            var self: ManageTreesMapView = this;
            $('.collapsible-list').addClass('hidden');
            $($(event.currentTarget).attr('data-target')).removeClass('hidden');
        }
        private _applyFilter(event: Event): void {
            var self: ManageTreesMapView = this;
            var trees: Trees = Model.getTrees();
            setTimeout(function () {
                // Filtering food type.
                if ($(event.target).find('input').prop('name') == 'foodsall') {
                    if ($(event.target).find('input').prop('checked') == true) {
                        $('.filter-food').addClass('active');
                        $('.filter-food input').prop({ 'checked': 'checked' });
                    } else {
                        $('.filter-food').removeClass('active');
                        $('.filter-food input').prop({ 'checked': '' });
                    }
                }

                // Apply food filtering
                var foodIds = new Array<number>();
                $.each(self.$('.filter-food input'), function (index: number, item: JQuery) {
                    if ($(item).prop('checked') == true) {
                        foodIds.push(Math.floor($(item).prop('name')));
                    }
                });
                trees = trees.filterByFoodIds(foodIds);

                // Filtering adoption status.
                if ($(event.target).find('input').prop('name') == 'adoptsall') {
                    if ($(event.target).find('input').prop('checked') == true) {
                        $('.filter-adopt').addClass('active');
                        $('.filter-adopt input').prop({ 'checked': 'checked' });
                    } else {
                        $('.filter-adopt').removeClass('active');
                        $('.filter-adopt input').prop({ 'checked': '' });
                    }
                }

                // Apply adopt filtering
                var adoptIds = new Array<number>();
                $.each(self.$('.filter-adopt input'), function (index: number, item: JQuery) {
                    if ($(item).prop('checked') == true) {
                        adoptIds.push(Math.floor($(item).prop('name')));
                    }
                });
                trees = trees.filterByAdoptStatus(adoptIds);

                // update markers
                self.updateMarkers(trees);
            }, 1);
        }
        private _applyFlag(event: Event): void {
            var self: ManageTreesMapView = this;
            var tree: Tree = Model.getTrees().findWhere({ id: self._selectedMarker.options.id });
            var flag: number = parseInt($(event.target).attr('data-target'));
            if (tree.getFlagId() != flag) {
                EventHandler.handleTreeData(tree, DATA_MODE.UPDATE_FLAG, { flag: flag }, function () {
                    var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                    var flag: Flag = Model.getFlags().findWhere({ id: tree.getFlagId() });
                    self.renderFlagInfo(flag);
                    self.renderRecentActivities(tree);
                    EventHandler.handleDataChange("Status of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                }, function () {
                    EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            }
        }

        private _applyOwnership(event: Event): void {
            var self: ManageTreesMapView = this;
            var tree: Tree = Model.getTrees().findWhere({ id: self._selectedMarker.options.id });
            var ownership: number = parseInt($(event.target).attr('data-target'));
            if (tree.getOwnershipId() != ownership) {
                EventHandler.handleTreeData(tree, DATA_MODE.UPDATE_OWNERSHIP, { ownership: ownership }, function () {
                    var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                    var ownership: Ownership = Model.getOwnerships().findWhere({ id: tree.getOwnershipId() });
                    self.renderOwnershipInfo(ownership);
                    self.renderRecentActivities(tree);
                    EventHandler.handleDataChange("Ownership of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                }, function () {
                    EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            }
        }

        private _addNewTree(event: Event): void {
            var self: ManageTreesMapView = this;
            var tree: Tree = new Tree({ lat: self._map.getCenter().lat, lng: self._map.getCenter().lng, food: 0, type: 0, flag: 0, owner: 0, ownership: 0, description: "" });
            EventHandler.handleTreeData(tree, DATA_MODE.CREATE, {}, function () {
                var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                self.updateMarkers(Model.getTrees());
                for (var j = 0; j < self._markers.length; j++) {
                    if (self._markers[j].options.id == tree.getId()) {
                        self._markers[j].openPopup();
                        break;
                    }
                }
                EventHandler.handleDataChange("<strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has been created successfully.", true);
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            }, function () {
                var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                EventHandler.handleDataChange("<strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has been deleted successfully.", false);
                self.updateMarkers(Model.getTrees());
            });
        }
    }
}