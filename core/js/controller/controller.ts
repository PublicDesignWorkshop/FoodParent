module FoodParent {
    export class Controller {
        private static _instance: Controller = new Controller();
        private current: number;
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
            var that: Controller = this;
            if (this.bDebug) console.log("loadTreesPage()");
            View.getInstance().SetViewType(MainViewType.TREES);
            View.getInstance().render();
        }
        public loadTreePage(id: number): void {
            var that: Controller = this;
            that.current = id;
            if (this.bDebug) console.log("loadTreePage(" + id + ")");
            View.getInstance().SetViewType(MainViewType.TREE);
            View.getInstance().render();
        }

        public loadPeoplePage(): void {
            if (this.bDebug) console.log("loadNotePage()");
            View.getInstance().SetViewType(MainViewType.PEOPLE);
            View.getInstance().render();
        }

        public updateGeoLocation(callback?: PositionCallback) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(callback);
            }
        }

        public fetchFood(id: number) {
            Model.getInstance().fetchFood(id);
        }

        public fetchTree(id: number, callback?: Function): void {
            Model.getInstance().fetchTree(id, callback);
        }

        public fetchTrees(bounds: L.LatLngBounds): void {
            Model.getInstance().fetchTrees(bounds);
        }

        public fetchFlags(callback?: Function, callback2?: Function): void {
            Model.getInstance().fetchFlags(callback, callback2);
        }

        public fetchTypes = (callback?: Function, callback2?: Function) => {
            Model.getInstance().fetchTypes(callback, callback2);
        }

        public fetchNotes(trees: Array<number>, size: number, offset: number, callback?: Function): void {
            Model.getInstance().fetchNotes(trees, size, offset, callback);
        }

        public setMapView(view: MapView): void {
            View.getInstance().setMapView(view);
        }

        public renderTreesOnMap(): void {
            View.getInstance().renderTreesOnMap(Model.getInstance().getTrees());
        }
        public getCurrent(): number {
            return Math.floor(this.current);
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
                "people": "people",
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
            Controller.getInstance().loadTreePage(id);
        }
        people() {
            console.log("we have loaded the people");
            Controller.getInstance().loadPeoplePage();
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