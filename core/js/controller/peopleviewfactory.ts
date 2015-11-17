module FoodParent {
    export class PeopleViewFactory {
        private static _instance: PeopleViewFactory = new PeopleViewFactory();
        private baseUrl: string;
        constructor(args?: any) {
            if (PeopleViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use PeopleViewFactory.getInstance() instead of new.");
            }
            PeopleViewFactory._instance = this;
        }
        public static getInstance(): PeopleViewFactory {
            return PeopleViewFactory._instance;
        }
        public create(el: JQuery): Backbone.View<Backbone.Model> {
            return new PeopleView({ el: el });
        }
    }

    export class PersonsViewFactory {
        private static _instance: PersonsViewFactory = new PersonsViewFactory();
        private baseUrl: string;
        constructor(args?: any) {
            if (PersonsViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use PersonsViewFactory.getInstance() instead of new.");
            }
            PersonsViewFactory._instance = this;
        }
        public static getInstance(): PersonsViewFactory {
            return PersonsViewFactory._instance;
        }
        public create(el: JQuery): Backbone.View<Backbone.Model> {
            return new PersonsView({ el: el });
        }
    }
} 