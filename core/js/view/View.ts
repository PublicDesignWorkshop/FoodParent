module FoodParent {
    export enum MainViewType {
        NONE, TREES, TREE, NOTE, ABOUT
    }
    export class View extends Backbone.View<Backbone.Model> {
        private static _instance: View = new View();
        private viewType: MainViewType;
        private currentHeaderView: Backbone.View<Backbone.Model>;
        private currentBodyView: Backbone.View<Backbone.Model>;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            if (View._instance) {
                throw new Error("Error: Instantiation failed: Use View.getInstance() instead of new.");
            }
            View._instance = this;
            var that: View = this;
        }
        public static setElement(options?: Backbone.ViewOptions<Backbone.Model>): void {
            View._instance.setElement(options.el);
        }
        public static getInstance(): View {
            return View._instance;
        }
        public SetViewType(viewType: MainViewType): void {
            this.viewType = viewType;
        }
        public getViewType(): MainViewType {
            return this.viewType;
        }
        render(): any {
            var that: View = this;
            // add a new view
            var template = _.template(Template.getInstance().getBaseTemplate());
            var data = {}
            that.$el.html(template(data));
            // render a new header view
            if (that.currentHeaderView != undefined) {
                that.currentHeaderView.destroy();
            }
            that.currentHeaderView = HeaderFactory.getInstance().create(that.$('#wrapper-main-header'));
            that.currentHeaderView.render();

            // render a new body view
            if (that.currentBodyView != undefined) {
                that.currentBodyView.destroy();
            }
            
            switch (that.viewType) {
                case MainViewType.TREES:
                    that.currentBodyView = TreesViewFactory.getInstance().create(that.$('#wrapper-main-body'));
                    that.currentBodyView.render();
                    break;
                case MainViewType.TREE:
                    break;
                case MainViewType.NOTE:
                    break;
                case MainViewType.ABOUT:
                    break;
            }

            
            return that;
        }
    }
}