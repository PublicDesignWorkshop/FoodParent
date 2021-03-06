var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var HomeViewFractory = (function () {
        function HomeViewFractory(args) {
            if (HomeViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use HomeViewFractory.getInstance() instead of new.");
            }
            HomeViewFractory._instance = this;
        }
        HomeViewFractory.getInstance = function () {
            return HomeViewFractory._instance;
        };
        HomeViewFractory.create = function (el) {
            var view = new HomeView({ el: el });
            return view;
        };
        HomeViewFractory._instance = new HomeViewFractory();
        return HomeViewFractory;
    })();
    FoodParent.HomeViewFractory = HomeViewFractory;
    var HomeView = (function (_super) {
        __extends(HomeView, _super);
        function HomeView(options) {
            _super.call(this, options);
            var self = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = {
                /* "mouseenter .home-menu-left": "_mouseEnter",
                 "mouseenter .home-menu-right": "_mouseEnter",
                 "click .home-menu-left": "_mouseClick",
                 "click .home-menu-right": "_mouseClick",
                 */
                "click .button-logo": "_mouseClick",
                "mouseenter .button-logo": "_mouseEnter",
                "mouseout .button-logo": "_mouseOut",
            };
            self.delegateEvents();
        }
        HomeView.prototype.render = function (args) {
            _super.prototype.render.call(this);
            var self = this;
            if (self.bDebug)
                console.log(HomeView.TAG + "render!!()");
            var template = _.template(FoodParent.Template.getHomeViewTemplate());
            var data = {
                image: FoodParent.Setting.getLogoSplashDefaultImage(),
                description: FoodParent.Setting.getApplicationDescription(),
            };
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-home'));
            self.resize();
            return self;
        };
        HomeView.prototype.update = function (args) {
            _super.prototype.update.call(this);
            var self = this;
            if (self.bDebug)
                console.log(HomeView.TAG + "update()");
            self.resize();
            return self;
        };
        HomeView.prototype.resize = function () {
            var self = this;
        };
        HomeView.prototype._mouseEnter = function (event) {
            var self = this;
            self.$('.button-logo').attr({ 'src': FoodParent.Setting.getLogoSplashMouseOverImage() });
        };
        HomeView.prototype._mouseOut = function (event) {
            var self = this;
            self.$('.button-logo').attr({ 'src': FoodParent.Setting.getLogoSplashDefaultImage() });
        };
        HomeView.prototype._mouseClick = function (event) {
            var self = this;
            //console.log($(event.currentTarget));
            FoodParent.EventHandler.handleMouseClick($(event.currentTarget), self);
        };
        HomeView.TAG = "HomeView - ";
        return HomeView;
    })(FoodParent.BaseView);
    FoodParent.HomeView = HomeView;
})(FoodParent || (FoodParent = {}));
