module FoodParent {
    export class HeaderView extends Backbone.View<Backbone.Model> {
        private bActive: boolean = true;
        private views: Array<Backbone.View<Backbone.Model>>;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var that: HeaderView = this;
            that.events = <any>{
                "click .nav-home": "_navHome",
                "click .nav-trees": "_navTrees",
                "click .nav-note": "_navNote",
                "click .nav-about": "_navAbout",
                
            };
            that.delegateEvents();
            that.views = new Array<Backbone.View<Backbone.Model>>();
        }
        render(): any {
            var that: HeaderView = this;
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

        _navHome(event: Event): void {
            event.preventDefault();
            Router.getInstance().navigate("home", { trigger: true, replace: false });
        }
        _navTrees(event: Event): void {
            event.preventDefault();
            Router.getInstance().navigate("trees", { trigger: true, replace: false });
        }
        _navNote(event: Event): void {
            event.preventDefault();
            Router.getInstance().navigate("note", { trigger: true, replace: false });
        }
        _navAbout(event: Event): void {
            event.preventDefault();
            Router.getInstance().navigate("about", { trigger: true, replace: false });
        }


    }
}