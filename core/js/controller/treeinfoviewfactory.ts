module FoodParent {
    export class TreeInfoViewFactory {
        private static _instance: TreeInfoViewFactory = new TreeInfoViewFactory();
        private baseUrl: string;
        constructor(args?: any) {
            if (TreeInfoViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use TreeInfoViewFactory.getInstance() instead of new.");
            }
            TreeInfoViewFactory._instance = this;
        }
        public static getInstance(): TreeInfoViewFactory {
            return TreeInfoViewFactory._instance;
        }
        public create(el: JQuery): Backbone.View<Backbone.Model> {
            var view: TreeInfoView = new TreeInfoView({ el: el });
            return view;
        }
    }
} 