module FoodParent {
    export class Model {
        private static _instance: Model = new Model();
        constructor() {
            if (Model._instance) {
                throw new Error("Error: Instantiation failed: Use Model.getInstance() instead of new.");
            }
            Model._instance = this;
        }
        public static getInstance(): Model {
            return Model._instance;
        }
    }
}