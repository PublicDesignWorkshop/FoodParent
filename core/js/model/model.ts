module FoodParent {
    export class Model {
        private static _instance: Model = new Model();
        private static TAG: string = "Model - ";
        private bDebug: boolean = true;
        private auths: Auths;
        private foods: Foods;
        private adopts: Adopts;
        private trees: Trees;
        constructor(args?: any) {
            if (Model._instance) {
                throw new Error("Error: Instantiation failed: Use Model.getInstance() instead of new.");
            }
            Model._instance = this;
        }
        public static getInstance(): Model {
            return Model._instance;
        }
        public static getAdopts(): Adopts {
            var self: Model = Model._instance;
            if (self.adopts == undefined) {
                self.adopts = new Adopts();
            }
            return self.adopts;
        }
        public static getFoods(): Foods {
            var self: Model = Model._instance;
            if (self.foods == undefined) {
                self.foods = new Foods();
            }
            return self.foods;
        }
        public static getAuths(): Auths {
            var self: Model = Model._instance;
            if (self.auths == undefined) {
                self.auths = new Auths();
            }
            return self.auths;
        }
        public static getTrees(): Trees {
            var self: Model = Model._instance;
            if (self.trees == undefined) {
                self.trees = new Trees();
            }
            return self.trees;
        }

        public static fetchAuths(): void {
            console.log(Model.TAG + "fetchAuths()");
            var self: Model = Model._instance;
            if (self.auths == undefined) {
                self.auths = new Auths();
                var auth1: Auth = new Auth({ id: 1, name: "ConcreteJungle" });
                auth1.id = 1;
                var auth2: Auth = new Auth({ id: 2, name: "Participant" });
                auth2.id = 2;
                var auth3: Auth = new Auth({ id: 3, name: "Manager" });
                auth3.id = 3;
                var auth4: Auth = new Auth({ id: 4, name: "Unkown" });
                auth4.id = 4;
                self.auths.add(auth1);
                self.auths.add(auth2);
                self.auths.add(auth3);
                self.auths.add(auth4);
            }
        }
        /*
        public static fetchFood(id: number): void {
            var self: Model = Model._instance;
            if (self.foods == undefined) {
                self.foods = new Foods();
            }

            self.foods.fetch({
                remove: true,	// if remove == false, it only adds new items, not removing old items.
                processData: true,
                data: {
                    id: id,
                },
                success(collection?: any, response?: any, options?: any): void {
                    console.log("success fetch with " + collection.models.length + " items");
                },
                error(collection?: any, jqxhr?: JQueryXHR, options?: any): void {
                    console.log("error while fetching item data from the server");
                }
            });
        }
        public fetchFoods(ids: Array<number>): void {
            var self: Model = Model._instance;
            if (self.foods == undefined) {
                self.foods = new Foods();
            }
            if (ids.length != 0) {
                self.foods.fetch({
                    remove: true,	// if remove == false, it only adds new items, not removing old items.
                    processData: true,
                    data: {
                        ids: ids.toString(),
                    },
                    success(collection?: any, response?: any, options?: any): void {
                        console.log("success fetch with " + collection.models.length + " foods");
                    },
                    error(collection?: any, jqxhr?: JQueryXHR, options?: any): void {
                        console.log("error while fetching item data from the server");
                    }
                });
            }
        }
        */
        /*
        public static fetchTree(id: number): void {
            var self: Model = Model._instance;
            if (self.trees == undefined) {
                self.trees = new Trees();
            }

            self.trees.fetch({
                remove: true,	// if remove == false, it only adds new items, not removing old items.
                processData: true,
                data: {
                    // Passing boundary lat / lng to the server to update only item within the boundary, but it's not currently used for now.
                    id: id,
                    south: 0,
                    north: 0,
                    west: 0,
                    east: 0,
                },
                success(collection?: any, response?: any, options?: any): void {
                    console.log("success fetch with " + collection.models.length + " trees");
                    //that.fetchFoods(that.foods.getUndetectedIds(that.trees.getFoodIds()), callback);
                },
                error(collection?: any, jqxhr?: JQueryXHR, options?: any): void {
                    console.log("error while fetching item data from the server");
                }
            });
        }
        */
        /*
        // fetch tree data from the server.
        public fetchTrees(bounds: L.LatLngBounds): void {
            var self: Model = Model._instance;
            if (self.trees == undefined) {
                self.trees = new Trees();
            }
            if (self.foods == undefined) {
                self.foods = new Foods();
            }

            self.trees.fetch({
                remove: true,	// if remove == false, it only adds new items, not removing old items.
                processData: true,
                data: {
                    // Passing boundary lat / lng to the server to update only item within the boundary, but it's not currently used for now.
                    id: -1,
                    south: bounds.getSouthEast().lat,
                    north: bounds.getNorthEast().lat,
                    west: bounds.getSouthWest().lng,
                    east: bounds.getSouthEast().lng,
                },
                success(collection?: any, response?: any, options?: any): void {
                    console.log("success fetch with " + collection.models.length + " trees");
                    //that.fetchFoods(that.foods.getUndetectedIds(that.trees.getFoodIds()));
                },
                error(collection?: any, jqxhr?: JQueryXHR, options?: any): void {
                    console.log("error while fetching item data from the server");
                }
            });
        }
        */

        public static fetchAllFoods(): JQueryXHR {
            var self: Model = Model._instance;
            if (self.foods == undefined) {
                self.foods = new Foods();
            }
            return self.foods.fetch({
                remove: true,	// if remove == false, it only adds new items, not removing old items.
                processData: true,
                data: {
                    mode: 2,    // 0: fetch only 1, 1: fetch all ids, 2: fetch all
                    ids: 0,
                    id: 0,
                },
                success(collection?: any, response?: any, options?: any): void {
                    console.log("success fetch with " + collection.models.length + " foods");
                },
                error(collection?: any, jqxhr?: JQueryXHR, options?: any): void {
                    console.log("error while fetching item data from the server");
                }
            });
        }

        public static fetchAllTrees(): JQueryXHR {
            var self: Model = Model._instance;
            if (self.trees == undefined) {
                self.trees = new Trees();
            }
            if (self.foods == undefined) {
                self.foods = new Foods();
            }

            return self.trees.fetch({
                remove: true,	// if remove == false, it only adds new items, not removing old items.
                processData: true,
                data: {
                    mode: 2,    // 0: fetch only 1, 1: fetch all in bound, 2: fetch all
                    id: 0,
                    south: 0,
                    north: 0,
                    west: 0,
                    east: 0,
                },
                success(collection?: any, response?: any, options?: any): void {
                    console.log("success fetch with " + collection.models.length + " trees");
                    //that.fetchFoods(that.foods.getUndetectedIds(that.trees.getFoodIds()));
                },
                error(collection?: any, jqxhr?: JQueryXHR, options?: any): void {
                    console.log("error while fetching item data from the server");
                }
            });
        }
    }
}