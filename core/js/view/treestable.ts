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
                "click .evt-add-tree": "_addTree",
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

        public renderTreeList = (trees?: Trees) => {
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
            }
            self.$('.tree-filter').html(template(data));
            // Apply filter
            self._applyFilter();
        }

        private _mouseClick(event: Event): void {
            var self: TreesTableView = this;
            EventHandler.handleMouseClick($(event.currentTarget), self);
        }

        protected _clickFilter(event: Event): void {
            var self: TreesTableView = this;
            // Ownership filter
            if ($(event.currentTarget).hasClass('filter-owner-item')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                } else {
                    $(event.currentTarget).addClass('active');
                }
                if (self.$('.filter-owner-item').length == self.$('.filter-owner-item.active').length) {
                    self.$('.filter-owner-all').addClass('active');
                } else {
                    self.$('.filter-owner-all').removeClass('active');
                }
            }
            if ($(event.currentTarget).hasClass('filter-owner-all')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                    self.$('.filter-owner-item').removeClass('active');
                } else {
                    $(event.currentTarget).addClass('active');
                    self.$('.filter-owner-item').addClass('active');
                }
            }
            
            // Adoption filter
            if ($(event.currentTarget).hasClass('filter-adopt-item')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                } else {
                    $(event.currentTarget).addClass('active');
                }
                if (self.$('.filter-adopt-item').length == self.$('.filter-adopt-item.active').length) {
                    self.$('.filter-adopt-all').addClass('active');
                } else {
                    self.$('.filter-adopt-all').removeClass('active');
                }
            }
            if ($(event.currentTarget).hasClass('filter-adopt-all')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                    self.$('.filter-adopt-item').removeClass('active');
                } else {
                    $(event.currentTarget).addClass('active');
                    self.$('.filter-adopt-item').addClass('active');
                }
            }

            // Status filter
            if ($(event.currentTarget).hasClass('filter-flag-item')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                } else {
                    $(event.currentTarget).addClass('active');
                }

                if (self.$('.filter-flag-item').length == self.$('.filter-flag-item.active').length) {
                    self.$('.filter-flag-all').addClass('active');
                } else {
                    self.$('.filter-flag-all').removeClass('active');
                }
            }
            if ($(event.currentTarget).hasClass('filter-flag-all')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                    self.$('.filter-flag-item').removeClass('active');
                } else {
                    $(event.currentTarget).addClass('active');
                    self.$('.filter-flag-item').addClass('active');
                }
            }

            // Rating filter
            if ($(event.currentTarget).hasClass('filter-rating-item')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                } else {
                    $(event.currentTarget).addClass('active');
                }

                if (self.$('.filter-rating-item').length == self.$('.filter-rating-item.active').length) {
                    self.$('.filter-rating-all').addClass('active');
                } else {
                    self.$('.filter-rating-all').removeClass('active');
                }
            }
            if ($(event.currentTarget).hasClass('filter-rating-all')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                    self.$('.filter-rating-item').removeClass('active');
                } else {
                    $(event.currentTarget).addClass('active');
                    self.$('.filter-rating-item').addClass('active');
                }
            }

            // Last updated filter
            if ($(event.currentTarget).hasClass('filter-last-item')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                } else {
                    $(event.currentTarget).addClass('active');
                }

                if (self.$('.filter-last-item').length == self.$('.filter-last-item.active').length) {
                    self.$('.filter-last-all').addClass('active');
                } else {
                    self.$('.filter-last-all').removeClass('active');
                }
            }
            if ($(event.currentTarget).hasClass('filter-last-all')) {
                if ($(event.currentTarget).hasClass('active')) {
                    $(event.currentTarget).removeClass('active');
                    self.$('.filter-last-item').removeClass('active');
                } else {
                    $(event.currentTarget).addClass('active');
                    self.$('.filter-last-item').addClass('active');
                }
            }
            // Apply filter
            self._applyFilter();
        }

        private _resetFilter(event: Event): void {
            var self: TreesTableView = this;
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
        }

        public _applyFilter(event?: Event): void {
            var self: TreesTableView = this;
            // Find all trees
            var trees: Trees = Model.getTrees();
            // Apply ownership filtering
            var ownershipIds = new Array<number>();
            if (self.$('.filter-owner-all').hasClass('active')) {
                $.each(self.$('.filter-owner-item'), function (index: number, element: JQuery) {
                    ownershipIds.push(parseInt($(element).attr('data-id')));
                });
            } else {
                $.each(self.$('.filter-owner-item'), function (index: number, element: JQuery) {
                    if ($(element).hasClass('active')) {
                        ownershipIds.push(parseInt($(element).attr('data-id')));
                    }
                });
            }
            trees = trees.filterByOwnershipIds(ownershipIds);
            // Apply adoption flitering
            var adoptIds = new Array<number>();
            if (self.$('.filter-adopt-all').hasClass('active')) {
                $.each(self.$('.filter-adopt-item'), function (index: number, element: JQuery) {
                    adoptIds.push(parseInt($(element).attr('data-id')));
                });
            } else {
                $.each(self.$('.filter-adopt-item'), function (index: number, element: JQuery) {
                    if ($(element).hasClass('active')) {
                        adoptIds.push(parseInt($(element).attr('data-id')));
                    }
                });
            }
            trees = trees.filterByAdoptStatus(adoptIds);
            // Apply flag / status flitering
            var flagIds = new Array<number>();
            if (self.$('.filter-flag-all').hasClass('active')) {
                $.each(self.$('.filter-flag-item'), function (index: number, element: JQuery) {
                    flagIds.push(parseInt($(element).attr('data-id')));
                });
            } else {
                $.each(self.$('.filter-flag-item'), function (index: number, element: JQuery) {
                    if ($(element).hasClass('active')) {
                        flagIds.push(parseInt($(element).attr('data-id')));
                    }
                });
            }
            trees = trees.filterByFlagIds(flagIds);

            // update markers
            self.renderTreeList(trees);
        }

        private _addTree = () => {
            var self: TreesTableView = this;
            if (self.$(".new-tree").hasClass('hidden')) {
                Controller.updateGeoLocation(self.renderNewTree, self.renderGeoLocationError);
            } else {
                self.$(".new-tree").addClass('hidden');
            }
        }

        public renderNewTree = (position: Position) => {
            var self: TreesTableView = this;
            var tree: Tree = new Tree({ lat: position.coords.latitude, lng: position.coords.longitude, food: 1, type: 0, flag: 0, owner: 0, ownership: 1, description: "", address: "" });
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
            self.$(".new-tree").html(grid.el);
            self.$(".new-tree").removeClass('hidden');
        }

        private renderGeoLocationError = (error: PositionError) => {
            var self: TreesTableView = this;
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
    }
}
