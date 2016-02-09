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
               /* "mouseenter .home-menu-left": "_mouseEnter",
                "mouseenter .home-menu-right": "_mouseEnter",
                "click .home-menu-left": "_mouseClick",
                "click .home-menu-right": "_mouseClick",
                */
               "click #wrapper-logo": "_mouseClick",
            };
            self.delegateEvents();
        }
        public render(args?: any): any {
            super.render();
            var self: HomeView = this;
            if (self.bDebug) console.log(HomeView.TAG + "render!!()");

            var template = _.template(Template.getHomeViewTemplate());
            var data = {
                image: Setting.getCoreImageDir() + "logo-splash.png",
                description: "Manage, parent, and care fruits",
            }
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-home'));
            self.resize();
            return self;
        }

        public update(args?: any): any {
            super.update();
            var self: HomeView = this;
            if (self.bDebug) console.log(HomeView.TAG + "update()");
            self.resize();
            return self;
        }

        public resize(): any {
            var self: HomeView = this;
            self.$('.title-left').css({ 'font-size': Math.floor(self.getWidth() * 0.15) + 'px' });
            self.$('.title-right').css({ 'font-size': Math.floor(self.getWidth() * 0.15) + 'px' });
            self.$('.enter-left').css({ 'font-size': Math.floor(self.getWidth() * 0.15 * 0.2) + 'px' });
        }
        private _mouseEnter(event: Event): void {
            var self: HomeView = this;
            EventHandler.handleMouseEnter($(event.currentTarget), self);
        }
        private _mouseClick(event: Event): void {
            var self: HomeView = this;
            //console.log($(event.currentTarget));
            EventHandler.handleMouseClick($(event.currentTarget), self);
        }
    }
}