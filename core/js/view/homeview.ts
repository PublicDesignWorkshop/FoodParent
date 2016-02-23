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
               "click .button-logo": "_mouseClick", // change to .class instead of using id
               "mouseenter .button-logo": "_mouseEnter",
               "mouseout .button-logo": "_mouseOut",
            };
            self.delegateEvents();
        }
        public render(args?: any): any {
            super.render();
            var self: HomeView = this;
            if (self.bDebug) console.log(HomeView.TAG + "render!!()");

            var template = _.template(Template.getHomeViewTemplate());
            var data = {
                image: Setting.getLogoSplashDefaultImage(),   //Setting.getCoreImageDir() + "logo-splash.png",: I create another to call the address of image file function in setting.ts file so that later we can change the setting file only if we want to change the name of the file.
                description: Setting.getApplicationDescription(),   //"Manage, parent, and care fruits",
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
        }
        private _mouseEnter(event: Event): void {
            var self: HomeView = this;
            self.$('.button-logo').attr({ 'src': Setting.getLogoSplashMouseOverImage() });
        }
        private _mouseOut(event: Event): void {
            var self: HomeView = this;
            self.$('.button-logo').attr({ 'src': Setting.getLogoSplashDefaultImage() });
        }
        private _mouseClick(event: Event): void {
            var self: HomeView = this;
            //console.log($(event.currentTarget));
            EventHandler.handleMouseClick($(event.currentTarget), self);
        }
    }
}