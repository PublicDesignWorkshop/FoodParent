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
        UnadoptTreeView.prototype._submitAdopt = function (event) {
            var self = this;
            FoodParent.Controller.checkLogin(function (response) {
                if (response.result == true || response.result == 'true') {
                    var food = FoodParent.Model.getFoods().findWhere({ id: self._tree.getFoodId() });
                    var person = FoodParent.Model.getPersons().findWhere({ id: parseInt(response.id) });
                    FoodParent.EventHandler.handleAdoptionData(self._tree, person, FoodParent.DATA_MODE.DELETE, {}, function () {
                        FoodParent.EventHandler.handleDataChange("<strong><i>" + person.getName() + "</i></strong> has unadopted <strong><i>" + food.getName() + " " + self._tree.getName() + "</i></strong> successfully.", false);
                        //if (View.getManageTreesView()) {
                        //    (<ManageTreesView>View.getManageTreesView()).renderTreeInfo(self._tree);
                        //    (<ManageTreesView>View.getManageTreesView())._applyFilter();
                        //}
                        if (FoodParent.View.getDetailTreeView()) {
                            FoodParent.View.getDetailTreeView().renderMenu();
                        }
                        new FoodParent.RemoveAlertViewCommand({ delay: FoodParent.Setting.getRemovePopupDuration() }).execute();
                    }, function () {
                        FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                    }, function () {
                        FoodParent.EventHandler.handleDataChange("<strong><i>" + person.getName() + "</i></strong> has adopted <strong><i>" + food.getName() + " " + self._tree.getName() + "</i></strong> successfully.", false);
                        //if (View.getManageTreesView()) {
                        //    (<ManageTreesView>View.getManageTreesView()).renderTreeInfo(self._tree);
                        //    (<ManageTreesView>View.getManageTreesView())._applyFilter();
                        //}
                        if (FoodParent.View.getDetailTreeView()) {
                            FoodParent.View.getDetailTreeView().renderMenu();
                        }
                    });
                }
                else {
                    new FoodParent.RenderMessageViewCommand({ el: FoodParent.Setting.getMessageWrapperElement(), message: FoodParent.Setting.getErrorMessage(response.code), undoable: false }).execute();
                }
            }, function (response) {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        };
        UnadoptTreeView.TAG = "UnadoptTreeView - ";
        return UnadoptTreeView;
    })(FoodParent.PopupView);
    FoodParent.UnadoptTreeView = UnadoptTreeView;
})(FoodParent || (FoodParent = {}));
