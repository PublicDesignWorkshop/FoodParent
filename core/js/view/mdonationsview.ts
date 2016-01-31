declare var LocationColumn;
declare var NewLocationColumn;
declare var DonationColumn;
declare var NewDonationColumn;

module FoodParent {
    export class ManageDonationsViewFractory {
        private static _instance: ManageDonationsViewFractory = new ManageDonationsViewFractory();
        private baseUrl: string;
        constructor(args?: any) {
            if (ManageDonationsViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use ManageDonationsViewFractory.getInstance() instead of new.");
            }
            ManageDonationsViewFractory._instance = this;
        }
        public static getInstance(): ManageDonationsViewFractory {
            return ManageDonationsViewFractory._instance;
        }
        public static create(el: JQuery, viewMode: VIEW_MODE, id: number): ManageDonationsView {
            var view: ManageDonationsView;
            if (viewMode == VIEW_MODE.MAP) {
                //view = new ManageTreesMapView({ el: el });
                //view.setTreeId(id);
            } else if (viewMode == VIEW_MODE.TABLE) {
                view = new ManageDonationsTableView({ el: el });
                view.setTreeId(id);
            }

            return view;
        }
    }

    export class ManageDonationsView extends BaseView {
        protected _id: number;
        public setTreeId(id: number) {
            this._id = id;
        }
        public renderTreeInfo = (tree: Tree) => {

        }
    }
    export class ManageDonationsTableView extends ManageDonationsView {
        private static TAG: string = "ManageDonationsTableView - ";
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: ManageDonationsTableView = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = <any>{
                "click .switch-map": "_mouseClick",
                "click .filter-checkbox": "_applyFilter",
                "click .add-location": "_addNewPlace",
            };
            self.delegateEvents();
        }

        public render(args?: any): any {
            if (this.bRendered) {
                this.update(args);
                return self;
            }
            this.bRendered = true;
            var self: ManageDonationsTableView = this;
            if (self.bDebug) console.log(ManageDonationsTableView.TAG + "render()");
            var template = _.template(Template.getManageDonationsTableViewTemplate());
            var data = {

            }
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-mdonations'));
            self.renderLocations();
            self.resize();

            return self;
        }

        public resize(): any {
            $('#content-donations-table').css({ width: View.getWidth() - $('#wrapper-tablemenu').outerWidth() });
            $('#wrapper-main').css({ height: View.getHeight() - 60 });
            $('#wrapper-mtrees').css({ height: View.getHeight() - 60 });
            $('.collapsible-list').css({ height: View.getHeight() - 60 - 34 * 3 - 20 });
        }

        private _addNewPlace = () => {
            var self: ManageDonationsTableView = this;
            if (self.$(".new-location").hasClass('hidden')) {
                Controller.updateGeoLocation(self.renderNewPlace, self.renderGeoLocationError);
            } else {
                self.$(".new-location").addClass('hidden');
            }
        }

        private renderGeoLocationError = (error: PositionError) => {
            var self: ManageDonationsTableView = this;
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

        public renderNewPlace = (position: Position) => {
            var self: ManageDonationsTableView = this;
            var place: Place = new Place({ name: "", description: "", lat: position.coords.latitude, lng: position.coords.longitude });
            var places: Places = new Places();
            places.add(place);
            var grid = new Backgrid.Grid({
                columns: NewLocationColumn,
                collection: places,
                emptyText: Setting.getNoDataText(),
            });
            grid.render();
            //grid.sort("name", "ascending");
            self.$(".new-location").html('<div class="list-title">Add a New Location</div>');
            self.$(".new-location").append(grid.el);
            self.$(".new-location").removeClass('hidden');
        }

        private renderLocations = () => {
            var self: ManageDonationsTableView = this;
            Controller.fetchAllLocations(function () {
                // add grid instance for existing data
                self.renderLocationList(Model.getPlaces());
                //self.renderFilterList();
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }

        public renderLocationList = (places: Places) => {
            var self: ManageDonationsTableView = this;

            var grid = new Backgrid.Grid({
                columns: LocationColumn,
                collection: places,
                emptyText: Setting.getNoDataText(),
            });
            grid.render();
            grid.sort("name", "ascending");
            self.$(".list-location").html(grid.el);
        }
    }

    export class AddDonationViewFactory {
        private static _instance: AddDonationViewFactory = new AddDonationViewFactory();
        private baseUrl: string;
        constructor(args?: any) {
            if (AddDonationViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use AddDonationViewFactory.getInstance() instead of new.");
            }
            AddDonationViewFactory._instance = this;
        }
        public static getInstance(): AddDonationViewFactory {
            return AddDonationViewFactory._instance;
        }
        public static create(el: JQuery, place: Place): AddDonationView {
            var view: AddDonationView = new AddDonationView({ el: el });
            view.setPlace(place);
            return view;
        }
    }

    export class AddDonationView extends PopupView {
        private static TAG: string = "AddDonationView - ";
        private _place: Place;
        private _donation: Donation;
        private _bTableView: boolean;
        private _map: L.Map;
        private _location: L.LatLng;
        private _zoom: number;
        private _markers: Array<L.Marker>;
        private _selectedMarker: L.Marker;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: AddDonationView = this;
            self.bDebug = true;
            self._bTableView = true;
            self._zoom = Setting.getDefaultMapZoomLevel();
            self._markers = new Array<L.Marker>();
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = <any>{
                "click .confirm-confirm": "_executeCommand",
                "click .confirm-cancel": "_mouseClick",
                "click .button-close": "_mouseClick",
                "click .filter-checkbox": "_applyFilter",
                "click .button-submit-donation": "_submitDonations",
                "click .cell-tree-detail": "_removeNewDonationTree",
                "click .switch-map": "_switchView",
                "click .marker-control-plus": "_addNewDonation",
                "click .image-group img": "_selectCoverImage",
            };
            self.delegateEvents();
        }
        public setPlace(place: Place): void {
            var self: AddDonationView = this;
            self._place = place;
        }

        public getPlace(): Place {
            var self: AddDonationView = this;
            return self._place;
        }

        public render(args?: any): any {
            if (this.bRendered) {
                this.update(args);
                return;
            }
            this.bRendered = true;
            /////
            var self: AddDonationView = this;
            if (self.bDebug) console.log(AddDonationView.TAG + "render()");

            var template = _.template(Template.getManageDonationViewTemplate());
            var data = {
                placename: self._place.getName(),
                placeid: self._place.getId(),
            }
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-manage-donation'));
            self.renderTrees();
            self.renderNewDonation();

            self.setVisible();
            self.resize();
            return self;
        }

        

        public addNewDonation(tree: Tree) {
            var self: AddDonationView = this;
            if (self._donation.getTreeIds().length == 0) {
                self._donation.addTreeId(tree.getId());
            } else {
                var firstTreeId = Math.floor(self._donation.getTreeIds()[0]);
                var firstTree: Tree = Model.getTrees().findWhere({ id: firstTreeId });
                var firstFood: Food = Model.getFoods().findWhere({ id: firstTree.getFoodId() });
                var currentFood: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                if (firstFood.getId() == currentFood.getId()) {
                    self._donation.addTreeId(tree.getId());
                } else {
                    new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: "Please select <strong>same type</strong> of food.", undoable: false }).execute();
                }
            }
            
            var template = _.template(Template.getAddNewDonationTreeTemplate());
            self.$('.new-donation-trees').html(template({
                trees: Model.getTrees().filterByIds(self._donation.getTreeIds()),
            }));
        }

        private _addNewDonation(event: Event) {
            var self: AddDonationView = this;
            self.addNewDonation(Model.getTrees().findWhere({ id: self._selectedMarker.options.id }));
        }

        public removeNewDonation(donation: Donation) {
            var self: AddDonationView = this;
            //self._donations.remove(donation);
        }

        public renderNewDonation = () => {
            var self: AddDonationView = this;
            if (self._donation == undefined) {
                self._donation = new Donation({ type: 0, place: self._place.getId(), quantity: 0, picture: '', date: moment(new Date()).format(Setting.getDateTimeFormat()) });
            }

            var tag = '';
            tag += '<div class="label-group">';
            tag += '<div class="label-group-label">Trees</div>';
            tag += '<div class="label-group-content new-donation-trees"></div>';
            tag += '</div>';

            tag += '<div class="label-group">';
            tag += '<div class="label-group-label">Amount</div>';
            tag += '<div class="label-group-content new-donation-amount"><%= amount %> lbs.</div>';
            tag += '</div>';

            tag += '<div class="label-group">';
            tag += '<div class="label-group-label">Donation Date</div>';
            tag += '<div class="label-group-content new-donation-date"></div>';
            tag += '</div>';
            var template = _.template(tag);
            var data = {
                amount: self._donation.getQuantity(),
            }
            self.$('.new-donation').html(template(data));

            self.$('.new-donation-date').html(self._donation.getFormattedDate());
            self.$('.new-donation-date').attr({ 'data-value': moment(self._donation.getDateForDatePicker()).format(FoodParent.Setting.getDateFormat()) });
            self.$('.new-donation-date').pickadate({
                format: "dd mmm yyyy",
                today: '',
                max: new Date(moment(new Date()).valueOf()),
                clear: '',
                close: 'Close',
                onClose: function () {
                    self._donation.setDate(moment(this.get()).startOf('day').format(FoodParent.Setting.getDateTimeFormat()));
                    self.renderNewDonation();
                    //self._startDate = ;
                    //self.renderTreeChart(self._tree, self._startDate, self._endDate);
                }
            });

            self.$('.new-donation-amount').on('click', function (event) {
                $(this).replaceWith("<input class='new-donation-amount form-control' value='" + parseFloat($(this).html()) + "' />");
                //self.$('.input-lat').css({ width: width });
                self.$('.new-donation-amount').focus();
                self.$('.new-donation-amount').on('focusout', function (event) {
                    self._donation.setQuantity(parseFloat(self.$('.new-donation-amount').val()));
                    self.renderNewDonation();
                    /*
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
                    */
                    //} else {
                    //    
                    //}
                });
            });

            // Event listener for uploading a file.
            self.$('input[type=file]').off('change');
            self.$('input[type=file]').on('change', function (event: Event) {
                self.$('.wrapper-input-upload-picture').addClass('hidden');
                self.$('.wrapper-uploading-picture').removeClass('hidden');
                var files = (<any>event.target).files;
                if (files.length > 0) {
                    Controller.uploadNotePictureFile(files[0], fileNameEncode(self._place.getName()), function (fileName: string) {
                        self._donation.addPicture(fileName);
                        // Success
                        self.$('input[type=file]').val("");
                        self.$('.wrapper-uploading-picture').addClass('hidden');
                        self.$('.wrapper-input-upload-picture').removeClass('hidden');
                        self.renderDonationImages();
                    }, function () {
                        // Error
                        self.$('.wrapper-uploading-picture').addClass('hidden');
                        self.$('.wrapper-input-upload-picture').removeClass('hidden');
                    });
                }
            });

            var template = _.template(Template.getAddNewDonationTreeTemplate());
            self.$('.new-donation-trees').html(template({
                trees: Model.getTrees().filterByIds(self._donation.getTreeIds()),
            }));

            self.$('.content-manage-adoption-table').scrollTop();
        }


        public renderDonationImages() {
            var self: AddDonationView = this;
            var tag = '';
            $.each(self._donation.getPictures(), function (index: number, filename: string) {
                if (index == 0) {
                    tag += '<img src="' + Setting.getBlankImagePath() + '" data-target="' + index + '" class="selected" />';
                } else {
                    tag += '<img src="' + Setting.getBlankImagePath() + '" data-target="' + index + '" />';
                }
            });
            self.$('.image-group').html(tag);
            $.each(self.$('.image-group img'), function (index: number, element: JQuery) {
                $(element).attr('src', Setting.getContentPictureDir() + self._donation.getPictures()[index]).load(function () {

                }).error(function () {
                    $(element).attr('src', Setting.getBlankImagePath());
                });
            });
        }

        private _selectCoverImage(event: Event) {
            var self: AddDonationView = this;
            $.each(self.$('.image-group img'), function (index: number, element: JQuery) {
                $(element).removeClass('selected');
            });
            $(event.target).addClass('selected');
            self._donation.setCover(parseInt($(event.target).attr('data-target')));
            self.renderDonationImages();
        }

        private renderTrees = () => {
            var self: AddDonationView = this;
            Controller.fetchAllTrees(function () {
                self.renderTreeList(Model.getTrees());
                self.renderFilterList();
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }

        public renderTreeList = (trees: Trees) => {
            var self: AddDonationView = this;
            if (self._bTableView) {
                var optionValues = new Array<{ name: string, values: any }>();
                optionValues.push({ name: "Food", values: Model.getFoods().toArray() });
                DonationColumn[0].cell = Backgrid.SelectCell.extend({
                    editor: Backgrid.FoodSelectCellEditor,
                    optionValues: optionValues,
                });

                var grid = new Backgrid.Grid({
                    columns: DonationColumn,
                    collection: trees,
                    emptyText: Setting.getNoDataText(),
                });
                grid.render();
                grid.sort("id", "ascending");
                self.$(".list-donation").html(grid.el);
            } else {
                Controller.updateGeoLocation(self.renderMap, self.renderMapError);
            }
        }

        private renderMapError = (error: PositionError) => {
            var self: AddDonationView = this;
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
            var self: AddDonationView = this;
            var accuracy = position.coords.accuracy;
            self._location = new L.LatLng(position.coords.latitude, position.coords.longitude);
            if (self._map == undefined) {
                self.setLocation(new L.LatLng(position.coords.latitude, position.coords.longitude));
                self._map = L.map(self.$('#list-donation')[0].id, {
                    zoomControl: false,
                    closePopupOnClick: true,
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
                self._map.whenReady(self.renderMarkers);
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
                    self._selectedMarker = marker;
                    self.renderTreeInfo(tree);
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

        private renderTreeInfo(tree: Tree): void {
            var self: AddDonationView = this;
            var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });

            var template = _.template(Template.getTreeInfoTemplate3());
            var data = {
                foodname: food.getName(),
                treename: tree.getName(),
                lat: tree.getLat().toFixed(4),
                lng: tree.getLng().toFixed(4),
                description: tree.getDescription(),
                persons: tree.getParents(),
            }
            self.$('#wrapper-treeinfo').html(template(data));
            self.$('#wrapper-treeinfo').removeClass('hidden');

            if (tree.getAddress().trim() == '') {
                GeoLocation.reverseGeocoding(tree.getLocation(), function (data: ReverseGeoLocation) {
                    self.$(".input-address").html(data.road + ", " + data.county + ", " + data.state + ", " + data.country + ", " + data.postcode);
                }, function () {
                    EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            } else {
                self.$(".input-address").html(tree.getAddress());
            }

            self.renderRecentActivities(tree);
            
        }

        private renderRecentActivities(tree: Tree): void {
            var self: AddDonationView = this;
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

        private renderMarkers = () => {
            var self: AddDonationView = this;
            console.log(AddDonationView.TAG + "renderMarkers()");
            self._markers = new Array<L.Marker>();
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

            /*
            if (self._id != undefined && self._id != 0) {
                for (var j = 0; j < self._markers.length; j++) {
                    if (self._markers[j].options.id == self._id) {
                        self._markers[j].openPopup();
                        self._map.setView(self._markers[j].getLatLng());
                        break;
                    }
                }
            }
            */
            var trees: Trees = Model.getTrees();
            // Apply food filtering
            var foodIds = new Array<number>();
            $.each(self.$('.filter-food input'), function (index: number, item: JQuery) {
                if ($(item).prop('checked') == true) {
                    foodIds.push(Math.floor($(item).prop('name')));
                }
            });

            trees = trees.filterByFoodIds(foodIds);
            // Apply adopt filtering
            var adoptIds = new Array<number>();
            $.each(self.$('.filter-adopt input'), function (index: number, item: JQuery) {
                if ($(item).prop('checked') == true) {
                    adoptIds.push(Math.floor($(item).prop('name')));
                }
            });

            trees = trees.filterByAdoptStatus(adoptIds);
            self.updateMarkers(trees);


            // render tree info
            self.$('.leaflet-top.leaflet-right').html('<div id="wrapper-treeinfo"></div>');
        }

        private updateMarkers = (trees: Trees) => {
            var self: AddDonationView = this;
            console.log(AddDonationView.TAG + "updateMarkers()");
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
            var self: AddDonationView = this;
            self._map.removeLayer(marker);
        }

        private addMarker(tree: Tree): void {
            var self: AddDonationView = this;
            var marker: L.Marker = MarkerFractory.create2(tree, true);
            self._markers.push(marker);
            marker.addTo(self._map);
        }

        public setLocation(location: L.LatLng): void {
            var self: AddDonationView = this;
            self._location = location;
        }

        private afterMoveMap = () => {
            var self: AddDonationView = this;
            if (self._selectedMarker) {
                self._selectedMarker._bringToFront();
            }
        }

        public renderFilterList = () => {
            var self: AddDonationView = this;
            Controller.checkAdmin(function (response) {
                if (response.result == "true") {
                    var template = _.template(Template.getTreeFilterListTemplate());
                    var data = {
                        foods: Model.getFoods(),
                        userid: parseInt(response.id),
                        flags: Model.getFlags(),
                        ownerships: Model.getOwnerships(),
                    }
                    self.$('#filter-list').html(template(data));
                }
            }, function (response) {

            });
            
        }

        public update(args?: any): any {
            if (!this.bRendered) {
                this.render(args);
                return;
            }
            /////
            var self: AddDonationView = this;
            if (self.bDebug) console.log(AddDonationView.TAG + "update()");
            return self;
        }

        public resize(): any {
            var self: AddDonationView = this;
            $('#content-manage-adoption-table').css({ width: self.getWidth() - $('#wrapper-tablemenu').outerWidth() });
            $('#wrapper-main').css({ height: View.getHeight() - 60 });
            $('#wrapper-mtrees').css({ height: View.getHeight() - 60 });
            $('.collapsible-list').css({ height: self.getHeight() - 34 * 3 - 30 });
            //$('.image-group').css({ height: self.$('.image-wrapper').innerHeight() - 60 });
        }

        public setVisible(): void {
            var self: AddDonationView = this;
            Setting.getPopWrapperElement().removeClass('hidden');
        }
        public setInvisible(): void {
            var self: AddDonationView = this;
            Setting.getPopWrapperElement().addClass('hidden');
        }

        public _applyFilter(event?: Event): void {
            var self: AddDonationView = this;
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
                if (self._bTableView) {
                    // update markers
                    self.renderTreeList(trees);
                } else {
                    // update markers
                    self.updateMarkers(trees);
                }
            }, 1);
        }

        public _submitDonations(event: Event): void {
            var self: AddDonationView = this;
            if (self._donation.getTreeIds().length == 0 || self._donation.getQuantity() == 0) {
                new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: "Please select at least <strong>one tree</strong> with proper <strong>amount</strong> for donation.", undoable: false }).execute();
            } else {
                var treeIds = self._donation.getTreeIds();
                var tree: Tree = Model.getTrees().findWhere({ id: treeIds[0] });
                self._donation.setType(tree.getFoodId());
                EventHandler.handleDonationData(self._donation, DATA_MODE.CREATE, {}, function () {
                    EventHandler.handleDataChange("Donation for <strong><i>" + self._place.getName() + "</i></strong> has been added successfully.", true);
                    self._donation = null;
                    self.renderNewDonation();
                    self.$('.image-group').html("");
                }, function () {
                    EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
                
            }
        }

        private _mouseClick(event: Event): void {
            var self: AddDonationView = this;
            EventHandler.handleMouseClick($(event.currentTarget), self);
        }

        private _removeNewDonationTree(event: Event): void {
            var self: AddDonationView = this;
            var treeId: number = parseInt($(event.target).attr('data-target'));
            self._donation.removeTreeId(treeId);
            var template = _.template(Template.getAddNewDonationTreeTemplate());
            self.$('.new-donation-trees').html(template({
                trees: Model.getTrees().filterByIds(self._donation.getTreeIds()),
            }));
        }

        private _switchView(event: Event): void {
            var self: AddDonationView = this;
            if (self._bTableView) {
                self._bTableView = false;
                $(event.target).html("Switch to Table View");
            } else {
                self._bTableView = true;
                $(event.target).html("Switch to Map View");
                self._map.remove();
                self._map = null;
            }
            self.$('#list-donation').html("");
            self.renderTreeList(Model.getTrees());

            var trees: Trees = Model.getTrees();
            // Apply food filtering
            var foodIds = new Array<number>();
            $.each(self.$('.filter-food input'), function (index: number, item: JQuery) {
                if ($(item).prop('checked') == true) {
                    foodIds.push(Math.floor($(item).prop('name')));
                }
            });

            trees = trees.filterByFoodIds(foodIds);
            // Apply adopt filtering
            var adoptIds = new Array<number>();
            $.each(self.$('.filter-adopt input'), function (index: number, item: JQuery) {
                if ($(item).prop('checked') == true) {
                    adoptIds.push(Math.floor($(item).prop('name')));
                }
            });

            trees = trees.filterByAdoptStatus(adoptIds);
            if (self._bTableView) {
                // update markers
                self.renderTreeList(trees);
            } else {
                // update markers
                //self.updateMarkers(trees);
            }
        }
    }
}