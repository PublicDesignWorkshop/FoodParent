module FoodParent {
    export class TreesViewFractory {
        private static _instance: TreesViewFractory = new TreesViewFractory();
        private baseUrl: string;
        constructor(args?: any) {
            if (TreesViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use TreesViewFractory.getInstance() instead of new.");
            }
            TreesViewFractory._instance = this;
        }
        public static getInstance(): TreesViewFractory {
            return TreesViewFractory._instance;
        }
        public static create(el: JQuery, viewMode: VIEW_MODE, id: number, credential: CREDENTIAL_MODE): TreesView {
            var view: TreesView;
            if (viewMode == VIEW_MODE.MAP) {
                if (credential == CREDENTIAL_MODE.GUEST) {
                    view = new TreesMapViewForGuest({ el: el });
                } else if (credential == CREDENTIAL_MODE.PARENT) {
                    view = new TreesMapViewForParent({ el: el });
                } else if (credential == CREDENTIAL_MODE.ADMIN) {
                    view = new TreesMapViewForAdmin({ el: el });
                }
                view.setTreeId(id);
            } else if (viewMode == VIEW_MODE.TABLE) {
                //view = new ManageTreesTableView({ el: el });
                view.setTreeId(id);
            }
            return view;
        }
    }

    export class TreesView extends BaseView {
        protected _id: number;
        public render(args?: any): any {
            super.render(args);
            var self: TreesView = this;
            return self;
        }
        public update(args?: any): any {
            super.update(args);
            var self: TreesView = this;
            return self;
        }
        public resize(): any {
            super.resize();
            var self: TreesView = this;
        }
        public setTreeId(id: number) {
            this._id = id;
        }
        public renderTreeInfo = (tree?: Tree) => { }
        public removeTreeInfo = () => { }
        public renderFilterList = () => { }
        public _applyFilter(event?: Event) { }
        public closeMapFilter = () => { }
        public panToCurrentLocation = () => { }
    }
}