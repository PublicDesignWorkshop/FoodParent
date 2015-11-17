module FoodParent {
    export class SideInfoView extends Backbone.View<Backbone.Model> {
        private bActive: boolean = true;
        private views: Array<Backbone.View<Backbone.Model>>;
        private tree: Tree;
        private mapView: MapView;
        private personsView: PersonsView;
        private currentFlag: number;
        private currentOwnership: number;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var that: SideInfoView = this;
            that.events = <any>{
                "click .flag-radio": "_clickFlagRadio",
                "click .ownership-radio": "_clickOwnershipRadio",
                "click .filter-checkbox": "_clickFilterCheckbox",

            };
            that.delegateEvents();
            that.views = new Array<Backbone.View<Backbone.Model>>();
        }
        render(): any {
            var that: SideInfoView = this;
            if (View.getInstance().getViewType() == MainViewType.TREES) {
                var template = _.template(Template.getInstance().getTreesSideInfoViewTemplate());
                var data = {
                    food: Model.getInstance().getFoods(),
                }
                that.$el.html(template(data));
            } else if (View.getInstance().getViewType() == MainViewType.PEOPLE) {
                var template = _.template(Template.getInstance().getPeopleSideInfoViewTemplate());
                var data2 = {}
                that.$el.html(template(data2));
            } else {
                var template = _.template(Template.getInstance().getEmptySideInfoViewTemplate());
                var data3 = {}
                that.$el.html(template(data3));
            }
            
            that.renderTableToggle();

            return that;
        }

        render2(bChecked: boolean): any {
            var that: SideInfoView = this;
            if (View.getInstance().getViewType() == MainViewType.TREES) {
                var template = _.template(Template.getInstance().getTreesSideInfoViewTemplate());
                var data = {
                    food: Model.getInstance().getFoods(),
                }
                that.$el.html(template(data));
            }
            that.renderTableToggle(bChecked);

            return that;
        }

        customRender(tree: Tree): void {
            var that: SideInfoView = this;
            that.tree = tree;
            Controller.getInstance().fetchFlags(Controller.getInstance().fetchTypes, that.renderTreeInfo);
        }

        renderRecentActivity = () => {
            var that: SideInfoView = this;
            if (that.tree) {
                var template = _.template(Template.getInstance().getRecentActivityTemplate());
                
                var notes: Notes = new Notes(Model.getInstance().getNotes().where({ tree: that.tree.getId() }));
                Model.getInstance().getNotes().sortByDescendingDate();
                var data = {
                    recent: Localization.getInstance().getRecentText(),
                    notes: notes.first(Setting.getInstance().getNumRecentActivityShown()),
                }
                that.$('.wrapper-recent-activity').html(template(data));
                
            }
        }
        
        renderTreeInfo = () => {
            var that: SideInfoView = this;
            
            if (that.tree) {
                var food: Food = Model.getInstance().getFoods().findWhere({ id: that.tree.getFoodId() });
                var flag: Flag = Model.getInstance().getFlags().findWhere({ id: that.tree.getFlagId() });
                var ownership: Ownership = Model.getInstance().getOwnerships().findWhere({ id: that.tree.getOwnershipId() });
                var template = _.template(Template.getInstance().getSideInfoViewTemplate());
                var data = {
                    name: food.getName() + that.tree.getName(),
                    location: '@ ' + that.tree.getLat().toFixed(4) + ", " + that.tree.getLng().toFixed(4),
                    flag: Localization.getInstance().getFlagText(),
                    flags: Model.getInstance().getFlags(),
                    ownership: Localization.getInstance().getOwnershipText(),
                    ownerships: Model.getInstance().getOwnerships(),
                    foods: Model.getInstance().getFoods(),
                }
                that.$el.html(template(data));
                that.renderFlagInfo(flag);
                that.renderOwnershipInfo(ownership);
                Controller.getInstance().fetchNotes([that.tree.getId()], Setting.getInstance().getNumRecentActivityShown(), 0, that.renderRecentActivity);
                that.renderTableToggle();
            } else {
                that.$el.html("");
            }
            return that;
        }

        renderTableToggle(bChecked?: boolean): void {
            var that: SideInfoView = this;
            that.$('#toggle-table').bootstrapToggle({
                on: 'Graphic',
                off: 'Table',
                size: 'small',
                onstyle: 'default',
            });
            //
            //.prop({ 'checked': 'checked' });
            //toggle-table
            if (View.getInstance().getViewType() == MainViewType.TREES) {
                if (bChecked != undefined) {
                    if (bChecked) {
                        that.$('#toggle-table').bootstrapToggle('on');
                    } else {
                        that.$('#toggle-table').bootstrapToggle('off');
                    }
                }
                that.$('#toggle-table').change(function () {

                    that.render2($(this).prop('checked'));
                    that.mapView.SetIsGraphicView($(this).prop('checked'));
                });
            } else if (View.getInstance().getViewType() == MainViewType.PEOPLE) {
                that.$('#toggle-table').bootstrapToggle('off');
                that.$('#toggle-table').prop({ disabled: 'disabled' });
            }
            
        }

        renderFlagInfo = (flag: Flag) => {
            var that: SideInfoView = this;
            $.each(that.$('.flag-radio'), function (index: number, item: any) {
                if (parseInt($(item).attr('data-flag')) == flag.getId()) {
                    $(item).addClass('active');
                    $(item).find('input').prop({ 'checked': 'checked' });
                    that.currentFlag = parseInt($(item).attr('data-flag'));
                } else {
                    $(item).removeClass('active');
                    $(item).find('input').prop({ 'checked': '' });
                }
            });
        }

        _clickFilterCheckbox(event: Event): void {
            var that: SideInfoView = this;
            setTimeout(function () {
                if ($(event.target).find('input').prop('name') == 'showall') {
                    if ($(event.target).find('input').prop('checked') == true) {
                        $.each(that.$('.filter-checkbox'), function (index: number, item: any) {
                            $(item).addClass('active');
                            $(item).find('input').prop({ 'checked': 'checked' });
                        });
                    } else {
                        $.each(that.$('.filter-checkbox'), function (index: number, item: any) {
                            $(item).removeClass('active');
                            $(item).find('input').prop({ 'checked': '' });
                        });
                    }
                } else if ($(event.target).find('input').prop('name') != 'showall') {
                    var isAllChecked: boolean = true;
                    $.each(that.$('.filter-checkbox'), function (index: number, item: any) {
                        if ($(item).find('input').prop('name') != 'showall') {
                            if ($(item).find('input').prop('checked') == false) {
                                isAllChecked = false;
                            }
                        }
                    });

                    if (isAllChecked) {
                        that.$('.filter-checkbox').find('input[name="showall"]').parent().addClass('active');
                        that.$('.filter-checkbox').find('input[name="showall"]').prop({ 'checked': 'checked' });
                    } else if ($(event.target).find('input').prop('checked') == false) {
                        that.$('.filter-checkbox').find('input[name="showall"]').parent().removeClass('active');
                        that.$('.filter-checkbox').find('input[name="showall"]').prop({ 'checked': '' });
                    }

                }
                 // apply filtering
                var trees: Trees = new Trees();
                var persons: Persons = new Persons();

                if (that.$('.filter-checkbox').find('input[name="showall"]').prop('checked')) {
                    if (View.getInstance().getViewType() == MainViewType.TREES) {
                        trees = Model.getInstance().getTrees();
                    } else if (View.getInstance().getViewType() == MainViewType.PEOPLE) {
                        persons = Model.getInstance().getPersons();
                    }
                }
                if (that.$('.filter-checkbox').find('input[name="assigned"]').prop('checked')) {
                    if (View.getInstance().getViewType() == MainViewType.TREES) {
                        trees = Model.getInstance().getTrees().getAssigned(trees);
                        console.log(trees);
                    } else if (View.getInstance().getViewType() == MainViewType.PEOPLE) {
                        persons = Model.getInstance().getPersons().getAssigned(persons);
                    }
                }
                if (that.$('.filter-checkbox').find('input[name="unassigned"]').prop('checked')) {
                    if (View.getInstance().getViewType() == MainViewType.TREES) {
                        trees = Model.getInstance().getTrees().getUnassigned(trees);
                    } else if (View.getInstance().getViewType() == MainViewType.PEOPLE) {
                        persons = Model.getInstance().getPersons().getUnassigned(persons);
                    }
                }

                $.each(that.$('.filter-checkbox'), function (index: number, item: any) {
                    if (($(item).find('input').prop('name') != 'showall') && ($(item).find('input').prop('name') != 'assigned') && ($(item).find('input').prop('name') != 'unassigned')) {
                        if ($(item).find('input').prop('checked')) {
                            trees = Model.getInstance().getTrees().getFromFoodId(trees, parseInt($(item).find('input').prop('name')));
                        }
                    }
                });

               

                if (View.getInstance().getViewType() == MainViewType.TREES) {
                    that.mapView.customRender(trees);
                } else if (View.getInstance().getViewType() == MainViewType.PEOPLE) {
                    that.personsView.renderGrid(persons);
                }
            }, 1);
            
        }

        _clickFlagRadio(event: Event): void {
            var that: SideInfoView = this;
            $.each(that.$('.flag-radio'), function (index: number, item: any) {
                if (item == event.target) {
                    $(item).addClass('active');
                    $(item).find('input').prop({ 'checked': 'checked' });
                } else {
                    $(item).removeClass('active');
                    $(item).find('input').prop({ 'checked': '' });
                }
            });
            if (that.currentFlag != parseInt($(event.target).attr('data-flag')) && that.tree) {
                that.currentFlag = parseInt($(event.target).attr('data-flag'));
                // edit tree data
                that.tree.save(
                    {
                        flag: parseInt($(event.target).attr('data-flag')),
                    },
                    {
                        wait: true,
                        success: function (model, response) {
                            //console.log(model);
                        },
                        error: function (error) {
                            console.log(error);
                        },
                    }
                );
                // add a new note
                var note = new Note({
                    type: NoteType.INFO,
                    tree: that.tree.getId(),
                    person: 0,
                    comment: "Flag is changed to '" + Model.getInstance().getFlags().findWhere({ id: parseInt($(event.target).attr('data-flag')) }).getName() + "'",
                    picture: "",
                    rate: 0,
                    date: moment(new Date()).format(Setting.getInstance().getDateTimeFormat()),
                });

                note.save(
                    {},
                    {
                        wait: true,
                        success: function (model, response) {
                            Model.getInstance().getNotes().add(model);
                            that.renderRecentActivity();
                        },
                        error: function (error) {
                            console.log(error);
                        },
                    }
                );
            }
            
        }

        renderOwnershipInfo = (ownership: Ownership) => {
            var that: SideInfoView = this;
            $.each(that.$('.ownership-radio'), function (index: number, item: any) {
                if (parseInt($(item).attr('data-ownership')) == ownership.getId()) {
                    $(item).addClass('active');
                    $(item).find('input').prop({ 'checked': 'checked' });
                    that.currentOwnership = parseInt($(item).attr('data-ownership'));
                } else {
                    $(item).removeClass('active');
                    $(item).find('input').prop({ 'checked': '' });
                }
            });
        }

        _clickOwnershipRadio(event: Event): void {
            var that: SideInfoView = this;
            $.each(that.$('.ownership-radio'), function (index: number, item: any) {
                if (item == event.target) {
                    $(item).addClass('active');
                    $(item).find('input').prop({ 'checked': 'checked' });
                } else {
                    $(item).removeClass('active');
                    $(item).find('input').prop({ 'checked': '' });
                }
            });

            if (that.currentOwnership != parseInt($(event.target).attr('data-ownership')) && that.tree) {
                that.currentOwnership = parseInt($(event.target).attr('data-ownership'));
                // edit tree data
                that.tree.save(
                    {
                        ownership: parseInt($(event.target).attr('data-ownership')),
                    },
                    {
                        wait: true,
                        success: function (model, response) {
                            //console.log(model);
                        },
                        error: function (error) {
                            console.log(error);
                        },
                    }
                    );
                // add a new note
                var note = new Note({
                    type: NoteType.INFO,
                    tree: that.tree.getId(),
                    person: 0,
                    comment: "Ownership is changed to '" + Model.getInstance().getOwnerships().findWhere({ id: parseInt($(event.target).attr('data-ownership')) }).getName() + "'",
                    picture: "",
                    rate: 0,
                    date: moment(new Date()).format(Setting.getInstance().getDateTimeFormat()),
                });

                note.save(
                    {},
                    {
                        wait: true,
                        success: function (model, response) {
                            Model.getInstance().getNotes().add(model);
                            that.renderRecentActivity();
                        },
                        error: function (error) {
                            console.log(error);
                        },
                    }
                    );
            }
        }

        public setMapView(view: MapView): void {
            this.mapView = view;
        }

        public setPersonsView(view: PersonsView): void {
            this.personsView = view;
        }
        

        /*
        _clickName(event: Event): void {
            var that: HeaderView = this;
            that.bExpanded = !that.bExpanded;

            if (that.bExpanded) {
                //new DetailView({ model: this.model, el: this.$('.detail') }).render();
            } else {
                //this.$('.detail').empty();
            }
            event.preventDefault();
        }
        */


    }
}