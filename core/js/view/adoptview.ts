module FoodParent {
    export class AdoptTreeViewFactory {
        private static _instance: AdoptTreeViewFactory = new AdoptTreeViewFactory();
        private baseUrl: string;
        constructor(args?: any) {
            if (AdoptTreeViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use AdoptTreeViewFactory.getInstance() instead of new.");
            }
            AdoptTreeViewFactory._instance = this;
        }
        public static getInstance(): AdoptTreeViewFactory {
            return AdoptTreeViewFactory._instance;
        }
        public static create(el: JQuery, tree: number): AdoptTreeView {
            var view: AdoptTreeView = new AdoptTreeView({ el: el });
            view.setTree(tree);
            return view;
        }
    }

    export class AdoptTreeView extends PopupView {
        private static TAG: string = "AdoptTreeView - ";
        private _tree: Tree;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: AdoptTreeView = this;
            self.bDebug = true;
            self.events = <any>{
                "click .evt-close": "_mouseClick",
                "click .evt-submit": "_mouseClick",
            };
            self.delegateEvents();
        }
        public setTree(treeId: number): void {
            var self: AdoptTreeView = this;
            self._tree = Model.getTrees().findWhere({ id: treeId });
        }
        public getTree(): Tree {
            var self: AdoptTreeView = this;
            return self._tree;
        }

        public render(args?: any): any {
            super.render(args);
            var self: AdoptTreeView = this;
            if (self.bDebug) console.log(AdoptTreeView.TAG + "render()");
            var food: Food = Model.getFoods().findWhere({ id: self._tree.getFoodId() });
            var template = _.template(Template.getAdoptTreeViewTemplate());
            var data = {
                header: "Adopt Tree",
                treename: food.getName() + " " + self._tree.getName(),
            }
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-tree-adopt'));
            self.setVisible();
            self.resize();
            return self;
        }
        public update(args?: any): any {
            super.update(args);
            var self: AdoptTreeView = this;
            if (self.bDebug) console.log(AdoptTreeView.TAG + "update()");
            return self;
        }
        public resize(): any {
            var self: AdoptTreeView = this;
        }
        protected _mouseClick(event: Event): void {
            var self: AdoptTreeView = this;
            if (self._tree != undefined) {
                EventHandler.handleMouseClick($(event.currentTarget), self, { tree: self._tree });
            } else {
                EventHandler.handleMouseClick($(event.currentTarget), self);
            }
        }
    }

    export class UnadoptTreeViewFactory {
        private static _instance: UnadoptTreeViewFactory = new UnadoptTreeViewFactory();
        private baseUrl: string;
        constructor(args?: any) {
            if (UnadoptTreeViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use UnadoptTreeViewFactory.getInstance() instead of new.");
            }
            UnadoptTreeViewFactory._instance = this;
        }
        public static getInstance(): UnadoptTreeViewFactory {
            return UnadoptTreeViewFactory._instance;
        }
        public static create(el: JQuery, tree: number): UnadoptTreeView {
            var view: UnadoptTreeView = new UnadoptTreeView({ el: el });
            view.setTree(tree);
            return view;
        }
    }

    export class UnadoptTreeView extends PopupView {
        private static TAG: string = "UnadoptTreeView - ";
        private _tree: Tree;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: UnadoptTreeView = this;
            self.bDebug = true;
            self.events = <any>{
                "click .evt-close": "_mouseClick",
                "click .evt-submit": "_mouseClick",
            };
            self.delegateEvents();
        }
        public setTree(treeId: number): void {
            var self: UnadoptTreeView = this;
            self._tree = Model.getTrees().findWhere({ id: treeId });
        }
        public getTree(): Tree {
            var self: UnadoptTreeView = this;
            return self._tree;
        }
        public render(args?: any): any {
            super.render(args);
            var self: UnadoptTreeView = this;
            if (self.bDebug) console.log(UnadoptTreeView.TAG + "render()");
            var food: Food = Model.getFoods().findWhere({ id: self._tree.getFoodId() });
            var template = _.template(Template.getUnadoptTreeViewTemplate());
            var data = {
                header: "Unadopt Tree",
                treename: food.getName() + " " + self._tree.getName(),
            }
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-tree-adopt'));
            self.setVisible();
            self.resize();
            return self;
        }
        public update(args?: any): any {
            super.update(args);
            var self: UnadoptTreeView = this;
            if (self.bDebug) console.log(UnadoptTreeView.TAG + "update()");
            return self;
        }
        public resize(): any {
            var self: UnadoptTreeView = this;
        }
        protected _mouseClick(event: Event): void {
            var self: UnadoptTreeView = this;
            if (self._tree != undefined) {
                EventHandler.handleMouseClick($(event.currentTarget), self, { tree: self._tree });
            } else {
                EventHandler.handleMouseClick($(event.currentTarget), self);
            }
        }

        private _submitAdopt(event: Event): void {
            var self: UnadoptTreeView = this;
            Controller.checkLogin(function (response) {
                if (response.result == true || response.result == 'true') {   // Already logged in
                    var food: Food = Model.getFoods().findWhere({ id: self._tree.getFoodId() });
                    var person: Person = Model.getPersons().findWhere({ id: parseInt(response.id) });
                    EventHandler.handleAdoptionData(self._tree, person, DATA_MODE.DELETE, {}, function () {
                        EventHandler.handleDataChange("<strong><i>" + person.getName() + "</i></strong> has unadopted <strong><i>" + food.getName() + " " + self._tree.getName() + "</i></strong> successfully.", false);
                        //if (View.getManageTreesView()) {
                        //    (<ManageTreesView>View.getManageTreesView()).renderTreeInfo(self._tree);
                        //    (<ManageTreesView>View.getManageTreesView())._applyFilter();
                        //}
                        if (View.getDetailTreeView()) {
                            (<DetailTreeView>View.getDetailTreeView()).renderMenu();
                        }
                        new RemoveAlertViewCommand({ delay: Setting.getRemovePopupDuration() }).execute();
                    }, function () {
                        EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                    }, function () {
                        EventHandler.handleDataChange("<strong><i>" + person.getName() + "</i></strong> has adopted <strong><i>" + food.getName() + " " + self._tree.getName() + "</i></strong> successfully.", false);
                        //if (View.getManageTreesView()) {
                        //    (<ManageTreesView>View.getManageTreesView()).renderTreeInfo(self._tree);
                        //    (<ManageTreesView>View.getManageTreesView())._applyFilter();
                        //}
                        if (View.getDetailTreeView()) {
                            (<DetailTreeView>View.getDetailTreeView()).renderMenu();
                        }
                    });
                } else {
                    new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: Setting.getErrorMessage(response.code), undoable: false }).execute();
                }
            }, function (response) {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }
    }
}