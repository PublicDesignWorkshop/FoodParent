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
                    ownerships: FoodParent.Model.getOwnerships(),
                };
                self.$('.tree-filter').html(template(data));
            };
            this.renderParentsList = function (parents) {
                var self = _this;
                var grid = new Backgrid.Grid({
                    columns: AdoptionColumn,
                    collection: parents,
                    emptyText: FoodParent.Setting.getNoDataText(),
                });
                grid.render();
                grid.sort("name", "ascending");
                self.$(".list-adoption").html(grid.el);
            };
            var self = this;
            self.bDebug = true;
            self.events = {
                "click .evt-close": "_mouseClick",
                "click .btn-filter": "_clickFilter",
                "click .evt-reset-filter": "_resetFilter",
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
            // Parenting filter
            if ($(event.currentTarget).hasClass('filter-parenting-item')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                }
                else {
                    $(event.currentTarget).addClass('active');
                }
                if (self.$('.filter-parenting-item').length == self.$('.filter-parenting-item.active').length) {
                    self.$('.filter-parenting-all').addClass('active');
                }
                else {
                    self.$('.filter-parenting-all').removeClass('active');
                }
            }
            if ($(event.currentTarget).hasClass('filter-parenting-all')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                    self.$('.filter-parenting-item').removeClass('active');
                }
                else {
                    $(event.currentTarget).addClass('active');
                    self.$('.filter-parenting-item').addClass('active');
                }
            }
            // Authorization filter
            if ($(event.currentTarget).hasClass('filter-auth-item')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                }
                else {
                    $(event.currentTarget).addClass('active');
                }
                if (self.$('.filter-auth-item').length == self.$('.filter-auth-item.active').length) {
                    self.$('.filter-auth-all').addClass('active');
                }
                else {
                    self.$('.filter-auth-all').removeClass('active');
                }
            }
            if ($(event.currentTarget).hasClass('filter-auth-all')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                    self.$('.filter-auth-item').removeClass('active');
                }
                else {
                    $(event.currentTarget).addClass('active');
                    self.$('.filter-auth-item').addClass('active');
                }
            }
            // Apply filter
            self._applyFilter();
        };
        TreesTableView.prototype._resetFilter = function (event) {
            var self = this;
            // Set the status of right corner button based on filter on / off status
            self.$('.filter-parenting-all').addClass('active');
            self.$('.filter-auth-all').addClass('active');
            self.$('.filter-parenting-item').removeClass('active');
            self.$('.filter-auth-item').removeClass('active');
            // Apply filter
            self._applyFilter();
        };
        TreesTableView.prototype._applyFilter = function (event) {
            var self = this;
            var persons = FoodParent.Model.getPersons();
            // Apply parenting filtering
            var adoptIds = new Array();
            if (self.$('.filter-parenting-all').hasClass('active')) {
                $.each(self.$('.filter-parenting-item'), function (index, element) {
                    adoptIds.push(parseInt($(element).attr('data-id')));
                });
            }
            else {
                $.each(self.$('.filter-parenting-item'), function (index, element) {
                    if ($(element).hasClass('active')) {
                        adoptIds.push(parseInt($(element).attr('data-id')));
                    }
                });
            }
            persons = persons.filterByAdoptStatusForTree(adoptIds, self._tree.getId());
            // Apply authorization filtering
            var authIds = new Array();
            if (self.$('.filter-auth-all').hasClass('active')) {
                $.each(self.$('.filter-auth-item'), function (index, element) {
                    authIds.push(parseInt($(element).attr('data-id')));
                });
            }
            else {
                $.each(self.$('.filter-auth-item'), function (index, element) {
                    if ($(element).hasClass('active')) {
                        authIds.push(parseInt($(element).attr('data-id')));
                    }
                });
            }
            persons = persons.filterByAuthIds(authIds);
            // update markers
            self.renderParentsList(persons);
        };
        TreesTableView.TAG = "TreesTableView - ";
        return TreesTableView;
    })(FoodParent.PopupView);
    FoodParent.TreesTableView = TreesTableView;
})(FoodParent || (FoodParent = {}));
