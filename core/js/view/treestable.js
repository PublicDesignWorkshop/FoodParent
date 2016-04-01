var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var TreesTableViewFactory = (function () {
        function TreesTableViewFactory(args) {
            if (TreesTableViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use TreesTableViewFactory.getInstance() instead of new.");
            }
            TreesTableViewFactory._instance = this;
        }
        TreesTableViewFactory.getInstance = function () {
            return TreesTableViewFactory._instance;
        };
        TreesTableViewFactory.create = function (el) {
            var view = new TreesTableView({ el: el });
            return view;
        };
        TreesTableViewFactory._instance = new TreesTableViewFactory();
        return TreesTableViewFactory;
    })();
    FoodParent.TreesTableViewFactory = TreesTableViewFactory;
    var TreesTableView = (function (_super) {
        __extends(TreesTableView, _super);
        function TreesTableView(options) {
            var _this = this;
            _super.call(this, options);
            this.renderTrees = function () {
                var self = _this;
                FoodParent.Controller.fetchAllTrees(function () {
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
                TreeColumn[0].cell = Backgrid.SelectCell.extend({
                    editor: Backgrid.FoodSelectCellEditor,
                    optionValues: optionValues,
                });
                var grid = new Backgrid.Grid({
                    columns: TreeColumn,
                    collection: trees,
                    emptyText: FoodParent.Setting.getNoDataText(),
                });
                grid.render();
                grid.sort("id", "ascending");
                self.$(".list-tree").html(grid.el);
            };
            this.renderFilterList = function () {
                var self = _this;
                var template = _.template(FoodParent.Template.getTreesFilterListTemplateForAdmin());
                var data = {
                    header: "Filter List",
                    flags: FoodParent.Model.getFlags(),
                };
                self.$('.tree-filter').html(template(data));
                // Apply filter
                self._applyFilter();
            };
            this._addTree = function () {
                var self = _this;
                if (self.$(".new-tree").hasClass('hidden')) {
                    FoodParent.Controller.updateGeoLocation(self.renderNewTree, self.renderGeoLocationError);
                }
                else {
                    self.$(".new-tree").addClass('hidden');
                }
            };
            this.renderNewTree = function (position) {
                var self = _this;
                var tree = new FoodParent.Tree({ lat: position.coords.latitude, lng: position.coords.longitude, food: 1, type: 0, flag: 0, owner: 0, ownership: 1, description: "", address: "" });
                var trees = new FoodParent.Trees();
                trees.add(tree);
                var optionValues = new Array();
                optionValues.push({ name: "Food", values: FoodParent.Model.getFoods().toArray() });
                NewTreeColumn[0].cell = Backgrid.SelectCell.extend({
                    editor: Backgrid.FoodSelectCellEditor,
                    optionValues: optionValues,
                });
                var grid = new Backgrid.Grid({
                    columns: NewTreeColumn,
                    collection: trees,
                    emptyText: FoodParent.Setting.getNoDataText(),
                });
                grid.render();
                //grid.sort("name", "ascending");
                self.$(".new-tree").html(grid.el);
                self.$(".new-tree").removeClass('hidden');
            };
            this.renderGeoLocationError = function (error) {
                var self = _this;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.GEO_PERMISSION_ERROR);
                        break;
                    case error.POSITION_UNAVAILABLE:
                        FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.GEO_PERMISSION_ERROR);
                        break;
                    case error.TIMEOUT:
                        break;
                }
            };
            var self = this;
            self.bDebug = true;
            self.events = {
                "click .evt-close": "_mouseClick",
                "click .btn-filter": "_clickFilter",
                "click .evt-reset-filter": "_resetFilter",
                "click .evt-add-tree": "_addTree",
            };
            self.delegateEvents();
        }
        TreesTableView.prototype.render = function (args) {
            _super.prototype.render.call(this, args);
            var self = this;
            if (self.bDebug)
                console.log(TreesTableView.TAG + "render()");
            var template = _.template(FoodParent.Template.getTreesTableViewTemplateForAdmin());
            var data = {
                header: "Tree List",
            };
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-tree-list'));
            self.renderTrees();
            self.setVisible();
            self.resize();
            return self;
        };
        TreesTableView.prototype.update = function (args) {
            _super.prototype.update.call(this, args);
            var self = this;
            if (self.bDebug)
                console.log(TreesTableView.TAG + "update()");
            return self;
        };
        TreesTableView.prototype.resize = function () {
            var self = this;
        };
        TreesTableView.prototype._mouseClick = function (event) {
            var self = this;
            FoodParent.EventHandler.handleMouseClick($(event.currentTarget), self);
        };
        TreesTableView.prototype._clickFilter = function (event) {
            var self = this;
            // Ownership filter
            if ($(event.currentTarget).hasClass('filter-owner-item')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                }
                else {
                    $(event.currentTarget).addClass('active');
                }
                if (self.$('.filter-owner-item').length == self.$('.filter-owner-item.active').length) {
                    self.$('.filter-owner-all').addClass('active');
                }
                else {
                    self.$('.filter-owner-all').removeClass('active');
                }
            }
            if ($(event.currentTarget).hasClass('filter-owner-all')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                    self.$('.filter-owner-item').removeClass('active');
                }
                else {
                    $(event.currentTarget).addClass('active');
                    self.$('.filter-owner-item').addClass('active');
                }
            }
            // Adoption filter
            if ($(event.currentTarget).hasClass('filter-adopt-item')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                }
                else {
                    $(event.currentTarget).addClass('active');
                }
                if (self.$('.filter-adopt-item').length == self.$('.filter-adopt-item.active').length) {
                    self.$('.filter-adopt-all').addClass('active');
                }
                else {
                    self.$('.filter-adopt-all').removeClass('active');
                }
            }
            if ($(event.currentTarget).hasClass('filter-adopt-all')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                    self.$('.filter-adopt-item').removeClass('active');
                }
                else {
                    $(event.currentTarget).addClass('active');
                    self.$('.filter-adopt-item').addClass('active');
                }
            }
            // Status filter
            if ($(event.currentTarget).hasClass('filter-flag-item')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                }
                else {
                    $(event.currentTarget).addClass('active');
                }
                if (self.$('.filter-flag-item').length == self.$('.filter-flag-item.active').length) {
                    self.$('.filter-flag-all').addClass('active');
                }
                else {
                    self.$('.filter-flag-all').removeClass('active');
                }
            }
            if ($(event.currentTarget).hasClass('filter-flag-all')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                    self.$('.filter-flag-item').removeClass('active');
                }
                else {
                    $(event.currentTarget).addClass('active');
                    self.$('.filter-flag-item').addClass('active');
                }
            }
            // Rating filter
            if ($(event.currentTarget).hasClass('filter-rating-item')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                }
                else {
                    $(event.currentTarget).addClass('active');
                }
                if (self.$('.filter-rating-item').length == self.$('.filter-rating-item.active').length) {
                    self.$('.filter-rating-all').addClass('active');
                }
                else {
                    self.$('.filter-rating-all').removeClass('active');
                }
            }
            if ($(event.currentTarget).hasClass('filter-rating-all')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                    self.$('.filter-rating-item').removeClass('active');
                }
                else {
                    $(event.currentTarget).addClass('active');
                    self.$('.filter-rating-item').addClass('active');
                }
            }
            // Last updated filter
            if ($(event.currentTarget).hasClass('filter-last-item')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                }
                else {
                    $(event.currentTarget).addClass('active');
                }
                if (self.$('.filter-last-item').length == self.$('.filter-last-item.active').length) {
                    self.$('.filter-last-all').addClass('active');
                }
                else {
                    self.$('.filter-last-all').removeClass('active');
                }
            }
            if ($(event.currentTarget).hasClass('filter-last-all')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                    self.$('.filter-last-item').removeClass('active');
                }
                else {
                    $(event.currentTarget).addClass('active');
                    self.$('.filter-last-item').addClass('active');
                }
            }
            // Apply filter
            self._applyFilter();
        };
        TreesTableView.prototype._resetFilter = function (event) {
            var self = this;
            // Set the status of right corner button based on filter on / off status
            self.$('.filter-owner-all').addClass('active');
            self.$('.filter-adopt-all').addClass('active');
            self.$('.filter-flag-all').addClass('active');
            self.$('.filter-rating-all').addClass('active');
            self.$('.filter-last-all').addClass('active');
            self.$('.filter-owner-item').removeClass('active');
            self.$('.filter-adopt-item').removeClass('active');
            self.$('.filter-flag-item').removeClass('active');
            self.$('.filter-rating-item').removeClass('active');
            self.$('.filter-last-item').removeClass('active');
            // Apply filter
            self._applyFilter();
        };
        TreesTableView.prototype._applyFilter = function (event) {
            var self = this;
            // Find all trees
            var trees = FoodParent.Model.getTrees();
            // Apply ownership filtering
            var ownershipIds = new Array();
            if (self.$('.filter-owner-all').hasClass('active')) {
                $.each(self.$('.filter-owner-item'), function (index, element) {
                    ownershipIds.push(parseInt($(element).attr('data-id')));
                });
            }
            else {
                $.each(self.$('.filter-owner-item'), function (index, element) {
                    if ($(element).hasClass('active')) {
                        ownershipIds.push(parseInt($(element).attr('data-id')));
                    }
                });
            }
            trees = trees.filterByOwnershipIds(ownershipIds);
            // Apply adoption flitering
            var adoptIds = new Array();
            if (self.$('.filter-adopt-all').hasClass('active')) {
                $.each(self.$('.filter-adopt-item'), function (index, element) {
                    adoptIds.push(parseInt($(element).attr('data-id')));
                });
            }
            else {
                $.each(self.$('.filter-adopt-item'), function (index, element) {
                    if ($(element).hasClass('active')) {
                        adoptIds.push(parseInt($(element).attr('data-id')));
                    }
                });
            }
            trees = trees.filterByAdoptStatus(adoptIds);
            // Apply flag / status flitering
            var flagIds = new Array();
            if (self.$('.filter-flag-all').hasClass('active')) {
                $.each(self.$('.filter-flag-item'), function (index, element) {
                    flagIds.push(parseInt($(element).attr('data-id')));
                });
            }
            else {
                $.each(self.$('.filter-flag-item'), function (index, element) {
                    if ($(element).hasClass('active')) {
                        flagIds.push(parseInt($(element).attr('data-id')));
                    }
                });
            }
            trees = trees.filterByFlagIds(flagIds);
            // update markers
            self.renderTreeList(trees);
        };
        TreesTableView.TAG = "TreesTableView - ";
        return TreesTableView;
    })(FoodParent.PopupView);
    FoodParent.TreesTableView = TreesTableView;
})(FoodParent || (FoodParent = {}));
