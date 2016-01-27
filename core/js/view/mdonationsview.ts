declare var LocationColumn;
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

    export class DonationManageViewFactory {
        private static _instance: DonationManageViewFactory = new DonationManageViewFactory();
        private baseUrl: string;
        constructor(args?: any) {
            if (DonationManageViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use DonationManageViewFactory.getInstance() instead of new.");
            }
            DonationManageViewFactory._instance = this;
        }
        public static getInstance(): DonationManageViewFactory {
            return DonationManageViewFactory._instance;
        }
        public static create(el: JQuery, place: Place): DonationManageView {
            var view: DonationManageView = new DonationManageView({ el: el });
            console.log(place);
            view.setPlace(place);
            return view;
        }
    }

    export class DonationManageView extends PopupView {
        private static TAG: string = "DonationManageView - ";
        private _place: Place;
        private _donation: Donation;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: DonationManageView = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = <any>{
                "click .confirm-confirm": "_executeCommand",
                "click .confirm-cancel": "_mouseClick",
                "click .button-close": "_mouseClick",
                "click .filter-checkbox": "_applyFilter",
                "click .button-submit-donation": "_submitDonations",
                "click .cell-tree-detail": "_removeNewDonationTree"
            };
            self.delegateEvents();
        }
        public setPlace(place: Place): void {
            var self: DonationManageView = this;
            self._place = place;
        }

        public getPlace(): Place {
            var self: DonationManageView = this;
            return self._place;
        }

        public render(args?: any): any {
            if (this.bRendered) {
                this.update(args);
                return;
            }
            this.bRendered = true;
            /////
            var self: DonationManageView = this;
            if (self.bDebug) console.log(DonationManageView.TAG + "render()");

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
            var self: DonationManageView = this;
            self._donation.addTreeId(tree.getId());
            var template = _.template(Template.getAddNewDonationTreeTemplate());
            self.$('.new-donation-trees').html(template({
                trees: Model.getTrees().filterByIds(self._donation.getTreeIds()),
            }));
        }

        public removeNewDonation(donation: Donation) {
            var self: DonationManageView = this;
            //self._donations.remove(donation);
        }

        public renderNewDonation = () => {
            var self: DonationManageView = this;
            if (self._donation == undefined) {
                self._donation = new Donation({ place: self._place.getId(), quantity: 0, date: moment(new Date()).format(Setting.getDateTimeFormat()) });
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

            var template = _.template(Template.getAddNewDonationTreeTemplate());
            self.$('.new-donation-trees').html(template({
                trees: Model.getTrees().filterByIds(self._donation.getTreeIds()),
            }));
            /*
            var grid = new Backgrid.Grid({
                columns: NewDonationColumn,
                collection: self._donations,
                emptyText: Setting.getNoDataText(),
            });
            grid.render();
            self.$(".new-donation").html(grid.el);
            */
            /*
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
            //self.$(".new-donation").html('<div class="list-title">Add a New Tree</div>');
            self.$(".new-donation").html(grid.el);
            //self.$(".new-donation").removeClass('hidden');
            */
        }

        private renderTrees = () => {
            var self: DonationManageView = this;
            Controller.fetchAllTrees(function () {
                // add grid instance for existing data
                self.renderTreeList(Model.getTrees());
                self.renderFilterList();
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }

        public renderTreeList = (trees: Trees) => {
            var self: DonationManageView = this;
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
        }

        public renderFilterList = () => {
            var self: DonationManageView = this;
            var template = _.template(Template.getTreeFilterListTemplate());
            var data = {
                foods: Model.getFoods(),
            }
            self.$('#filter-list').html(template(data));
        }

        public update(args?: any): any {
            if (!this.bRendered) {
                this.render(args);
                return;
            }
            /////
            var self: DonationManageView = this;
            if (self.bDebug) console.log(DonationManageView.TAG + "update()");
            return self;
        }

        public resize(): any {
            var self: DonationManageView = this;
            $('#content-manage-adoption-table').css({ width: self.getWidth() - $('#wrapper-tablemenu').outerWidth() });
            $('#wrapper-main').css({ height: View.getHeight() - 60 });
            $('#wrapper-mtrees').css({ height: View.getHeight() - 60 });
            $('.collapsible-list').css({ height: self.getHeight() - 34 * 2 - 30 });
        }

        public setVisible(): void {
            var self: DonationManageView = this;
            Setting.getPopWrapperElement().removeClass('hidden');
        }
        public setInvisible(): void {
            var self: DonationManageView = this;
            Setting.getPopWrapperElement().addClass('hidden');
        }

        public _applyFilter(event?: Event): void {
            var self: DonationManageView = this;
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

        public _submitDonations(event: Event): void {
            var self: DonationManageView = this;
            if (self._donation.getTreeIds().length == 0) {
                
            } else {
                EventHandler.handleDonationData(self._donation, DATA_MODE.CREATE, {}, function () {
                    EventHandler.handleDataChange("Donation for <strong><i>" + self._place.getName() + "</i></strong> has been added successfully.", true);
                    self._donation = null;
                    self.renderNewDonation();
                }, function () {
                    EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
                
            }
        }

        private _mouseClick(event: Event): void {
            var self: DonationManageView = this;
            EventHandler.handleMouseClick($(event.currentTarget), self);
        }

        private _removeNewDonationTree(event: Event): void {
            var self: DonationManageView = this;
            var treeId: number = parseInt($(event.target).attr('data-target'));
            self._donation.removeTreeId(treeId);
            var template = _.template(Template.getAddNewDonationTreeTemplate());
            self.$('.new-donation-trees').html(template({
                trees: Model.getTrees().filterByIds(self._donation.getTreeIds()),
            }));
        }
    }
}