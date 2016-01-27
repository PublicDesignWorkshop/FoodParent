var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var ManageDonationsViewFractory = (function () {
        function ManageDonationsViewFractory(args) {
            if (ManageDonationsViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use ManageDonationsViewFractory.getInstance() instead of new.");
            }
            ManageDonationsViewFractory._instance = this;
        }
        ManageDonationsViewFractory.getInstance = function () {
            return ManageDonationsViewFractory._instance;
        };
        ManageDonationsViewFractory.create = function (el, viewMode, id) {
            var view;
            if (viewMode == FoodParent.VIEW_MODE.MAP) {
            }
            else if (viewMode == FoodParent.VIEW_MODE.TABLE) {
                view = new ManageDonationsTableView({ el: el });
                view.setTreeId(id);
            }
            return view;
        };
        ManageDonationsViewFractory._instance = new ManageDonationsViewFractory();
        return ManageDonationsViewFractory;
    })();
    FoodParent.ManageDonationsViewFractory = ManageDonationsViewFractory;
    var ManageDonationsView = (function (_super) {
        __extends(ManageDonationsView, _super);
        function ManageDonationsView() {
            _super.apply(this, arguments);
            this.renderTreeInfo = function (tree) {
            };
        }
        ManageDonationsView.prototype.setTreeId = function (id) {
            this._id = id;
        };
        return ManageDonationsView;
    })(FoodParent.BaseView);
    FoodParent.ManageDonationsView = ManageDonationsView;
    var ManageDonationsTableView = (function (_super) {
        __extends(ManageDonationsTableView, _super);
        function ManageDonationsTableView(options) {
            var _this = this;
            _super.call(this, options);
            this.renderLocations = function () {
                var self = _this;
                FoodParent.Controller.fetchAllLocations(function () {
                    // add grid instance for existing data
                    self.renderLocationList(FoodParent.Model.getPlaces());
                    //self.renderFilterList();
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            };
            this.renderLocationList = function (places) {
                var self = _this;
                var grid = new Backgrid.Grid({
                    columns: LocationColumn,
                    collection: places,
                    emptyText: FoodParent.Setting.getNoDataText(),
                });
                grid.render();
                grid.sort("name", "ascending");
                self.$(".list-location").html(grid.el);
            };
            var self = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = {
                "click .switch-map": "_mouseClick",
                "click .filter-checkbox": "_applyFilter",
                "click .add-tree": "_addNewTree",
            };
            self.delegateEvents();
        }
        ManageDonationsTableView.prototype.render = function (args) {
            if (this.bRendered) {
                this.update(args);
                return self;
            }
            this.bRendered = true;
            var self = this;
            if (self.bDebug)
                console.log(ManageDonationsTableView.TAG + "render()");
            var template = _.template(FoodParent.Template.getManageDonationsTableViewTemplate());
            var data = {};
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-mdonations'));
            self.renderLocations();
            self.resize();
            return self;
        };
        ManageDonationsTableView.prototype.resize = function () {
            $('#content-donations-table').css({ width: FoodParent.View.getWidth() - $('#wrapper-tablemenu').outerWidth() });
            $('#wrapper-main').css({ height: FoodParent.View.getHeight() - 60 });
            $('#wrapper-mtrees').css({ height: FoodParent.View.getHeight() - 60 });
            $('.collapsible-list').css({ height: FoodParent.View.getHeight() - 60 - 34 * 3 - 20 });
        };
        ManageDonationsTableView.TAG = "ManageDonationsTableView - ";
        return ManageDonationsTableView;
    })(ManageDonationsView);
    FoodParent.ManageDonationsTableView = ManageDonationsTableView;
    var DonationManageViewFactory = (function () {
        function DonationManageViewFactory(args) {
            if (DonationManageViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use DonationManageViewFactory.getInstance() instead of new.");
            }
            DonationManageViewFactory._instance = this;
        }
        DonationManageViewFactory.getInstance = function () {
            return DonationManageViewFactory._instance;
        };
        DonationManageViewFactory.create = function (el, place) {
            var view = new DonationManageView({ el: el });
            console.log(place);
            view.setPlace(place);
            return view;
        };
        DonationManageViewFactory._instance = new DonationManageViewFactory();
        return DonationManageViewFactory;
    })();
    FoodParent.DonationManageViewFactory = DonationManageViewFactory;
    var DonationManageView = (function (_super) {
        __extends(DonationManageView, _super);
        function DonationManageView(options) {
            var _this = this;
            _super.call(this, options);
            this.renderNewDonation = function () {
                var self = _this;
                if (self._donation == undefined) {
                    self._donation = new FoodParent.Donation({ place: self._place.getId(), quantity: 0, date: moment(new Date()).format(FoodParent.Setting.getDateTimeFormat()) });
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
                };
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
                var template = _.template(FoodParent.Template.getAddNewDonationTreeTemplate());
                self.$('.new-donation-trees').html(template({
                    trees: FoodParent.Model.getTrees().filterByIds(self._donation.getTreeIds()),
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
            };
            this.renderTrees = function () {
                var self = _this;
                FoodParent.Controller.fetchAllTrees(function () {
                    // add grid instance for existing data
                    self.renderTreeList(FoodParent.Model.getTrees());
                    self.renderFilterList();
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            };
            this.renderTreeList = function (trees) {
                var self = _this;
                var optionValues = new Array();
                optionValues.push({ name: "Food", values: FoodParent.Model.getFoods().toArray() });
                DonationColumn[0].cell = Backgrid.SelectCell.extend({
                    editor: Backgrid.FoodSelectCellEditor,
                    optionValues: optionValues,
                });
                var grid = new Backgrid.Grid({
                    columns: DonationColumn,
                    collection: trees,
                    emptyText: FoodParent.Setting.getNoDataText(),
                });
                grid.render();
                grid.sort("id", "ascending");
                self.$(".list-donation").html(grid.el);
            };
            this.renderFilterList = function () {
                var self = _this;
                var template = _.template(FoodParent.Template.getTreeFilterListTemplate());
                var data = {
                    foods: FoodParent.Model.getFoods(),
                };
                self.$('#filter-list').html(template(data));
            };
            var self = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = {
                "click .confirm-confirm": "_executeCommand",
                "click .confirm-cancel": "_mouseClick",
                "click .button-close": "_mouseClick",
                "click .filter-checkbox": "_applyFilter",
                "click .button-submit-donation": "_submitDonations",
                "click .cell-tree-detail": "_removeNewDonationTree"
            };
            self.delegateEvents();
        }
        DonationManageView.prototype.setPlace = function (place) {
            var self = this;
            self._place = place;
        };
        DonationManageView.prototype.getPlace = function () {
            var self = this;
            return self._place;
        };
        DonationManageView.prototype.render = function (args) {
            if (this.bRendered) {
                this.update(args);
                return;
            }
            this.bRendered = true;
            /////
            var self = this;
            if (self.bDebug)
                console.log(DonationManageView.TAG + "render()");
            var template = _.template(FoodParent.Template.getManageDonationViewTemplate());
            var data = {
                placename: self._place.getName(),
                placeid: self._place.getId(),
            };
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-manage-donation'));
            self.renderTrees();
            self.renderNewDonation();
            self.setVisible();
            self.resize();
            return self;
        };
        DonationManageView.prototype.addNewDonation = function (tree) {
            var self = this;
            self._donation.addTreeId(tree.getId());
            var template = _.template(FoodParent.Template.getAddNewDonationTreeTemplate());
            self.$('.new-donation-trees').html(template({
                trees: FoodParent.Model.getTrees().filterByIds(self._donation.getTreeIds()),
            }));
        };
        DonationManageView.prototype.removeNewDonation = function (donation) {
            var self = this;
            //self._donations.remove(donation);
        };
        DonationManageView.prototype.update = function (args) {
            if (!this.bRendered) {
                this.render(args);
                return;
            }
            /////
            var self = this;
            if (self.bDebug)
                console.log(DonationManageView.TAG + "update()");
            return self;
        };
        DonationManageView.prototype.resize = function () {
            var self = this;
            $('#content-manage-adoption-table').css({ width: self.getWidth() - $('#wrapper-tablemenu').outerWidth() });
            $('#wrapper-main').css({ height: FoodParent.View.getHeight() - 60 });
            $('#wrapper-mtrees').css({ height: FoodParent.View.getHeight() - 60 });
            $('.collapsible-list').css({ height: self.getHeight() - 34 * 2 - 30 });
        };
        DonationManageView.prototype.setVisible = function () {
            var self = this;
            FoodParent.Setting.getPopWrapperElement().removeClass('hidden');
        };
        DonationManageView.prototype.setInvisible = function () {
            var self = this;
            FoodParent.Setting.getPopWrapperElement().addClass('hidden');
        };
        DonationManageView.prototype._applyFilter = function (event) {
            var self = this;
            var trees = FoodParent.Model.getTrees();
            setTimeout(function () {
                // Filtering food type.
                if (event != undefined) {
                    if ($(event.target).find('input').prop('name') == 'foodsall') {
                        if ($(event.target).find('input').prop('checked') == true) {
                            $('.filter-food').addClass('active');
                            $('.filter-food input').prop({ 'checked': 'checked' });
                        }
                        else {
                            $('.filter-food').removeClass('active');
                            $('.filter-food input').prop({ 'checked': '' });
                        }
                    }
                }
                // Apply food filtering
                var foodIds = new Array();
                $.each(self.$('.filter-food input'), function (index, item) {
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
                        }
                        else {
                            $('.filter-adopt').removeClass('active');
                            $('.filter-adopt input').prop({ 'checked': '' });
                        }
                    }
                }
                // Apply adopt filtering
                var adoptIds = new Array();
                $.each(self.$('.filter-adopt input'), function (index, item) {
                    if ($(item).prop('checked') == true) {
                        adoptIds.push(Math.floor($(item).prop('name')));
                    }
                });
                trees = trees.filterByAdoptStatus(adoptIds);
                // update markers
                self.renderTreeList(trees);
            }, 1);
        };
        DonationManageView.prototype._submitDonations = function (event) {
            var self = this;
            if (self._donation.getTreeIds().length == 0) {
            }
            else {
            }
        };
        DonationManageView.prototype._mouseClick = function (event) {
            var self = this;
            FoodParent.EventHandler.handleMouseClick($(event.currentTarget), self);
        };
        DonationManageView.prototype._removeNewDonationTree = function (event) {
            var self = this;
            var treeId = parseInt($(event.target).attr('data-target'));
            self._donation.removeTreeId(treeId);
            var template = _.template(FoodParent.Template.getAddNewDonationTreeTemplate());
            self.$('.new-donation-trees').html(template({
                trees: FoodParent.Model.getTrees().filterByIds(self._donation.getTreeIds()),
            }));
        };
        DonationManageView.TAG = "DonationManageView - ";
        return DonationManageView;
    })(FoodParent.PopupView);
    FoodParent.DonationManageView = DonationManageView;
})(FoodParent || (FoodParent = {}));
