module FoodParent {
    export class SideInfoView extends Backbone.View<Backbone.Model> {
        private bActive: boolean = true;
        private views: Array<Backbone.View<Backbone.Model>>;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var that: SideInfoView = this;
            that.events = <any>{
                "click .nav-home": "_navHome",

            };
            that.delegateEvents();
            that.views = new Array<Backbone.View<Backbone.Model>>();
        }
        render(): any {
            var that: SideInfoView = this;
            // add a new view
            var template = _.template(Template.getInstance().getMainHeaderTemplate());
            var data = {
                site: Localization.getInstance().getSiteText(),
                trees: Localization.getInstance().getTreesText(),
                note: Localization.getInstance().getNoteText(),
                about: Localization.getInstance().getAboutText(),
            }
            that.$el.html(template(data));


            return that;
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