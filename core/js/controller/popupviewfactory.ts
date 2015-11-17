module FoodParent {
    export class PopupViewFactory {
        private static _instance: PopupViewFactory = new PopupViewFactory();
        private baseUrl: string;
        constructor(args?: any) {
            if (PopupViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use PopupViewFactory.getInstance() instead of new.");
            }
            PopupViewFactory._instance = this;
        }
        public static getInstance(): PopupViewFactory {
            return PopupViewFactory._instance;
        }
        public create(el: JQuery): Backbone.View<Backbone.Model> {
            return new PopupView({ el: el });
        }
    }
} 