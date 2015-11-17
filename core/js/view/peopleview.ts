module FoodParent {
    export class PeopleView extends Backbone.View<Backbone.Model> {
        private bActive: boolean = true;
        private views: Array<Backbone.View<Backbone.Model>>;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var that: PeopleView = this;
            that.events = <any>{
                "click .nav-home": "_navHome",

            };
            that.delegateEvents();
            that.views = new Array<Backbone.View<Backbone.Model>>();
        }
        render(): any {
            var that: PeopleView = this;
            // add a new view
            var template = _.template(Template.getInstance().getMainPeopleViewTemplate());
            var data = {
                title: Localization.getInstance().getPeopleListText(),    
            }
            that.$el.html(template(data));

            var view1: PersonsView = <PersonsView> PersonsViewFactory.getInstance().create(that.$('.panel-people')).render();
            that.views.push(view1);
            var view2: SideInfoView = <SideInfoView> SideViewFactory.getInstance().create(that.$('.panel-sideinfo')).render();
            view2.setPersonsView(view1);
            that.views.push(view2);
            return that;
            
        }

        getViews(): Array<Backbone.View<Backbone.Model>> {
            var that: PeopleView = this;
            return that.views;
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