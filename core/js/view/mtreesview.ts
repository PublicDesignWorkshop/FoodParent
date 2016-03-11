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
        public static create(el: JQuery, id: number): ManageTreesView {
            var view: ManageTreesView;
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

        public renderFilterList = () => {

        }

        public _applyFilter(event?: Event) {

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
            var tree: Tree = new Tree({ lat: position.coords.latitude, lng: position.coords.longitude, food: 1, type: 0, flag: 0, owner: 0, ownership: 1, description: "", address: "" });
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
            $('.collapsible-list').css({ height: View.getHeight() - 60 - 34 * 4 - 20 });
        }

        public renderFilterList = () => {
            var self: ManageTreesTableView = this;
            Controller.checkLogin(function (data) {
                if (data.result == true || data.result == 'true') {   // Already logged in
                    var template = _.template(Template.getTreeFilterListTemplate());
                    self.$('#filter-list').html(template({
                        foods: Model.getFoods(),
                        userid: parseInt(data.id),
                        flags: Model.getFlags(),
                        ownerships: Model.getOwnerships(),
                    }));
                } else if (data.result == false || data.result == 'false') {   // Not logged in
                    var template = _.template(Template.getTreeFilterListTemplate2());
                    self.$('#filter-list').html(template({
                        foods: Model.getFoods(),
                        flags: Model.getFlags(),
                        ownerships: Model.getOwnerships(),
                    }));
                }
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });

        }

        public _applyFilter(event?: Event): void {
            var self: ManageTreesTableView = this;
            var trees: Trees = Model.getTrees();
            setTimeout(function () {
                // Apply only my trees
                if (self.$('input[name="onlymine"]').prop('checked') == true) {
                    trees = trees.filterByParent(parseInt(self.$('input[name="onlymine"]').attr('data-target')));
                }

                // Filtering ownership type.
                if (event != undefined) {
                    if ($(event.target).find('input').prop('name') == 'ownershipsall') {
                        if ($(event.target).find('input').prop('checked') == true) {
                            $('.filter-ownership').addClass('active');
                            $('.filter-ownership input').prop({ 'checked': 'checked' });
                        } else {
                            $('.filter-ownership').removeClass('active');
                            $('.filter-ownership input').prop({ 'checked': '' });
                        }
                    }
                }

                // Apply ownership filtering
                var ownershipIds = new Array<number>();
                $.each(self.$('.filter-ownership input'), function (index: number, item: JQuery) {
                    if ($(item).prop('checked') == true) {
                        ownershipIds.push(Math.floor($(item).prop('name')));
                    }
                });
                trees = trees.filterByOwnershipIds(ownershipIds);

                // Filtering flag type.
                if (event != undefined) {
                    if ($(event.target).find('input').prop('name') == 'flagsall') {
                        if ($(event.target).find('input').prop('checked') == true) {
                            $('.filter-flag').addClass('active');
                            $('.filter-flag input').prop({ 'checked': 'checked' });
                        } else {
                            $('.filter-flag').removeClass('active');
                            $('.filter-flag input').prop({ 'checked': '' });
                        }
                    }
                }

                // Apply flag filtering
                var flagIds = new Array<number>();
                $.each(self.$('.filter-flag input'), function (index: number, item: JQuery) {
                    if ($(item).prop('checked') == true) {
                        flagIds.push(Math.floor($(item).prop('name')));
                    }
                });
                trees = trees.filterByFlagIds(flagIds);

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
                "click .food-item": "_applySearch",
                "click #wrapper-food-search span.btn" : "_resetSearch",
                "click .marker-control-item": "_mouseClick",
                "click .collapsible-button": "_openCollapsible",
                "click .filter-checkbox": "_applyFilter",
                "click .flag-radio": "_applyFlag",
                "click .ownership-radio": "_applyOwnership",
                "click .add-tree": "_addNewTree",
                "click .switch-table": "_mouseClick",
                "click .button-tree-detail": "_mouseClick",
                "click .button-manage-adoption": "_mouseClick",
                "click .button-tree-adopt": "_mouseClick",
                "click .button-tree-unadopt": "_mouseClick",
                "click .button-new-note": "_mouseClick",
                "keydown #search-food": "_searchKeyDown",
            };
            self.delegateEvents();
        }

        public resize(): any {
            Controller.checkAdmin(function (data) {
                if (data.result == true || data.result == 'true') {   // Already logged in
                    $('.collapsible-list').css({ height: View.getHeight() - 60 - 34 * 4 - 20 });
                } else if (data.result == false || data.result == 'false') {   // Not logged in
                    $('.collapsible-list').css({ height: View.getHeight() - 60 - 34 * 2 - 20 });
                }
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }

        public render(args?: any): any {
            if (this.bRendered) {
                this.update(args);
                return self;
            }
            this.bRendered = true;
            var self: ManageTreesMapView = this;

            Controller.checkAdmin(function (data) {
                if (data.result == true || data.result == 'true') {   // Already logged in as admin
                    if (self.bDebug) console.log(ManageTreesMapView.TAG + "render()");
                    var template = _.template(Template.getManageTreesMapViewTemplate());
                    self.$el.html(template({

                    }));
                    self.setElement(self.$('#wrapper-mtrees'));
                    $('.collapsible-list').css({ height: View.getHeight() - 60 - 34 * 4 - 20 });
                    //self.resize();
                } else if (data.result == false || data.result == 'false') {   // Not admin but logged in
                    if (self.bDebug) console.log(ManageTreesMapView.TAG + "render()");
                    //var template = _.template(Template.getManageTreesMapViewTemplate2());
                    //self.$el.html(template({

                    //}));
                    self.setElement(self.$('#wrapper-mtrees'));
                    $('.collapsible-list').css({ height: View.getHeight() - 60 - 34 * 2 - 20 });
                    $('#mytrees-toggle').bootstrapToggle();
                    //self.resize();
                }
                Controller.updateGeoLocation(self.renderMap, self.renderMapError);
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
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
            Controller.checkLogin(function (data) {
                if (data.result == true || data.result == 'true') {   // Already logged in
                    var template = _.template(Template.getTreeFilterListTemplate());
                    self.$('#filter-list').html(template({
                        foods: Model.getFoods(),
                        flags: Model.getFlags(),
                        ownerships: Model.getOwnerships(),
                        userid: parseInt(data.id),
                    }));
                } else if (data.result == false || data.result == 'false') {   // Not logged in
                }
                var template = _.template(Template.getFoodItemTemplate());
                self.$('#list-food').html(template({
                    foods: Model.getFoods(),
                }));

                $('#list-food').btsListFilter('#search-food', {
                    itemChild: 'span',
                    //sourceTmpl: '<div class="food-item">{title}</div>',
                    itemEl: '.food-item',
                    emptyNode: function (data) {
                        return '<div class="user-item-none">No Result</div><div class="clear" />';
                    },
                });

                
                    
                
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }

        public renderForagableList = () => {

        }

        public renderTreeInfo = (tree: Tree) => {
            var self: ManageTreesMapView = this;
            var bAdmin: boolean = false;
            var bLogIn: boolean = false;

            Controller.checkLogin(function (response1) {
                if (response1.result == true || response1.result == 'true') {   // Already logged in
                    bLogIn = true;
                } else {   // Not logged in
                    bLogIn = false;
                }
                Controller.checkAdmin(function (data) {
                    if (data.result == true || data.result == 'true') {   // Already logged in
                        bAdmin = true;
                    } else if (data.result == false || data.result == 'false') {   // Not logged in
                        bAdmin = false;
                    }

                    Controller.fetchAllFlagsAndOwners(function () {
                        var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                        var ownership: Ownership = Model.getOwnerships().findWhere({ id: tree.getOwnershipId() });
                        if (!bLogIn) {
                            var template = _.template(Template.getTreeInfoTemplate4());
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
                        } else {
                            if (bAdmin) {
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
                            } else {
                                var adopt: Adopt;
                                if (self._selectedMarker) {
                                    adopt = Model.getAdopts().findWhere({ tree: self._selectedMarker.options.id, parent: parseInt(response1.id) });
                                }
                                if (adopt) {
                                    var template = _.template(Template.getTreeInfoTemplate5());
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
                                } else {
                                    var template = _.template(Template.getTreeInfoTemplate4());
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
                                }
                            }
                        }

                        self.$('#wrapper-treeinfo').removeClass('hidden');

                        self.renderFlagInfo(tree.getFlags());
                        self.renderOwnershipInfo(ownership);
                        self.renderRecentActivities(tree);


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
                        if (bAdmin) {
                            self.$('.input-address').on('click', function (event) {
                                $(this).replaceWith("<input type='text' class='input-address form-control' value='" + htmlEncode($(this).text()) + "' />");
                                self.$('.input-address').focus();
                                self.$('.input-address').on('focusout', function (event) {
                                    var address: string = self.$('.input-address').val();
                                    if (address.trim() == '') {
                                        FoodParent.GeoLocation.reverseGeocoding(tree.getLocation(), function (data: FoodParent.ReverseGeoLocation) {
                                            if ((data.road + ", " + data.county + ", " + data.state + ", " + data.postcode) != tree.getAddress()) {
                                                FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.UPDATE_ADDRESS, { address: data.road + ", " + data.county + ", " + data.state + ", " + data.postcode }, function () {
                                                    var food: FoodParent.Food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                                                    FoodParent.EventHandler.handleDataChange("Address of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has been changed successfully.", true);
                                                    self.renderTreeInfo(tree);
                                                }, function () {
                                                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                                                });
                                            } else {
                                                self.renderTreeInfo(tree);
                                            }
                                        }, function () {
                                            FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                                        });
                                    } else if (tree.getAddress().trim() != address.trim()) {
                                        FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.UPDATE_ADDRESS, { address: address.trim() }, function () {
                                            var food: FoodParent.Food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                                            FoodParent.EventHandler.handleDataChange("Address of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has been changed successfully.", true);
                                            self.renderTreeInfo(tree);
                                        }, function () {
                                            FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                                        });
                                    } else {
                                        self.renderTreeInfo(tree);
                                    }
                                });
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
                        }
                    }, function () {
                        EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });

                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            }, function (response1) {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }

        private renderOwnershipInfo(ownership: Ownership): void {
            var self: ManageTreesMapView = this;
            Controller.checkAdmin(function (data) {
                if (data.result == true || data.result == 'true') {   // Already logged in
                    $.each(self.$('.ownership-radio'), function (index: number, item: JQuery) {
                        if (ownership != undefined) {
                            if (parseInt($(item).attr('data-target')) == ownership.getId()) {
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
                        }
                    });
                } else if (data.result == false || data.result == 'false') {   // Not logged in
                    $.each(self.$('.ownership-radio'), function (index: number, item: JQuery) {
                        if (ownership != undefined) {
                            if (parseInt($(item).attr('data-target')) == ownership.getId()) {
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
                            $(item).css({ 'pointer-events': 'none' });
                        }
                    });
                }
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }

       private renderFlagInfo(flags: Array<number>): void {
           var self: ManageTreesMapView = this;
           Controller.checkAdmin(function (data) {
               if (data.result == true || data.result == 'true') {   // Already logged in
                   $.each(self.$('.flag-radio'), function (index: number, item: JQuery) {
                       var bFound: boolean = false;
                       $.each(flags, function (index2: number, flag: number) {
                           if (parseInt($(item).attr('data-target')) == flag) {
                               bFound = true;
                           }
                       });
                       if (bFound) {
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
               } else if (data.result == false || data.result == 'false') {   // Not logged in
                   $.each(self.$('.flag-radio'), function (index: number, item: JQuery) {
                       var bFound: boolean = false;
                       $.each(flags, function (index2: number, flag: number) {
                           if (parseInt($(item).attr('data-target')) == flag) {
                               bFound = true;
                           }
                       });
                       if (bFound) {
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
                       $(item).css({ 'pointer-events': 'none' });
                   });
               }
           }, function () {
               FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
           });
        }

       private renderRecentActivities(tree: Tree): void {
           var self: ManageTreesMapView = this;
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
                    Router.getInstance().navigate("mtrees/" + tree.getId(), { trigger: false, replace: true });
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

            Controller.checkAdmin(function (data) {
                $.each(Model.getTrees().models, function (index: number, tree: Tree) {
                    var bFound: boolean = false;
                    for (var j = 0; j < self._markers.length && !bFound; j++) {
                        if (tree.getId() == self._markers[j].options.id) {
                            bFound = true;
                        }
                    }
                    if (!bFound) {
                        if (data.result == true || data.result == 'true') {   // Already logged in
                            self.addMarker(tree, true);
                        } else if (data.result == false || data.result == 'false') {   // Not logged in
                            self.addMarker(tree, false);
                        }
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
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }

        private updateMarkers = (trees: Trees) => {
            var self: ManageTreesMapView = this;
            console.log(ManageTreesMapView.TAG + "updateMarkers()");

            Controller.checkAdmin(function (data) {
                // Add new markers
                $.each(trees.models, function (index: number, tree: Tree) {
                    var bFound: boolean = false;
                    for (var j = 0; j < self._markers.length && !bFound; j++) {
                        if (tree.getId() == self._markers[j].options.id) {
                            bFound = true;
                        }
                    }
                    if (!bFound) {
                        if (data.result == true || data.result == 'true') {   // Already logged in
                            self.addMarker(tree, true);
                        } else if (data.result == false || data.result == 'false') {   // Not logged in
                            self.addMarker(tree, false);
                        }
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
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }

        private removeMarker(marker: L.Marker): void {
            var self: ManageTreesMapView = this;
            self._map.removeLayer(marker);
        }

        private addMarker(tree: Tree, editable: boolean): void {
            var self: ManageTreesMapView = this;
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

        public _applyFilter(event?: Event): void {
            var self: ManageTreesMapView = this;
            var trees: Trees = Model.getTrees();

            setTimeout(function () {
                // Apply only my trees
                if (self.$('input[name="onlymine"]').prop('checked') == true) {
                    trees = trees.filterByParent(parseInt(self.$('input[name="onlymine"]').attr('data-target')));
                }

                // Filtering ownership type.
                if (event != undefined) {
                    if ($(event.target).find('input').prop('name') == 'ownershipsall') {
                        if ($(event.target).find('input').prop('checked') == true) {
                            $('.filter-ownership').addClass('active');
                            $('.filter-ownership input').prop({ 'checked': 'checked' });
                        } else {
                            $('.filter-ownership').removeClass('active');
                            $('.filter-ownership input').prop({ 'checked': '' });
                        }
                    }
                }

                // Apply ownership filtering
                var ownershipIds = new Array<number>();
                $.each(self.$('.filter-ownership input'), function (index: number, item: JQuery) {
                    if ($(item).prop('checked') == true) {
                        ownershipIds.push(Math.floor($(item).prop('name')));
                    }
                });
                trees = trees.filterByOwnershipIds(ownershipIds);


                // Filtering flag type.
                if (event != undefined) {
                    if ($(event.target).find('input').prop('name') == 'flagsall') {
                        if ($(event.target).find('input').prop('checked') == true) {
                            $('.filter-flag').addClass('active');
                            $('.filter-flag input').prop({ 'checked': 'checked' });
                        } else {
                            $('.filter-flag').removeClass('active');
                            $('.filter-flag input').prop({ 'checked': '' });
                        }
                    }
                }

                // Apply flag filtering
                var flagIds = new Array<number>();
                $.each(self.$('.filter-flag input'), function (index: number, item: JQuery) {
                    if ($(item).prop('checked') == true) {
                        flagIds.push(Math.floor($(item).prop('name')));
                    }
                });
                trees = trees.filterByFlagIds(flagIds);

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
                self.updateMarkers(trees);
            }, 1);
        }
        private _applyFlag(event: Event): void {
            var self: ManageTreesMapView = this;
            //.prop('checked')
            Controller.checkAdmin(function (data) {
                if (data.result == true || data.result == 'true') {   // Already logged in
                    var tree: Tree = Model.getTrees().findWhere({ id: self._selectedMarker.options.id });
                    var flag: number = parseInt($(event.target).attr('data-target'));
                    if ($(event.target).find('input[type="checkbox"]').prop('checked')) {   // checked
                        EventHandler.handleTreeData(tree, DATA_MODE.UPDATE_FLAG, { flag: flag, addmode: true }, function () {
                            var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                            self.renderFlagInfo(tree.getFlags());
                            self.renderRecentActivities(tree);
                            EventHandler.handleDataChange("Status of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                            self._applyFilter();
                        }, function () {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    } else {    // unchecked
                        EventHandler.handleTreeData(tree, DATA_MODE.UPDATE_FLAG, { flag: flag, addmode: false }, function () {
                            var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                            self.renderFlagInfo(tree.getFlags());
                            self.renderRecentActivities(tree);
                            EventHandler.handleDataChange("Status of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                            self._applyFilter();
                        }, function () {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    }
                } else {
                    var tree: Tree = Model.getTrees().findWhere({ id: self._selectedMarker.options.id });
                    self.renderFlagInfo(tree.getFlags());
                }
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
            
        }

        private _applyOwnership(event: Event): void {
            var self: ManageTreesMapView = this;
            Controller.checkAdmin(function (data) {
                if (data.result == true || data.result == 'true') {   // Already logged in
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
                } else {
                    var tree: Tree = Model.getTrees().findWhere({ id: self._selectedMarker.options.id });
                    self.renderOwnershipInfo(Model.getOwnerships().findWhere({ id: tree.getOwnershipId() }));
                }
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }

        private _addNewTree(event: Event): void {
            var self: ManageTreesMapView = this;
            var tree: Tree = new Tree({ lat: self._map.getCenter().lat, lng: self._map.getCenter().lng, food: 1, type: 0, flag: 0, owner: 0, ownership: 1, description: "", address: "" });
            EventHandler.handleTreeData(tree, DATA_MODE.CREATE, {}, function () {
                var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                //self.updateMarkers(Model.getTrees());
                self._applyFilter();
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

        private _searchKeyDown(event: Event): void {
            var self: ManageTreesMapView = this;
            console.log($(event.currentTarget));

            setTimeout(function () {
                if (self.$('#search-food').val().trim() != "") {
                    setTimeout(function () {
                        self.$('#wrapper-list-food').removeClass('hidden'); 
                    }, 500);
                } else {
                    self.$('#wrapper-list-food').addClass('hidden');
                }
            }, 10);
        }

        private _applySearch(event: Event): void {
            var self: ManageTreesMapView = this;
            console.log($(event.currentTarget).attr('data-id'));
            var food: Food = Model.getFoods().findWhere({
                'id': parseInt($(event.currentTarget).attr('data-id'))
            });
            console.log(food.getName());
            self.$('#search-food').val(food.getName());

            // Find all trees
            var trees: Trees = Model.getTrees();
            // Apply food filtering
            trees = trees.filterByFoodIds([parseInt($(event.currentTarget).attr('data-id'))]);
            
            // update markers
            self.updateMarkers(trees);
        }

        private _resetSearch(event: Event): void {
            var self: ManageTreesMapView = this;
            self.$('#search-food').val("");
            var trees: Trees = Model.getTrees();
            self.updateMarkers(trees);
            self.$('#wrapper-list-food').addClass('hidden');

        }
    }
}