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
            Controller._instance.xhrPool = new Array();
        }
        Controller.getInstance = function () {
            return Controller._instance;
        };
        Controller.pushXHR = function (xhr) {
            var self = Controller._instance;
            self.xhrPool.push(xhr);
        };
        Controller.removeXHR = function (xhr) {
            var self = Controller._instance;
            var index = self.xhrPool.indexOf(xhr);
            if (index > -1) {
                self.xhrPool.splice(index, 1);
            }
        };
        Controller.abortAllXHR = function () {
            var self = Controller._instance;
            console.log(self.xhrPool);
            $.each(self.xhrPool, function (index, xhr) {
                if (xhr != undefined) {
                    xhr.abort();
                }
            });
            self.xhrPool = new Array();
        };
        Controller.updateGeoLocation = function (success, error) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(success, error);
            }
            else {
            }
        };
        Controller.fetchAllTrees = function (success, error) {
            var xhr1 = FoodParent.Model.fetchAllFoods();
            var xhr2 = FoodParent.Model.fetchAllTrees();
            Controller.pushXHR(xhr1);
            Controller.pushXHR(xhr2);
            $.when(xhr1, xhr2).then(function () {
                Controller.removeXHR(xhr1);
                Controller.removeXHR(xhr2);
                if (success) {
                    success();
                }
            }, function () {
                Controller.removeXHR(xhr1);
                Controller.removeXHR(xhr2);
                if (error) {
                    error(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                }
            });
        };
        Controller.fetchAllFlagsAndOwners = function (success, error) {
            var xhr1 = FoodParent.Model.fetchAllFlags();
            var xhr2 = FoodParent.Model.fetchAllOwnerships();
            Controller.pushXHR(xhr1);
            Controller.pushXHR(xhr2);
            $.when(xhr1, xhr2).then(function () {
                Controller.removeXHR(xhr1);
                Controller.removeXHR(xhr2);
                if (success) {
                    success();
                }
            }, function () {
                Controller.removeXHR(xhr1);
                Controller.removeXHR(xhr2);
                if (error) {
                    error(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                }
            });
        };
        Controller.fetchNotesOfTrees = function (trees, size, offset, success, error) {
            var ids = new Array();
            $.each(trees, function (index, tree) {
                ids.push(tree.getId());
            });
            var xhr1 = FoodParent.Model.fetchNotesOfTrees(ids, size, offset);
            Controller.pushXHR(xhr1);
            $.when(xhr1).then(function () {
                Controller.removeXHR(xhr1);
                if (success) {
                    success();
                }
            }, function () {
                Controller.removeXHR(xhr1);
                if (error) {
                    error(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                }
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
                "mtrees/:viewMode/:id": "manageTrees",
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
        Router.prototype.manageTrees = function (viewMode, id) {
            console.log(Router.TAG + "we have loaded the manage trees page.");
            FoodParent.EventHandler.handleNavigate(FoodParent.VIEW_STATUS.MANAGE_TREES, { viewMode: viewMode, id: id });
        };
        Router._instance = new Router();
        Router.TAG = "Router - ";
        return Router;
    })(Backbone.Router);
    FoodParent.Router = Router;
})(FoodParent || (FoodParent = {}));
