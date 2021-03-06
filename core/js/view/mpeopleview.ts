﻿declare var PersonColumn;
declare var NewPersonColumn;

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
        public static create(el: JQuery, id: number): ManagePeopleView {
            var view: ManagePeopleView;
            view = new ManagePeopleTableView({ el: el });
            view.setPeopleId(id);
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
                "click .add-person": "_addNewPerson",
                "click .filter-checkbox": "_applyFilter",
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

            return self;
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
                self.renderFilterList();
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
            grid.sort("name", "ascending");
            self.$(".list-people").html(grid.el);
        }

        private _addNewPerson = () => {
            var self: ManagePeopleTableView = this;
            if (self.$(".new-person").hasClass('hidden')) {
                var person: Person = new Person({ auth: 0, name: "", address: "", contact: "", neighborhood: "" });
                var persons: Persons = new Persons();
                persons.add(person);
                var optionValues = new Array<{ name: string, values: any }>();
                optionValues.push({ name: "Authorization", values: Model.getAuths().toArray() });
                NewPersonColumn[0].cell = Backgrid.SelectCell.extend({
                    editor: Backgrid.AuthSelectCellEditor,
                    optionValues: optionValues,
                });
                var grid = new Backgrid.Grid({
                    columns: NewPersonColumn,
                    collection: persons,
                    emptyText: Setting.getNoDataText(),
                });
                grid.render();
                //grid.sort("name", "ascending");
                self.$(".new-person").html('<div class="list-title">Add a New Person</div>');
                self.$(".new-person").append(grid.el);
                self.$(".new-person").removeClass('hidden');
            } else {
                self.$(".new-person").addClass('hidden');
            }
        }

        public renderFilterList = () => {
            var self: ManagePeopleTableView = this;
            var template = _.template(Template.getPersonFilterListTemplate());
            var data = {
                auths: Model.getAuths(),
            }
            self.$('#filter-list').html(template(data));
        }
        
        public _applyFilter(event?: Event): void {
            var self: ManagePeopleTableView = this;
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
                    if ($(item).prop('checked') == true) {
                        adoptIds.push(Math.floor($(item).prop('name')));
                    }
                });

                persons = persons.filterByAdoptStatus(adoptIds);

                // update markers
                self.renderPersonsList(persons);
            }, 1);
        }
        
    }
}