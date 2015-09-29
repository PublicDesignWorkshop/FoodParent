module FoodParent {
    export class Controller {
        private static _instance: Controller = new Controller();
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

        public loadTreesPage(): void {
            if (this.bDebug) console.log("loadTreesPage()");
            View.getInstance().SetViewType(MainViewType.TREES);
            View.getInstance().render();
        }
        public loadNotePage(): void {
            if (this.bDebug) console.log("loadNotePage()");
            View.getInstance().SetViewType(MainViewType.NOTE);
            View.getInstance().render();
        }

        public updateGeoLocation(callback?: PositionCallback) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(callback);
            }
        }
    }
    export class Router extends Backbone.Router {
        private static _instance: Router = new Router();
        constructor(options?: Backbone.RouterOptions) {
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
                //"donations": "donations",
                //"donation/:id": "donation",
            }
            super(options);
            

        }
        public static getInstance(): Router {
            return Router._instance;
        }
        
        home() {
            //console.log("we have loaded the home page");
            this.navigate("trees", { trigger: true, replace: true });
        }
        trees() {
            console.log("we have loaded the trees");
            Controller.getInstance().loadTreesPage();
        }
        tree(id: number) {
            console.log("we have loaded the tree id: " + id);
        }
        note() {
            console.log("we have loaded the note");
            Controller.getInstance().loadNotePage();
        }
        about() {
            console.log("we have loaded the note");
        }
        /*
        donations() {
            console.log("we have loaded the donations");
        }
        
        donation(id: number) {
            console.log("we have loaded the donation id: " + id);
        }
        */
    }
}  