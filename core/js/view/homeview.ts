module FoodParent {
    export class HomeViewFractory {
        private static _instance: HomeViewFractory = new HomeViewFractory();
        private baseUrl: string;
        constructor(args?: any) {
            if (HomeViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use HomeViewFractory.getInstance() instead of new.");
            }
            HomeViewFractory._instance = this;
        }
        public static getInstance(): HomeViewFractory {
            return HomeViewFractory._instance;
        }
        public static create(el: JQuery): HomeView {
            var view: HomeView = new HomeView({ el: el });
            return view;
        }
    }

    export class HomeView extends BaseView {
        private static TAG: string = "HomeView - ";
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: HomeView = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = <any>{
                "mouseenter .home-menu-left": "_mouseEnter",
                "mouseenter .home-menu-right": "_mouseEnter",
                "click .home-menu-left": "_mouseClick",
                "click .home-menu-right": "_mouseClick",
            };
            self.delegateEvents();
        }
        public render(args?: any): any {
            super.render();
            var self: HomeView = this;
            if (self.bDebug) console.log(HomeView.TAG + "render()");

            var template = _.template(Template.getHomeViewTemplate());
            var data = {
                
            }
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-home'));
            return self;
        }

        public update(args?: any): any {
            super.update();
            var self: HomeView = this;
            if (self.bDebug) console.log(HomeView.TAG + "update()");
            return self;
        }
        private _mouseEnter(event: Event): void {
            var self: HomeView = this;
            EventHandler.handleMouseEnter($(event.currentTarget), self);
        }
        private _mouseClick(event: Event): void {
            var self: HomeView = this;
            EventHandler.handleMouseClick($(event.currentTarget), self);
        }
    }
}