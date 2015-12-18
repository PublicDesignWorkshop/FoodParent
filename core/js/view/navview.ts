module FoodParent {
    export class NavViewFractory {
        private static _instance: NavViewFractory = new NavViewFractory();
        private baseUrl: string;
        constructor(args?: any) {
            if (NavViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use NavViewFractory.getInstance() instead of new.");
            }
            NavViewFractory._instance = this;
        }
        public static getInstance(): NavViewFractory {
            return NavViewFractory._instance;
        }
        public static create(el: JQuery): NavView {
            var view: NavView = new NavView({ el: el });
            return view;
        }
    }

    export class NavView extends BaseView {
        private static TAG: string = "NavView - ";
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: NavView = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
        }
        public render(args?: any): any {
            super.render();
            var self: NavView = this;
            if (self.bDebug) console.log(NavView.TAG + "render()");

            var template = _.template(Template.getNavViewTemplate());
            var data = {

            }
            self.$el.html(template(data));
            return self;
        }

        public update(args?: any): any {
            super.update();
            var self: NavView = this;
            if (self.bDebug) console.log(NavView.TAG + "update()");
            return self;
        }

        public focusOnLeft(): void {
            var self: NavView = this;
            self.$('#background-nav-left').removeClass('nav-focus-right');
            self.$('#background-nav-left').addClass('nav-focus-left');
        }

        public focusOnRight(): void {
            var self: NavView = this;
            self.$('#background-nav-left').removeClass('nav-focus-left');
            self.$('#background-nav-left').addClass('nav-focus-right');
        }
    }
}