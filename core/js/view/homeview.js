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
        }
        HomeView.prototype.render = function (args) {
            _super.prototype.render.call(this);
            var self = this;
            if (self.bDebug)
                console.log(HomeView.TAG + "render()");
            return self;
        };
        HomeView.prototype.update = function (args) {
            _super.prototype.update.call(this);
            var self = this;
            if (self.bDebug)
                console.log(HomeView.TAG + "update()");
            return self;
        };
        HomeView.TAG = "HomeView - ";
        return HomeView;
    })(FoodParent.BaseView);
    FoodParent.HomeView = HomeView;
})(FoodParent || (FoodParent = {}));
