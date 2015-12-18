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
            }
            super(options);
        }
        public static getInstance(): Router {
            return Router._instance;
        }
        home() {
            console.log(Router.TAG + "we have loaded the home page.");
            View.addChild(HomeViewFractory.create($('#wrapper-main')).render());
        }
    }
} 