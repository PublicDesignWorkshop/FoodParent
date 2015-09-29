var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
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
        Controller.prototype.loadTreesPage = function () {
            if (this.bDebug)
                console.log("loadTreesPage()");
            FoodParent.View.getInstance().SetViewType(FoodParent.MainViewType.TREES);
            FoodParent.View.getInstance().render();
        };
        Controller.prototype.loadNotePage = function () {
            if (this.bDebug)
                console.log("loadNotePage()");
            FoodParent.View.getInstance().SetViewType(FoodParent.MainViewType.NOTE);
            FoodParent.View.getInstance().render();
        };
        Controller.prototype.updateGeoLocation = function (callback) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(callback);
            }
        };
        Controller._instance = new Controller();
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
                "trees": "trees",
                "tree/:id": "tree",
                "note": "note",
                "about": "about",
            };
            _super.call(this, options);
        }
        Router.getInstance = function () {
            return Router._instance;
        };
        Router.prototype.home = function () {
            //console.log("we have loaded the home page");
            this.navigate("trees", { trigger: true, replace: true });
        };
        Router.prototype.trees = function () {
            console.log("we have loaded the trees");
            Controller.getInstance().loadTreesPage();
        };
        Router.prototype.tree = function (id) {
            console.log("we have loaded the tree id: " + id);
        };
        Router.prototype.note = function () {
            console.log("we have loaded the note");
            Controller.getInstance().loadNotePage();
        };
        Router.prototype.about = function () {
            console.log("we have loaded the note");
        };
        Router._instance = new Router();
        return Router;
    })(Backbone.Router);
    FoodParent.Router = Router;
})(FoodParent || (FoodParent = {}));
//# sourceMappingURL=controller.js.map