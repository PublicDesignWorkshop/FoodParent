module FoodParent {
    export class TreesView extends Backbone.View<Backbone.Model> {
        private bActive: boolean = true;
        private views: Array<Backbone.View<Backbone.Model>>;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var that: TreesView = this;
            that.events = <any>{
                "click .nav-home": "_navHome",

            };
            that.delegateEvents();
            that.views = new Array<Backbone.View<Backbone.Model>>();
        }
        render(): any {
            var that: TreesView = this;
            // add a new view
            var template = _.template(Template.getInstance().getMainTreesViewTemplate());
            var data = {}
            that.$el.html(template(data));

            var view1: MapView = <MapView> MapViewFactory.getInstance().create(that.$('.panel-map'), true).render();
            that.views.push(view1);
            var view2: SideInfoView = <SideInfoView> SideViewFactory.getInstance().create(that.$('.panel-sideinfo')).render();
            view2.setMapView(view1);
            that.views.push(view2);
            return that;
        }

        getViews(): Array<Backbone.View<Backbone.Model>> {
            var that: TreesView = this;
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
}