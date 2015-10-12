module FoodParent {
    export class Model {
        private static _instance: Model = new Model();
        private foods: Foods;
        private trees: Trees;
        private flags: Flags;
        private ownerships: Ownerships;
        private notes: Notes;
        constructor() {
            var that: Model = this;
            if (Model._instance) {
                throw new Error("Error: Instantiation failed: Use Model.getInstance() instead of new.");
            }
            Model._instance = this;
        }
        public static getInstance(): Model {
            return Model._instance;
        }
        public getFoods(): Foods {
            return this.foods;
        }
        public getTrees(): Trees {
            return this.trees;
        }
        public getOwnerships(): Ownerships {
            return this.ownerships;
        }
        public getFlags(): Flags {
            return this.flags;
        }
        public getNotes(): Notes {
            return this.notes;
        }

        public fetchFood(id: number): void {
            var that: Model = this;
            if (that.foods == undefined) {
                that.foods = new Foods();
            }
            
            that.foods.fetch({
                remove: false,	// if remove == false, it only adds new items, not removing old items.
                processData: true,
                data: {
                    // Passing boundary lat / lng to the server to update only item within the boundary, but it's not currently used for now.
                    id: id,
                },
                success(collection?: any, response?: any, options?: any): void {
                    console.log("success fetch with " + collection.models.length + " items");
                    console.log(that.foods);
                },
                error(collection?: any, jqxhr?: JQueryXHR, options?: any): void {
                    console.log("error while fetching item data from the server");
                }
            });
        }

        public fetchTree(id: number, callback?: Function): void {
            var that: Model = this;
            if (that.trees == undefined) {
                that.trees = new Trees();
            }
            if (that.foods == undefined) {
                that.foods = new Foods();
            }

            that.trees.fetch({
                remove: false,	// if remove == false, it only adds new items, not removing old items.
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
                    that.fetchFoods(that.foods.getUndetectedIds(that.trees.getFoodIds()), callback);
                },
                error(collection?: any, jqxhr?: JQueryXHR, options?: any): void {
                    console.log("error while fetching item data from the server");
                    if (callback != undefined) {
                        callback();
                    }
                }
            });
        }

        // fetch tree data from the server.
        public fetchTrees(bounds: L.LatLngBounds): void {
            var that: Model = this;
            if (that.trees == undefined) {
                that.trees = new Trees();
            }
            if (that.foods == undefined) {
                that.foods = new Foods();
            }

            that.trees.fetch({
                remove: false,	// if remove == false, it only adds new items, not removing old items.
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
                    that.fetchFoods(that.foods.getUndetectedIds(that.trees.getFoodIds()));
                },
                error(collection?: any, jqxhr?: JQueryXHR, options?: any): void {
                    console.log("error while fetching item data from the server");
                }
            });
        }

        public fetchFoods(ids: Array<number>, callback?: Function): void {
            var that: Model = this;
            if (that.foods == undefined) {
                that.foods = new Foods();
            }
            if (ids.length != 0) {
                that.foods.fetch({
                    remove: false,	// if remove == false, it only adds new items, not removing old items.
                    processData: true,
                    data: {
                        // Passing boundary lat / lng to the server to update only item within the boundary, but it's not currently used for now.
                        ids: ids.toString(),
                    },
                    success(collection?: any, response?: any, options?: any): void {
                        console.log("success fetch with " + collection.models.length + " foods");
                        Controller.getInstance().renderTreesOnMap();
                        if (callback != undefined) {
                            callback();
                        }
                    },
                    error(collection?: any, jqxhr?: JQueryXHR, options?: any): void {
                        console.log("error while fetching item data from the server");
                    }
                });
            } else {
                Controller.getInstance().renderTreesOnMap();
                if (callback != undefined) {
                    callback();
                }
            }
        }

        public fetchFlags(callback?: Function, callback2?: Function): void {
            var that: Model = this;
            if (that.flags == undefined) {
                that.flags = new Flags();
                that.flags.fetch({
                    remove: false,	// if remove == false, it only adds new items, not removing old items.
                    processData: true,
                    data: {

                    },
                    success(collection?: any, response?: any, options?: any): void {
                        console.log("success fetch with " + collection.models.length + " flags");
                        if (callback != undefined) {
                            callback(callback2);
                        }
                    },
                    error(collection?: any, jqxhr?: JQueryXHR, options?: any): void {
                        console.log("error while fetching item data from the server");
                    }
                });
            } else {
                //console.log("flags are already exist.");
                if (callback != undefined) {
                    callback(callback2);
                }
            }
            
        }

        public fetchTypes(callback?: Function, callback2?: Function): void {
            var that: Model = this;
            if (that.ownerships == undefined) {
                that.ownerships = new Ownerships();

                that.ownerships.fetch({
                    remove: false,	// if remove == false, it only adds new items, not removing old items.
                    processData: true,
                    data: {

                    },
                    success(collection?: any, response?: any, options?: any): void {
                        console.log("success fetch with " + collection.models.length + " types");
                        if (callback != undefined) {
                            callback(callback2);
                        }
                    },
                    error(collection?: any, jqxhr?: JQueryXHR, options?: any): void {
                        console.log("error while fetching item data from the server");
                    }
                });
            } else {
                //console.log("types are already exist.");
                if (callback != undefined) {
                    callback(callback2);
                }
            }
        }

        public fetchNotes(trees: Array<number>, size: number, offset: number, callback?: Function): void {
            var that: Model = this;
            if (that.notes == undefined) {
                that.notes = new Notes();
            }
            if (trees.length != 0) {
                that.notes.fetch({
                    remove: false,	// if remove == false, it only adds new items, not removing old items.
                    processData: true,
                    data: {
                        // Passing boundary lat / lng to the server to update only item within the boundary, but it's not currently used for now.
                        trees: trees.toString(),
                        size: size,
                        offset: offset,
                    },
                    success(collection?: any, response?: any, options?: any): void {
                        console.log("success fetch with " + collection.models.length + " notes");
                        //Controller.getInstance().renderTreesOnMap();
                        if (callback != undefined) {
                            callback();
                        }
                    },
                    error(collection?: any, jqxhr?: JQueryXHR, options?: any): void {
                        console.log("error while fetching item data from the server");
                    }
                });
            } else {
                //Controller.getInstance().renderTreesOnMap();
                if (callback != undefined) {
                    callback();
                }
            }
        }
    }
}