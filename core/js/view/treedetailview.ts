module FoodParent {
    export class TreeDetailView extends Backbone.View<Backbone.Model> {
        private bActive: boolean = true;
        private tree: Tree;
        private views: Array<Backbone.View<Backbone.Model>>;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var that: TreeDetailView = this;
            that.events = <any>{
                "click .nav-home": "_navHome",

            };
            that.delegateEvents();
            that.views = new Array<Backbone.View<Backbone.Model>>();
        }
        render(): any {
            var that: TreeDetailView = this;
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

        customRender(tree: Tree): void {
            var that: TreeDetailView = this;
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

                $('#edit-parents').off('click');
                $('#edit-parents').on('click', function () {
                    View.getInstance().getPopupView().renderEditParent(that.tree);
                    View.getInstance().getPopupView().SetVisibility(true);
                });
            }
        }

        getViews(): Array<Backbone.View<Backbone.Model>> {
            var that: TreeDetailView = this;
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