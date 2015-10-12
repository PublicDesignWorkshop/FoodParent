module FoodParent {
    export class TreeViewFactory {
        private static _instance: TreeViewFactory = new TreeViewFactory();
        private baseUrl: string;
        constructor(args?: any) {
            if (TreeViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use TreeViewFactory.getInstance() instead of new.");
            }
            TreeViewFactory._instance = this;
        }
        public static getInstance(): TreeViewFactory {
            return TreeViewFactory._instance;
        }
        public create(el: JQuery, id: number): Backbone.View<Backbone.Model> {
            var view: TreeView = new TreeView({ el: el });
            view.setCurrent(id);
            return view;
        }
    }
} 