module FoodParent {
    export class TreesViewFactory {
        private static _instance: TreesViewFactory = new TreesViewFactory();
        private baseUrl: string;
        constructor(args?: any) {
            if (TreesViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use TreesViewFactory.getInstance() instead of new.");
            }
            TreesViewFactory._instance = this;
        }
        public static getInstance(): TreesViewFactory {
            return TreesViewFactory._instance;
        }
        public create(el: JQuery): Backbone.View<Backbone.Model> {
            return new TreesView({ el: el });
        }
    }
} 