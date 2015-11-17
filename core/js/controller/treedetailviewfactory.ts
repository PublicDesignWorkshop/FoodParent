module FoodParent {
    export class TreeDetailViewFactory {
        private static _instance: TreeDetailViewFactory = new TreeDetailViewFactory();
        private baseUrl: string;
        constructor(args?: any) {
            if (TreeDetailViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use TreeDetailViewFactory.getInstance() instead of new.");
            }
            TreeDetailViewFactory._instance = this;
        }
        public static getInstance(): TreeDetailViewFactory {
            return TreeDetailViewFactory._instance;
        }
        public create(el: JQuery): Backbone.View<Backbone.Model> {
            return new TreeDetailView({ el: el });
        }
    }
} 