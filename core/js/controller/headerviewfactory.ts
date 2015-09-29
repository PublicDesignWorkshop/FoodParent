module FoodParent {
    export class HeaderFactory {
        private static _instance: HeaderFactory = new HeaderFactory();
        private baseUrl: string;
        constructor(args?: any) {
            if (HeaderFactory._instance) {
                throw new Error("Error: Instantiation failed: Use HeaderFactory.getInstance() instead of new.");
            }
            HeaderFactory._instance = this;
        }
        public static getInstance(): HeaderFactory {
            return HeaderFactory._instance;
        }
        public create(el: JQuery): Backbone.View<Backbone.Model> {
            return new HeaderView({ el: el });
        }
    }
} 