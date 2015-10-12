module FoodParent {
    export class CoverflowViewFactory {
        private static _instance: CoverflowViewFactory = new CoverflowViewFactory();
        private baseUrl: string;
        constructor(args?: any) {
            if (CoverflowViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use CoverflowViewFactory.getInstance() instead of new.");
            }
            CoverflowViewFactory._instance = this;
        }
        public static getInstance(): CoverflowViewFactory {
            return CoverflowViewFactory._instance;
        }
        public create(el: JQuery): Backbone.View<Backbone.Model> {
            var view: CoverflowView = new CoverflowView({ el: el });
            return view;
        }
    }
} 