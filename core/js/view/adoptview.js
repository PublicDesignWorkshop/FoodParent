var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var AdoptTreeViewFactory = (function () {
        function AdoptTreeViewFactory(args) {
            if (AdoptTreeViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use AdoptTreeViewFactory.getInstance() instead of new.");
            }
            AdoptTreeViewFactory._instance = this;
        }
        AdoptTreeViewFactory.getInstance = function () {
            return AdoptTreeViewFactory._instance;
        };
        AdoptTreeViewFactory.create = function (el, tree) {
            var view = new AdoptTreeView({ el: el });
            view.setTree(tree);
            return view;
        };
        AdoptTreeViewFactory._instance = new AdoptTreeViewFactory();
        return AdoptTreeViewFactory;
    })();
    FoodParent.AdoptTreeViewFactory = AdoptTreeViewFactory;
    var AdoptTreeView = (function (_super) {
        __extends(AdoptTreeView, _super);
        function AdoptTreeView(options) {
            _super.call(this, options);
            var self = this;
            self.bDebug = true;
            self.events = {
                "click .evt-close": "_mouseClick",
                "click .evt-submit": "_mouseClick",
            };
            self.delegateEvents();
        }
        AdoptTreeView.prototype.setTree = function (treeId) {
            var self = this;
            self._tree = FoodParent.Model.getTrees().findWhere({ id: treeId });
        };
        AdoptTreeView.prototype.getTree = function () {
            var self = this;
            return self._tree;
        };
        AdoptTreeView.prototype.render = function (args) {
            _super.prototype.render.call(this, args);
            var self = this;
            if (self.bDebug)
                console.log(AdoptTreeView.TAG + "render()");
            var food = FoodParent.Model.getFoods().findWhere({ id: self._tree.getFoodId() });
            var template = _.template(FoodParent.Template.getAdoptTreeViewTemplate());
            var data = {
                header: "Adopt Tree",
                treename: food.getName() + " " + self._tree.getName(),
            };
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-tree-adopt'));
            self.setVisible();
            self.resize();
            return self;
        };
        AdoptTreeView.prototype.update = function (args) {
            _super.prototype.update.call(this, args);
            var self = this;
            if (self.bDebug)
                console.log(AdoptTreeView.TAG + "update()");
            return self;
        };
        AdoptTreeView.prototype.resize = function () {
            var self = this;
        };
        AdoptTreeView.prototype._mouseClick = function (event) {
            var self = this;
            if (self._tree != undefined) {
                FoodParent.EventHandler.handleMouseClick($(event.currentTarget), self, { tree: self._tree });
            }
            else {
                FoodParent.EventHandler.handleMouseClick($(event.currentTarget), self);
            }
        };
        AdoptTreeView.TAG = "AdoptTreeView - ";
        return AdoptTreeView;
    })(FoodParent.PopupView);
    FoodParent.AdoptTreeView = AdoptTreeView;
    var UnadoptTreeViewFactory = (function () {
        function UnadoptTreeViewFactory(args) {
            if (UnadoptTreeViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use UnadoptTreeViewFactory.getInstance() instead of new.");
            }
            UnadoptTreeViewFactory._instance = this;
        }
        UnadoptTreeViewFactory.getInstance = function () {
            return UnadoptTreeViewFactory._instance;
        };
        UnadoptTreeViewFactory.create = function (el, tree) {
            var view = new UnadoptTreeView({ el: el });
            view.setTree(tree);
            return view;
        };
        UnadoptTreeViewFactory._instance = new UnadoptTreeViewFactory();
        return UnadoptTreeViewFactory;
    })();
    FoodParent.UnadoptTreeViewFactory = UnadoptTreeViewFactory;
    var UnadoptTreeView = (function (_super) {
        __extends(UnadoptTreeView, _super);
        function UnadoptTreeView(options) {
            _super.call(this, options);
            var self = this;
            self.bDebug = true;
            self.events = {
                "click .evt-close": "_mouseClick",
                "click .evt-submit": "_mouseClick",
            };
            self.delegateEvents();
        }
        UnadoptTreeView.prototype.setTree = function (treeId) {
            var self = this;
            self._tree = FoodParent.Model.getTrees().findWhere({ id: treeId });
        };
        UnadoptTreeView.prototype.getTree = function () {
            var self = this;
            return self._tree;
        };
        UnadoptTreeView.prototype.render = function (args) {
            _super.prototype.render.call(this, args);
            var self = this;
            if (self.bDebug)
                console.log(UnadoptTreeView.TAG + "render()");
            var food = FoodParent.Model.getFoods().findWhere({ id: self._tree.getFoodId() });
            var template = _.template(FoodParent.Template.getUnadoptTreeViewTemplate());
            var data = {
                header: "Unadopt Tree",
                treename: food.getName() + " " + self._tree.getName(),
            };
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-tree-adopt'));
            self.setVisible();
            self.resize();
            return self;
        };
        UnadoptTreeView.prototype.update = function (args) {
            _super.prototype.update.call(this, args);
            var self = this;
            if (self.bDebug)
                console.log(UnadoptTreeView.TAG + "update()");
            return self;
        };
        UnadoptTreeView.prototype.resize = function () {
            var self = this;
        };
        UnadoptTreeView.prototype._mouseClick = function (event) {
            var self = this;
            if (self._tree != undefined) {
                FoodParent.EventHandler.handleMouseClick($(event.currentTarget), self, { tree: self._tree });
            }
            else {
                FoodParent.EventHandler.handleMouseClick($(event.currentTarget), self);
            }
        };
        UnadoptTreeView.TAG = "UnadoptTreeView - ";
        return UnadoptTreeView;
    })(FoodParent.PopupView);
    FoodParent.UnadoptTreeView = UnadoptTreeView;
    /**
     * Factory for AdoptionManageView
     */
    var AdoptionManageViewFactory = (function () {
        function AdoptionManageViewFactory(args) {
            if (AdoptionManageViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use AdoptionManageViewFactory.getInstance() instead of new.");
            }
            AdoptionManageViewFactory._instance = this;
        }
        AdoptionManageViewFactory.getInstance = function () {
            return AdoptionManageViewFactory._instance;
        };
        AdoptionManageViewFactory.create = function (el, tree) {
            var view = new AdoptionManageView({ el: el });
            view.setTree(tree);
            return view;
        };
        AdoptionManageViewFactory._instance = new AdoptionManageViewFactory();
        return AdoptionManageViewFactory;
    })();
    FoodParent.AdoptionManageViewFactory = AdoptionManageViewFactory;
    var AdoptionManageView = (function (_super) {
        __extends(AdoptionManageView, _super);
        function AdoptionManageView(options) {
            var _this = this;
            _super.call(this, options);
            this.renderManageAdoption = function () {
                var self = _this;
                FoodParent.Controller.fetchAllPersonsAndAuthsAndFoodAndTreesAndAdopts(function () {
                    // add grid instance for existing data
                    self.renderParentsList(FoodParent.Model.getPersons());
                    self.renderFilterList();
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            };
            this.renderFilterList = function () {
                var self = _this;
                var template = _.template(FoodParent.Template.getAdoptionFilterListTemplate());
                var data = {
                    header: "Filter List",
                    auths: FoodParent.Model.getAuths(),
                };
                self.$('.adoption-filter').html(template(data));
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
        AdoptionManageView.prototype.setTree = function (treeId) {
            var self = this;
            self._tree = FoodParent.Model.getTrees().findWhere({ id: treeId });
        };
        AdoptionManageView.prototype.getTree = function () {
            var self = this;
            return self._tree;
        };
        AdoptionManageView.prototype.render = function (args) {
            _super.prototype.render.call(this, args);
            var self = this;
            if (self.bDebug)
                console.log(AdoptionManageView.TAG + "render()");
            var food = FoodParent.Model.getFoods().findWhere({ id: self._tree.getFoodId() });
            var template = _.template(FoodParent.Template.getAdoptionManageViewTemplateForAdmin());
            var data = {
                header: "Manage Adoptions",
                treename: food.getName() + " " + self._tree.getName(),
                treeId: self._tree.getId(),
            };
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-manage-adoption'));
            self.renderManageAdoption();
            self.setVisible();
            self.resize();
            return self;
        };
        AdoptionManageView.prototype.update = function (args) {
            _super.prototype.update.call(this, args);
            var self = this;
            if (self.bDebug)
                console.log(AdoptionManageView.TAG + "update()");
            return self;
        };
        AdoptionManageView.prototype.resize = function () {
            var self = this;
        };
        AdoptionManageView.prototype._mouseClick = function (event) {
            var self = this;
            FoodParent.EventHandler.handleMouseClick($(event.currentTarget), self);
        };
        AdoptionManageView.prototype._clickFilter = function (event) {
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
        AdoptionManageView.prototype._resetFilter = function (event) {
            var self = this;
            // Set the status of right corner button based on filter on / off status
            self.$('.filter-parenting-all').addClass('active');
            self.$('.filter-auth-all').addClass('active');
            self.$('.filter-parenting-item').removeClass('active');
            self.$('.filter-auth-item').removeClass('active');
            // Apply filter
            self._applyFilter();
        };
        AdoptionManageView.prototype._applyFilter = function (event) {
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
        AdoptionManageView.TAG = "AdoptionManageView - ";
        return AdoptionManageView;
    })(FoodParent.PopupView);
    FoodParent.AdoptionManageView = AdoptionManageView;
})(FoodParent || (FoodParent = {}));
