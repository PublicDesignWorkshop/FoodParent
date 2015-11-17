module FoodParent {
    export class PersonsView extends Backbone.View<Backbone.Model> {
        private bActive: boolean = true;
        private views: Array<Backbone.View<Backbone.Model>>;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var that: PersonsView = this;
            that.events = <any>{
                "click .nav-home": "_navHome",

            };
            that.delegateEvents();
            that.views = new Array<Backbone.View<Backbone.Model>>();
        }
        render(): any {
            var that: PersonsView = this;
            // add a new view
            var template = _.template(Template.getInstance().getPeopleTableTemplate());
            var data = {
                title: Localization.getInstance().getPeopleListText(),    
            }
            that.$el.html(template(data));

            // add grid instance for existing data
            PersonColumn[1].cell = Backgrid.SelectCell.extend({
                optionValues: Model.getInstance().getAuths().toArray(),
            })

            Model.getInstance().fetchPersons(function () {
                var persons: Persons = Model.getInstance().getPersons();
                that.renderGrid(persons);
            });
            return that;

        }

        getViews(): Array<Backbone.View<Backbone.Model>> {
            var that: PersonsView = this;
            return that.views;
        }

        renderGrid(persons: Persons): any {
            var that: PersonsView = this;
            //console.log(trees.models[0].get('id'));
            var grid = new Backgrid.Grid({
                columns: PersonColumn,
                collection: persons,
                emptyText: Localization.getInstance().getNoDataText(),
            });
            grid.render();
            //grid.sort("name", "ascending");
            that.$(".list-people").html(grid.el);

            return that;
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

    declare var PersonColumn;
}