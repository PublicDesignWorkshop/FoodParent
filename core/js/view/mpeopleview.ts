declare var PersonColumn;

module FoodParent {
    export class ManagePeopleViewFractory {
        private static _instance: ManagePeopleViewFractory = new ManagePeopleViewFractory();
        private baseUrl: string;
        constructor(args?: any) {
            if (ManagePeopleViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use ManagePeopleViewFractory.getInstance() instead of new.");
            }
            ManagePeopleViewFractory._instance = this;
        }
        public static getInstance(): ManagePeopleViewFractory {
            return ManagePeopleViewFractory._instance;
        }
        public static create(el: JQuery, viewMode: VIEW_MODE, id: number): ManagePeopleView {
            var view: ManagePeopleView;
            if (viewMode == VIEW_MODE.TABLE) {
                view = new ManagePeopleTableView({ el: el });
                view.setPeopleId(id);
            }
            return view;
        }
    }

    export class ManagePeopleView extends BaseView {
        protected _id: number;
        public setPeopleId(id: number) {
            this._id = id;
        }
    }

    export class ManagePeopleTableView extends ManagePeopleView {
        private static TAG: string = "ManageTreesMapView - ";
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: ManagePeopleTableView = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = <any>{
                //"click .switch-map": "_mouseClick",
            };
            self.delegateEvents();
        }

        public render(args?: any): any {
            if (this.bRendered) {
                this.update(args);
                return self;
            }
            this.bRendered = true;
            var self: ManagePeopleTableView = this;
            if (self.bDebug) console.log(ManagePeopleTableView.TAG + "render()");
            var template = _.template(Template.getManagePeopleTableViewTemplate());
            var data = {

            }
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-mpeople'));
            self.resize();
            self.renderPersons();
        }

        public resize(): any {
            $('#content-mpeople-table').css({ width: View.getWidth() - $('#wrapper-tablemenu').outerWidth() });
            $('#wrapper-main').css({ height: View.getHeight() - 60 });
            $('#wrapper-mpeople').css({ height: View.getHeight() - 60 });
            $('.collapsible-list').css({ height: View.getHeight() - 60 - 34 * 2 - 20 });
        }

        private renderPersons = () => {
            var self: ManagePeopleTableView = this;
            Controller.fetchAllPersonsAndAuthsAndFoodAndTreesAndAdopts(function () {
                // add grid instance for existing data
                self.renderPersonsList(Model.getPersons());
                //self.renderFilterList();
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }

        public renderPersonsList = (persons: Persons) => {
            var self: ManagePeopleTableView = this;
            var optionValues = new Array<{ name: string, values: any }>();
            optionValues.push({ name: "Authorization", values: Model.getAuths().toArray() });
            PersonColumn[0].cell = Backgrid.SelectCell.extend({
                editor: Backgrid.AuthSelectCellEditor,
                optionValues: optionValues,
            });

            var grid = new Backgrid.Grid({
                columns: PersonColumn,
                collection: persons,
                emptyText: Setting.getNoDataText(),
            });
            grid.render();
            //grid.sort("name", "ascending");
            self.$(".list-people").html(grid.el);
        }
    }
}