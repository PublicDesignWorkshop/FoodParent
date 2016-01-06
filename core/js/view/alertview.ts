declare var AdoptionColumn;

module FoodParent {
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
            console.log(tree);
            view.setTree(tree);
            return view;
        }
    }

    export class ConfirmViewFractory {
        private static _instance: ConfirmViewFractory = new ConfirmViewFractory();
        private baseUrl: string;
        constructor(args?: any) {
            if (ConfirmViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use ConfirmViewFractory.getInstance() instead of new.");
            }
            ConfirmViewFractory._instance = this;
        }
        public static getInstance(): ConfirmViewFractory {
            return ConfirmViewFractory._instance;
        }
        public static create(el: JQuery, message: string, command: Command): ConfirmView {
            var view: ConfirmView = new ConfirmView({ el: el });
            view.setMessage(message);
            view.setCommand(command);
            return view;
        }
    }

    export class AlertViewFractory {
        private static _instance: AlertViewFractory = new AlertViewFractory();
        private baseUrl: string;
        constructor(args?: any) {
            if (AlertViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use AlertViewFractory.getInstance() instead of new.");
            }
            AlertViewFractory._instance = this;
        }
        public static getInstance(): AlertViewFractory {
            return AlertViewFractory._instance;
        }
        public static create(el: JQuery, errorMode: ERROR_MODE): AlertView {
            var view: AlertView = new AlertView({ el: el });
            view.setErrorMode(errorMode);
            return view;
        }
    }

    export class PopupView extends BaseView {

    }

    export class AlertView extends PopupView {
        private static TAG: string = "AlertView - ";
        private _errorMode: ERROR_MODE;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: AlertView = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = <any>{
                "click .alert-confirm": "_mouseClick",
                "click .alert-cancel": "_mouseClick",
            };
            self.delegateEvents();
        }
        public setErrorMode(errorMode: ERROR_MODE): void {
            var self: AlertView = this;
            self._errorMode = errorMode;
        }
        public render(args?: any): any {
            if (this.bRendered) {
                this.update(args);
                return;
            }
            this.bRendered = true;
            /////
            var self: AlertView = this;
            if (self.bDebug) console.log(AlertView.TAG + "render()");

            var template = _.template(Template.getAlertViewTemplate());
            var data: any;
            var tag: string = "";
            switch (self._errorMode) {
                case ERROR_MODE.GEO_PERMISSION_ERROR:
                    tag += "<p>The device cannot find its's location information.<br />Please turn Geolocation setting on & refresh the page.</p>"
                    tag += "<div class='button-outer-frame button1'><div class='button-inner-frame alert-confirm'>Confirm</div></div>";
                    break;
                case ERROR_MODE.SEVER_CONNECTION_ERROR:
                    tag += "<p>There is a server connection error.<br/>If the issue won't be solved by the refreshing page,";
                    tag += "<br/>please contact <a href='mailto:" + Setting.getDevContact() + "'>" + Setting.getDevContact() + "</a>.</p>";
                    tag += "<div class='button-outer-frame button1'><div class='button-inner-frame alert-confirm'>Confirm</div></div>";
                    break;
            }
            data = {
                content: tag,
            }
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-alert'));

            self.setVisible();

            return self;
        }

        public update(args?: any): any {
            if (!this.bRendered) {
                this.render(args);
                return;
            }
            /////
            var self: AlertView = this;
            if (self.bDebug) console.log(AlertView.TAG + "update()");
            return self;
        }
        private _mouseEnter(event: Event): void {
            var self: AlertView = this;
            EventHandler.handleMouseEnter($(event.currentTarget), self);
        }
        private _mouseClick(event: Event): void {
            var self: AlertView = this;
            EventHandler.handleMouseClick($(event.currentTarget), self);
        }

        public setVisible(): void {
            var self: AlertView = this;
            Setting.getPopWrapperElement().removeClass('hidden');
        }
        public setInvisible(): void {
            var self: AlertView = this;
            Setting.getPopWrapperElement().addClass('hidden');
        }
    }

    export class ConfirmView extends PopupView {
        private static TAG: string = "ConfirmView - ";
        private _message: string;
        private _command: Command;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: ConfirmView = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = <any>{
                "click .confirm-confirm": "_executeCommand",
                "click .confirm-cancel": "_mouseClick",
            };
            self.delegateEvents();
        }
        public setMessage(message: string): void {
            var self: ConfirmView = this;
            self._message = message;
        }
        public setCommand(command: Command): void {
            var self: ConfirmView = this;
            self._command = command;
        }
        public render(args?: any): any {
            if (this.bRendered) {
                this.update(args);
                return;
            }
            this.bRendered = true;
            /////
            var self: ConfirmView = this;
            if (self.bDebug) console.log(ConfirmView.TAG + "render()");


            var tag: string = "";
            tag += "<p>" + self._message + "<br/> This action cannot be undone.</p>";
            tag += "<div class='confirm-button-group'>";
            tag += "<div class='button-outer-frame button1'><div class='button-inner-frame confirm-confirm'>Confirm</div></div>";
            tag += "<div class='button-outer-frame button1'><div class='button-inner-frame confirm-cancel'>Cancel</div></div>";
            tag += "</div>";
            var template = _.template(Template.getConfirmViewTemplate());
            var data = {
                content: tag,
            }
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-confirm'));

            self.setVisible();

            return self;
        }

        public update(args?: any): any {
            if (!this.bRendered) {
                this.render(args);
                return;
            }
            /////
            var self: ConfirmView = this;
            if (self.bDebug) console.log(ConfirmView.TAG + "update()");
            return self;
        }
        private _mouseEnter(event: Event): void {
            var self: ConfirmView = this;
            EventHandler.handleMouseEnter($(event.currentTarget), self);
        }
        private _mouseClick(event: Event): void {
            var self: ConfirmView = this;
            EventHandler.handleMouseClick($(event.currentTarget), self);
        }
        private _executeCommand(event: Event): void {
            var self: ConfirmView = this;
            self._command.execute();
            EventHandler.handleMouseClick($(event.currentTarget), self);
        }

        public setVisible(): void {
            var self: ConfirmView = this;
            Setting.getPopWrapperElement().removeClass('hidden');
        }
        public setInvisible(): void {
            var self: ConfirmView = this;
            Setting.getPopWrapperElement().addClass('hidden');
        }
    }

    export class AdoptionManageView extends PopupView {
        private static TAG: string = "AdoptionManageView - ";
        private _tree: Tree;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: AdoptionManageView = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = <any>{
                "click .confirm-confirm": "_executeCommand",
                "click .confirm-cancel": "_mouseClick",
                "click .button-close": "_mouseClick",
                "click .filter-checkbox": "_applyFilter",
            };
            self.delegateEvents();
        }
        public setTree(treeId: number): void {
            var self: AdoptionManageView = this;
            console.log(treeId);
            self._tree = Model.getTrees().findWhere({ id: treeId });
        }

        public getTree(): Tree {
            var self: AdoptionManageView = this;
            return self._tree;
        }
       
        public render(args?: any): any {
            if (this.bRendered) {
                this.update(args);
                return;
            }
            this.bRendered = true;
            /////
            var self: AdoptionManageView = this;
            if (self.bDebug) console.log(AdoptionManageView.TAG + "render()");

            var food: Food = Model.getFoods().findWhere({ id: self._tree.getFoodId() });

            var template = _.template(Template.getManageAdoptionViewTemplate());
            var data = {
                treename: food.getName() + " " + self._tree.getName(),
                treeId: self._tree.getId(),
            }
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-manage-adoption'));
            self.renderPersons();
            
            self.setVisible();
            self.resize();
            return self;
        }

        public update(args?: any): any {
            if (!this.bRendered) {
                this.render(args);
                return;
            }
            /////
            var self: AdoptionManageView = this;
            if (self.bDebug) console.log(AdoptionManageView.TAG + "update()");
            return self;
        }

        public resize(): any {
            var self: AdoptionManageView = this;
            $('#content-manage-adoption-table').css({ width: self.getWidth() - $('#wrapper-tablemenu').outerWidth() });
            $('#wrapper-main').css({ height: View.getHeight() - 60 });
            $('#wrapper-mtrees').css({ height: View.getHeight() - 60 });
            $('.collapsible-list').css({ height: self.getHeight() - 34 * 2 - 30 });
        }

        private renderPersons = () => {
            var self: AdoptionManageView = this;
            Controller.fetchAllPersonsAndAuthsAndFoodAndTreesAndAdopts(function () {
                // add grid instance for existing data
                self.renderPersonsList(Model.getPersons());
                self.renderFilterList();
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }

        public renderFilterList = () => {
            var self: AdoptionManageView = this;
            var template = _.template(Template.getAdoptionFilterListTemplate());
            var data = {
                auths: Model.getAuths(),
            }
            self.$('#filter-list').html(template(data));
        }

        public renderPersonsList = (persons: Persons) => {
            var self: AdoptionManageView = this;

            var grid = new Backgrid.Grid({
                columns: AdoptionColumn,
                collection: persons,
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

        public setVisible(): void {
            var self: AdoptionManageView = this;
            Setting.getPopWrapperElement().removeClass('hidden');
        }
        public setInvisible(): void {
            var self: AdoptionManageView = this;
            Setting.getPopWrapperElement().addClass('hidden');
        }

        public _applyFilter(event?: Event): void {
            var self: AdoptionManageView = this;
            var persons: Persons = Model.getPersons();
            setTimeout(function () {
                // Filtering food type.
                if (event != undefined) {
                    if ($(event.target).find('input').prop('name') == 'authsall') {
                        if ($(event.target).find('input').prop('checked') == true) {
                            $('.filter-auth').addClass('active');
                            $('.filter-auth input').prop({ 'checked': 'checked' });
                        } else {
                            $('.filter-auth').removeClass('active');
                            $('.filter-auth input').prop({ 'checked': '' });
                        }
                    }
                }
                

                // Apply auth filtering
                var authIds = new Array<number>();
                $.each(self.$('.filter-auth input'), function (index: number, item: JQuery) {
                    if ($(item).prop('checked') == true) {
                        authIds.push(Math.floor($(item).prop('name')));
                    }
                });

                persons = persons.filterByAuthIds(authIds);

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
                    console.log($(item).prop('checked'));
                    if ($(item).prop('checked') == true) {
                        adoptIds.push(Math.floor($(item).prop('name')));
                    }
                });

                persons = persons.filterByAdoptStatusForTree(adoptIds, self._tree.getId());

                // update markers
                self.renderPersonsList(persons);
            }, 1);
        }
    }
}