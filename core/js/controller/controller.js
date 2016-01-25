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
            this.fetchTypes = function (callback, callback2) {
                FoodParent.Model.getInstance().fetchTypes(callback, callback2);
            };
            if (Controller._instance) {
                throw new Error("Error: Instantiation failed: Use Controller.getInstance() instead of new.");
            }
            Controller._instance = this;
        }
        Controller.getInstance = function () {
            return Controller._instance;
        };
        Controller.prototype.loadTreesPage = function () {
            var that = this;
            if (this.bDebug)
                console.log("loadTreesPage()");
            FoodParent.View.getInstance().SetViewType(FoodParent.MainViewType.TREES);
            FoodParent.View.getInstance().render();
        };
        Controller.prototype.loadTreePage = function (id) {
            var that = this;
            that.current = id;
            if (this.bDebug)
                console.log("loadTreePage(" + id + ")");
            FoodParent.View.getInstance().SetViewType(FoodParent.MainViewType.TREE);
            FoodParent.View.getInstance().render();
        };
        Controller.prototype.loadPeoplePage = function () {
            if (this.bDebug)
                console.log("loadNotePage()");
            FoodParent.View.getInstance().SetViewType(FoodParent.MainViewType.PEOPLE);
            FoodParent.View.getInstance().render();
        };
        Controller.prototype.updateGeoLocation = function (callback) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(callback);
            }
        };
        Controller.prototype.fetchFood = function (id) {
            FoodParent.Model.getInstance().fetchFood(id);
        };
        Controller.prototype.fetchTree = function (id, callback) {
            FoodParent.Model.getInstance().fetchTree(id, callback);
        };
        Controller.prototype.fetchTrees = function (bounds) {
            FoodParent.Model.getInstance().fetchTrees(bounds);
        };
        Controller.prototype.fetchFlags = function (callback, callback2) {
            FoodParent.Model.getInstance().fetchFlags(callback, callback2);
        };
        Controller.prototype.fetchNotes = function (trees, size, offset, callback) {
            FoodParent.Model.getInstance().fetchNotes(trees, size, offset, callback);
        };
        Controller.prototype.setMapView = function (view) {
            FoodParent.View.getInstance().setMapView(view);
        };
        Controller.prototype.renderTreesOnMap = function () {
            FoodParent.View.getInstance().renderTreesOnMap(FoodParent.Model.getInstance().getTrees());
        };
        Controller.prototype.getCurrent = function () {
            return Math.floor(this.current);
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
            this.routes = {
                "": "home",
                "trees": "trees",
                "tree/:id": "tree",
                "people": "people",
                "about": "about",
            };
            _super.call(this, options);
        }
        Router.getInstance = function () {
            return Router._instance;
        };
        Router.prototype.home = function () {
            this.navigate("trees", { trigger: true, replace: true });
        };
        Router.prototype.trees = function () {
            console.log("we have loaded the trees");
            Controller.getInstance().loadTreesPage();
        };
        Router.prototype.tree = function (id) {
            console.log("we have loaded the tree id: " + id);
            Controller.getInstance().loadTreePage(id);
        };
        Router.prototype.people = function () {
            console.log("we have loaded the people");
            Controller.getInstance().loadPeoplePage();
        };
        Router.prototype.about = function () {
            console.log("we have loaded the note");
        };
        Router._instance = new Router();
        return Router;
    })(Backbone.Router);
    FoodParent.Router = Router;
})(FoodParent || (FoodParent = {}));
