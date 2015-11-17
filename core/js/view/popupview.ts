module FoodParent {
    export class PopupView extends Backbone.View<Backbone.Model> {
        private bActive: boolean = true;
        private tree: Tree;
        private views: Array<Backbone.View<Backbone.Model>>;
        private bVisible;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var that: PopupView = this;
            that.events = <any>{
                "click .nav-home": "_navHome",
                "click .filter-checkbox": "_clickFilterCheckbox",
            };
            that.delegateEvents();
            that.views = new Array<Backbone.View<Backbone.Model>>();
            that.bVisible = false;
        }
        render(): any {
            var that: PopupView = this;
            /*
            // add a new view
            var template = _.template(Template.getInstance().getTreeDetailTemplate());
            var data = {
                title: Localization.getInstance().getPeopleListText(),
            }
            that.$el.html(template(data));
            */
            return that;

        }

        public getCurrentTree(): Tree {
            return this.tree;
        }

        renderEditParent(tree: Tree): any {
            var that: PopupView = this;
            that.tree = tree;
            var template = _.template(Template.getInstance().getEditParentPopupViewTemplate());
            var data = {
                tree: tree.getName(),
            }
            that.$el.html(template(data));
            that.delegateEvents();
            that.renderGrid(Model.getInstance().getPersons());
            console.log(that.$el);
        }

        renderGrid(persons: Persons): any {
            var that: PopupView = this;
            //console.log(trees.models[0].get('id'));

            var fakeId: number = 14531;
            var newpersons: Persons = new Persons();
            $.each(persons.models, function (index: number, model: Person) {
                if (model.get('trees') == undefined || model.get('trees').length == 0) {
                    var temp: Person = new Person(model.attributes);
                    temp.id = "#" + fakeId;
                    temp.attributes.id = "#" + fakeId;
                    temp.attributes.tempid = model.attributes.id;
                    fakeId++;
                    temp.isSavable = false;
                    newpersons.add(temp);
                } else {
                    console.log(model.get('trees').length);
                    for (var i = 0; i < model.get('trees').length; i++) {
                        var temp: Person = new Person(model.attributes);
                        temp.id = "#" + fakeId;
                        temp.attributes.id = "#" + fakeId;
                        temp.attributes.tempid = model.attributes.id;
                        fakeId++;
                        temp.attributes.trees = [model.get('trees')[i]];
                        //temp.set({ id: model.getId(), trees: model.get('trees')[i] });
                        temp.isSavable = false;
                        newpersons.add(temp);
                    }
                }
            });

            console.log(newpersons);

            // add grid instance for existing data
            PersonPopupColumn[0].cell = Backgrid.SelectCell.extend({
                optionValues: Model.getInstance().getAuths().toArray(),
            })

            var grid = new Backgrid.Grid({
                columns: PersonPopupColumn,
                collection: newpersons,
                emptyText: Localization.getInstance().getNoDataText(),
            });
            grid.render();
            //grid.sort("name", "ascending");
            that.$(".list-people").html(grid.el);

            return that;
        }

        public SetVisibility(visible: boolean) {
            var that: PopupView = this;
            that.bVisible = visible;

            if (that.bVisible) {
                that.$el.removeClass('hidden');
                $('#wrapper-main-body').addClass('inactive');
                $('#wrapper-main-body').addClass('inactive');
            } else if (that.bVisible) {
                that.$el.addClass('hidden');
                $('#wrapper-main-body').removeClass('inactive');
                $('#wrapper-main-body').removeClass('inactive');
            }
        }

        /*
        customRender(tree: Tree): void {
            var that: PopupView = this;
            that.tree = tree;
            if (that.tree) {
                // add a new view
                var persons: Array<string> = Array<string>();
                var template = _.template(Template.getInstance().getTreeDetailTemplate());
                $.each(that.tree.get('owners'), function (index: number, owner: number) {
                    var name = Model.getInstance().getPersons().findWhere({ id: owner }).getName();
                    persons.push(" " + name);
                });
                var data = {
                    persons: persons.toString(),
                }
                that.$el.html(template(data));
            }
        }
        */

        getViews(): Array<Backbone.View<Backbone.Model>> {
            var that: PopupView = this;
            return that.views;
        }

        _clickFilterCheckbox(event: Event): void {
            var that: PopupView = this;
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
                    } else if (View.getInstance().getViewType() == MainViewType.PEOPLE || View.getInstance().getViewType() == MainViewType.TREE) {
                        persons = Model.getInstance().getPersons();
                    }
                }
                if (that.$('.filter-checkbox').find('input[name="assigned"]').prop('checked')) {
                    if (View.getInstance().getViewType() == MainViewType.TREES) {
                        trees = Model.getInstance().getTrees().getAssigned(trees);
                        console.log(trees);
                    } else if (View.getInstance().getViewType() == MainViewType.PEOPLE || View.getInstance().getViewType() == MainViewType.TREE) {
                        persons = Model.getInstance().getPersons().getAssigned(persons);
                    }
                }
                if (that.$('.filter-checkbox').find('input[name="unassigned"]').prop('checked')) {
                    if (View.getInstance().getViewType() == MainViewType.TREES) {
                        trees = Model.getInstance().getTrees().getUnassigned(trees);
                    } else if (View.getInstance().getViewType() == MainViewType.PEOPLE || View.getInstance().getViewType() == MainViewType.TREE) {
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
                    
                } else if (View.getInstance().getViewType() == MainViewType.PEOPLE) {
                    
                } else if (View.getInstance().getViewType() == MainViewType.TREE) {
                    that.renderGrid(persons);
                }
            }, 1);

        }

        /*
        _clickName(event: Event): void {
            var that: TreesView = this;
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
    declare var PersonPopupColumn;
}