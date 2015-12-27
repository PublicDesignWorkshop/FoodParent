module FoodParent {
    export class Controller {
        private static _instance: Controller = new Controller();
        private static TAG: string = "Controller - ";
        private bDebug: boolean = true;
        constructor(args?: any) {
            if (Controller._instance) {
                throw new Error("Error: Instantiation failed: Use Controller.getInstance() instead of new.");
            }
            Controller._instance = this;
        }
        public static getInstance(): Controller {
            return Controller._instance;
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
        public static fetchAllTrees(success?: Function, error?: Function) {
            $.when(
                Model.fetchAllFoods(), Model.fetchAllTrees()
            ).then(function () {
                //console.log(Model.getTrees());
                //console.log(Model.getFoods());
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