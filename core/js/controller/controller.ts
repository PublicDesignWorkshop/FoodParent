module FoodParent {
    export class Controller {
        private static _instance: Controller = new Controller();
        private static TAG: string = "Controller - ";
        private bDebug: boolean = true;
        private xhrPool: Array<JQueryXHR>;
        constructor(args?: any) {
            if (Controller._instance) {
                throw new Error("Error: Instantiation failed: Use Controller.getInstance() instead of new.");
            }
            Controller._instance = this;
            Controller._instance.xhrPool = new Array<JQueryXHR>();
        }
        public static getInstance(): Controller {
            return Controller._instance;
        }
        public static pushXHR(xhr: JQueryXHR) {
            var self: Controller = Controller._instance;
            self.xhrPool.push(xhr);
        }
        public static removeXHR(xhr: JQueryXHR) {
            var self: Controller = Controller._instance;
            var index = self.xhrPool.indexOf(xhr);
            if (index > -1) {
                self.xhrPool.splice(index, 1);
            }
        }
        public static abortAllXHR() {
            var self: Controller = Controller._instance;
            console.log(self.xhrPool);
            $.each(self.xhrPool, function (index: number, xhr: JQueryXHR) {
                if (xhr != undefined) {
                    xhr.abort();
                }
            });
            self.xhrPool = new Array<JQueryXHR>();
        }
        public static updateGeoLocation(success?: PositionCallback, error?: PositionErrorCallback) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(success, error);
            } else {
                /*  Modern browser doesn't reach since it already supports geolocation service.
                if (success) {
                    success({ coords: { accuracy: 4196, altitude: null, altitudeAccuracy: null, heading: null, latitude: 33.7946333, longitude: -84.448771, speed: null }, timestamp: new Date().valueOf() });
                }
                */
            }
        }
        public static fetchAllTrees(success?: any, error?: any) {
            var xhr1: JQueryXHR = Model.fetchAllFoods();
            var xhr2: JQueryXHR = Model.fetchAllTrees();
            Controller.pushXHR(xhr1);
            Controller.pushXHR(xhr2);
            $.when(
                xhr1, xhr2
            ).then(function () {
                Controller.removeXHR(xhr1);
                Controller.removeXHR(xhr2);
                if (success) {
                    success();
                }
            }, function () {
                Controller.removeXHR(xhr1);
                Controller.removeXHR(xhr2);
                if (error) {
                    error(ERROR_MODE.SEVER_CONNECTION_ERROR);
                }
            });
        }
        public static fetchAllFlagsAndOwners(success?: any, error?: any) {
            var xhr1: JQueryXHR = Model.fetchAllFlags();
            var xhr2: JQueryXHR = Model.fetchAllOwnerships();
            Controller.pushXHR(xhr1);
            Controller.pushXHR(xhr2);
            $.when(
                xhr1, xhr2
            ).then(function () {
                Controller.removeXHR(xhr1);
                Controller.removeXHR(xhr2);
                if (success) {
                    success();
                }
            }, function () {
                Controller.removeXHR(xhr1);
                Controller.removeXHR(xhr2);
                if (error) {
                    error(ERROR_MODE.SEVER_CONNECTION_ERROR);
                }
            });
        }
    }

    export class Router extends Backbone.Router {
        private static _instance: Router = new Router();
        private static TAG: string = "Router - ";
        constructor(options?: Backbone.RouterOptions) {
            if (Router._instance) {
                throw new Error("Error: Instantiation failed: Use Router.getInstance() instead of new.");
            }
            Router._instance = this;
            // Setup Router parameters
            this.routes = {
                "": "home",
                "mtrees": "manageTrees",
                "ptrees": "parentTrees",
            }
            super(options);
        }
        public static getInstance(): Router {
            return Router._instance;
        }
        home() {
            console.log(Router.TAG + "we have loaded the home page.");
            EventHandler.handleNavigate(VIEW_STATUS.HOME);
        }
        manageTrees() {
            console.log(Router.TAG + "we have loaded the manage trees page.");
            EventHandler.handleNavigate(VIEW_STATUS.MANAGE_TREES);
        }
    }
} 