module FoodParent {
    export class SideViewFactory {
        private static _instance: SideViewFactory = new SideViewFactory();
        private baseUrl: string;
        constructor(args?: any) {
            if (SideViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use SideViewFactory.getInstance() instead of new.");
            }
            SideViewFactory._instance = this;
        }
        public static getInstance(): SideViewFactory {
            return SideViewFactory._instance;
        }
        public create(el: JQuery): Backbone.View<Backbone.Model> {
            return new SideInfoView({ el: el });
        }
    }
} 