var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var Controller = (function () {
        function Controller(args) {
            this.bDebug = true;
            if (Controller._instance) {
                throw new Error("Error: Instantiation failed: Use Controller.getInstance() instead of new.");
            }
            Controller._instance = this;
        }
        Controller.getInstance = function () {
            return Controller._instance;
        };
        Controller.updateGeoLocation = function (success, error) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(success, error);
            }
            else {
            }
        };
        Controller.fetchAllTrees = function (success, error) {
            $.when(FoodParent.Model.fetchAllFoods(), FoodParent.Model.fetchAllTrees()).then(function () {
                //console.log(Model.getTrees());
                //console.log(Model.getFoods());
            });
        };
        Controller._instance = new Controller();
        Controller.TAG = "Controller - ";
        return Controller;
    })();
    FoodParent.Controller = Controller;
    var Router = (function (_super) {
        __extends(Router, _super);
        function Router(options) {
            if (Router._instance) {
                throw new Error("Error: Instantiation failed: Use Router.getInstance() instead of new.");
            }
            Router._instance = this;
            // Setup Router parameters
            this.routes = {
                "": "home",
                "mtrees": "manageTrees",
                "ptrees": "parentTrees",
            };
            _super.call(this, options);
        }
        Router.getInstance = function () {
            return Router._instance;
        };
        Router.prototype.home = function () {
            console.log(Router.TAG + "we have loaded the home page.");
            FoodParent.EventHandler.handleNavigate(FoodParent.VIEW_STATUS.HOME);
        };
        Router.prototype.manageTrees = function () {
            console.log(Router.TAG + "we have loaded the manage trees page.");
            FoodParent.EventHandler.handleNavigate(FoodParent.VIEW_STATUS.MANAGE_TREES);
        };
        Router._instance = new Router();
        Router.TAG = "Router - ";
        return Router;
    })(Backbone.Router);
    FoodParent.Router = Router;
})(FoodParent || (FoodParent = {}));
