declare var AdoptionColumn;

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
    }

    /**
     * Factory for AdoptionManageView
     */
    export class AdoptionManageViewFactory {
        private static _instance: AdoptionManageViewFactory = new AdoptionManageViewFactory();
        private baseUrl: string;
        constructor(args?: any) {
            if (AdoptionManageViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use AdoptionManageViewFactory.getInstance() instead of new.");
            }
            AdoptionManageViewFactory._instance = this;
        }
        public static getInstance(): AdoptionManageViewFactory {
            return AdoptionManageViewFactory._instance;
        }
        public static create(el: JQuery, tree: number): AdoptionManageView {
            var view: AdoptionManageView = new AdoptionManageView({ el: el });
            view.setTree(tree);
            return view;
        }
    }

    export class AdoptionManageView extends PopupView {
        private static TAG: string = "AdoptionManageView - ";
        private _tree: Tree;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: AdoptionManageView = this;
            self.bDebug = true;
            self.events = <any>{
                "click .evt-close": "_mouseClick",
                "click .btn-filter": "_clickFilter",
                "click .evt-reset-filter": "_resetFilter",
            };
            self.delegateEvents();
        }
        public setTree(treeId: number): void {
            var self: AdoptionManageView = this;
            self._tree = Model.getTrees().findWhere({ id: treeId });
        }
        public getTree(): Tree {
            var self: AdoptionManageView = this;
            return self._tree;
        }
        public render(args?: any): any {
            super.render(args);
            var self: AdoptionManageView = this;
            if (self.bDebug) console.log(AdoptionManageView.TAG + "render()");
            var food: Food = Model.getFoods().findWhere({ id: self._tree.getFoodId() });
            var template = _.template(Template.getAdoptionManageViewTemplateForAdmin());
            var data = {
                header: "Manage Adoptions",
                treename: food.getName() + " " + self._tree.getName(),
                treeId: self._tree.getId(),
            }
            self.$el.append(template(data));
            self.setElement(self.$('#wrapper-manage-adoption'));
            self.renderManageAdoption();
            self.setVisible();
            self.resize();
            return self;
        }

        public update(args?: any): any {
            super.update(args);
            var self: AdoptionManageView = this;
            if (self.bDebug) console.log(AdoptionManageView.TAG + "update()");
            return self;
        }

        public resize(): any {
            var self: AdoptionManageView = this;
        }

        private renderManageAdoption = () => {
            var self: AdoptionManageView = this;
            Controller.fetchAllPersonsAndAuthsAndFoodAndTreesAndAdopts(function () {
                // add grid instance for existing data
                self.renderParentsList(Model.getPersons());
                self.renderFilterList();
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }

        public renderFilterList = () => {
            var self: AdoptionManageView = this;
            var template = _.template(Template.getAdoptionFilterListTemplate());
            var data = {
                header: "Filter List",
                auths: Model.getAuths(),
            }
            self.$('.adoption-filter').html(template(data));
        }

        public renderParentsList = (parents: Persons) => {
            var self: AdoptionManageView = this;
            var grid = new Backgrid.Grid({
                columns: AdoptionColumn,
                collection: parents,
                emptyText: Setting.getNoDataText(),
            });
            grid.render();
            grid.sort("name", "ascending");
            self.$(".list-adoption").html(grid.el);
        }

        private _mouseClick(event: Event): void {
            var self: AdoptionManageView = this;
            EventHandler.handleMouseClick($(event.currentTarget), self);
        }

        protected _clickFilter(event: Event): void {
            var self: AdoptionManageView = this;
            // Parenting filter
            if ($(event.currentTarget).hasClass('filter-parenting-item')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                } else {
                    $(event.currentTarget).addClass('active');
                }
                if (self.$('.filter-parenting-item').length == self.$('.filter-parenting-item.active').length) {
                    self.$('.filter-parenting-all').addClass('active');
                } else {
                    self.$('.filter-parenting-all').removeClass('active');
                }
            }
            if ($(event.currentTarget).hasClass('filter-parenting-all')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                    self.$('.filter-parenting-item').removeClass('active');
                } else {
                    $(event.currentTarget).addClass('active');
                    self.$('.filter-parenting-item').addClass('active');
                }
            }

            // Authorization filter
            if ($(event.currentTarget).hasClass('filter-auth-item')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                } else {
                    $(event.currentTarget).addClass('active');
                }
                if (self.$('.filter-auth-item').length == self.$('.filter-auth-item.active').length) {
                    self.$('.filter-auth-all').addClass('active');
                } else {
                    self.$('.filter-auth-all').removeClass('active');
                }
            }
            if ($(event.currentTarget).hasClass('filter-auth-all')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                    self.$('.filter-auth-item').removeClass('active');
                } else {
                    $(event.currentTarget).addClass('active');
                    self.$('.filter-auth-item').addClass('active');
                }
            }
            // Apply filter
            self._applyFilter();
        }

        private _resetFilter(event: Event): void {
            var self: AdoptionManageView = this;
            // Set the status of right corner button based on filter on / off status
            self.$('.filter-parenting-all').addClass('active');
            self.$('.filter-auth-all').addClass('active');
            self.$('.filter-parenting-item').removeClass('active');
            self.$('.filter-auth-item').removeClass('active');
            // Apply filter
            self._applyFilter();
        }

        public _applyFilter(event?: Event): void {
            var self: AdoptionManageView = this;
            var persons: Persons = Model.getPersons();

            // Apply parenting filtering
            var adoptIds = new Array<number>();
            if (self.$('.filter-parenting-all').hasClass('active')) {
                $.each(self.$('.filter-parenting-item'), function (index: number, element: JQuery) {
                    adoptIds.push(parseInt($(element).attr('data-id')));
                });
            } else {
                $.each(self.$('.filter-parenting-item'), function (index: number, element: JQuery) {
                    if ($(element).hasClass('active')) {
                        adoptIds.push(parseInt($(element).attr('data-id')));
                    }
                });
            }
            persons = persons.filterByAdoptStatusForTree(adoptIds, self._tree.getId());
            
            // Apply authorization filtering
            var authIds = new Array<number>();
            if (self.$('.filter-auth-all').hasClass('active')) {
                $.each(self.$('.filter-auth-item'), function (index: number, element: JQuery) {
                    authIds.push(parseInt($(element).attr('data-id')));
                });
            } else {
                $.each(self.$('.filter-auth-item'), function (index: number, element: JQuery) {
                    if ($(element).hasClass('active')) {
                        authIds.push(parseInt($(element).attr('data-id')));
                    }
                });
            }
            persons = persons.filterByAuthIds(authIds);

            // update markers
            self.renderParentsList(persons);
        }
    }
}