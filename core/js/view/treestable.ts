declare var TreeColumn;
declare var NewTreeColumn;

module FoodParent {
    export class TreesTableViewFactory {
        private static _instance: TreesTableViewFactory = new TreesTableViewFactory();
        private baseUrl: string;
        constructor(args?: any) {
            if (TreesTableViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use TreesTableViewFactory.getInstance() instead of new.");
            }
            TreesTableViewFactory._instance = this;
        }
        public static getInstance(): TreesTableViewFactory {
            return TreesTableViewFactory._instance;
        }
        public static create(el: JQuery): TreesTableView {
            var view: TreesTableView = new TreesTableView({ el: el });
            return view;
        }
    }
    export class TreesTableView extends PopupView {
        private static TAG: string = "TreesTableView - ";
        private _tree: Tree;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: TreesTableView = this;
            self.bDebug = true;
            self.events = <any>{
                "click .evt-close": "_mouseClick",
                "click .btn-filter": "_clickFilter",
                "click .evt-reset-filter": "_resetFilter",
            };
            self.delegateEvents();
        }
        public render(args?: any): any {
            super.render(args);
            var self: TreesTableView = this;
            if (self.bDebug) console.log(TreesTableView.TAG + "render()");
            var template = _.template(Template.getTreesTableViewTemplateForAdmin());
            var data = {
                header: "Tree List",
            }
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-tree-list'));
            self.renderTrees();
            self.setVisible();
            self.resize();
            return self;
        }

        public update(args?: any): any {
            super.update(args);
            var self: TreesTableView = this;
            if (self.bDebug) console.log(TreesTableView.TAG + "update()");
            return self;
        }

        public resize(): any {
            var self: TreesTableView = this;
        }

        private renderTrees = () => {
            var self: TreesTableView = this;
            Controller.fetchAllTrees(function () {
                self.renderTreeList(Model.getTrees());
                self.renderFilterList();
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }

        public renderTreeList = (trees: Trees) => {
            var self: TreesTableView = this;
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

        public renderFilterList = () => {
            var self: TreesTableView = this;
            var template = _.template(Template.getTreesFilterListTemplateForAdmin());
            var data = {
                header: "Filter List",
                flags: Model.getFlags(),
                ownerships: Model.getOwnerships(),
            }
            self.$('.tree-filter').html(template(data));
        }

        public renderParentsList = (parents: Persons) => {
            var self: TreesTableView = this;
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
            var self: TreesTableView = this;
            EventHandler.handleMouseClick($(event.currentTarget), self);
        }

        protected _clickFilter(event: Event): void {
            var self: TreesTableView = this;
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
            var self: TreesTableView = this;
            // Set the status of right corner button based on filter on / off status
            self.$('.filter-parenting-all').addClass('active');
            self.$('.filter-auth-all').addClass('active');
            self.$('.filter-parenting-item').removeClass('active');
            self.$('.filter-auth-item').removeClass('active');
            // Apply filter
            self._applyFilter();
        }

        public _applyFilter(event?: Event): void {
            var self: TreesTableView = this;
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