module FoodParent {
    export class Model {
        private static _instance: Model = new Model();
        private adopts: Adopts;
        private auths: Auths;
        private foods: Foods;
        private trees: Trees;
        private flags: Flags;
        private ownerships: Ownerships;
        private notes: Notes;
        private persons: Persons;
        constructor() {
            var that: Model = this;
            if (Model._instance) {
                throw new Error("Error: Instantiation failed: Use Model.getInstance() instead of new.");
            }
            Model._instance = this;
            that.fetchAuths();
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

        public getAuths(): Auths {
            return this.auths;
        }
        public getPersons(): Persons {
            return this.persons;
        }
        public getAdopts(): Adopts {
            return this.adopts;
        }

        public fetchAuths(): void {
            console.log("Fetch Authorizations");
            var that: Model = this;
            if (that.auths == undefined) {
                that.auths = new Auths();
                var auth1: Auth = new Auth({ id: 1, name: "ConcreteJungle" });
                auth1.id = 1;
                var auth2: Auth = new Auth({ id: 2, name: "Participant" });
                auth2.id = 2;
                var auth3: Auth = new Auth({ id: 3, name: "Manager" });
                auth3.id = 3;
                var auth4: Auth = new Auth({ id: 4, name: "Unkown" });
                auth4.id = 4;
                that.auths.add(auth1);
                that.auths.add(auth2);
                that.auths.add(auth3);
                that.auths.add(auth4);
            }
        }
        
        public fetchAdopts(callback?: Function): void {
            var that: Model = this;
            if (that.adopts == undefined) {
                that.adopts = new Adopts();
            }

            that.adopts.fetch({
                remove: true,	// if remove == false, it only adds new items, not removing old items.
                processData: true,
                data: {

                },
                success(collection?: any, response?: any, options?: any): void {
                    console.log("success fetch with " + collection.models.length + " adopt items");
                    if (callback != undefined) {
                        callback();
                    }
                },
                error(collection?: any, jqxhr?: JQueryXHR, options?: any): void {
                    console.log("error while fetching item data from the server");
                }
            });
        }

        public fetchPersons(callback?: Function): void {
            var that: Model = this;
            if (that.persons == undefined) {
                that.persons = new Persons();
            }

            that.persons.fetch({
                remove: true,	// if remove == false, it only adds new items, not removing old items.
                processData: true,
                data: {

                },
                success(collection?: any, response?: any, options?: any): void {
                    console.log("success fetch with " + collection.models.length + " items");
                    if (callback != undefined) {
                        callback();
                    }
                },
                error(collection?: any, jqxhr?: JQueryXHR, options?: any): void {
                    console.log("error while fetching item data from the server");
                }
            });
        }

        public fetchFood(id: number): void {
            var that: Model = this;
            if (that.foods == undefined) {
                that.foods = new Foods();
            }
            
            that.foods.fetch({
                remove: true,	// if remove == false, it only adds new items, not removing old items.
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
        public fetchTrees(bounds: L.LatLngBounds, callback?: Function): void {
            var that: Model = this;
            if (that.trees == undefined) {
                that.trees = new Trees();
            }
            if (that.foods == undefined) {
                that.foods = new Foods();
            }

            that.trees.fetch({
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
                    that.fetchFoods(that.foods.getUndetectedIds(that.trees.getFoodIds()));
                    if (callback != undefined) {
                        callback();
                    }
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
                    remove: true,	// if remove == false, it only adds new items, not removing old items.
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

        public fetchFoods2(callback?: Function): void {
            var that: Model = this;
            if (that.foods == undefined) {
                that.foods = new Foods();
            }
            that.foods.fetch({
                remove: true,	// if remove == false, it only adds new items, not removing old items.
                processData: true,
                data: {
                    // Passing boundary lat / lng to the server to update only item within the boundary, but it's not currently used for now.
                    ids: [-1].toString(),
                },
                success(collection?: any, response?: any, options?: any): void {
                    console.log("success fetch with " + collection.models.length + " foods");
                    if (callback != undefined) {
                        callback();
                    }
                },
                error(collection?: any, jqxhr?: JQueryXHR, options?: any): void {
                    console.log("error while fetching item data from the server");
                }
            });
        }

        public fetchFlags(callback?: Function, callback2?: Function): void {
            var that: Model = this;
            if (that.flags == undefined) {
                that.flags = new Flags();
                that.flags.fetch({
                    remove: true,	// if remove == false, it only adds new items, not removing old items.
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
                    remove: true,	// if remove == false, it only adds new items, not removing old items.
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
                    remove: true,	// if remove == false, it only adds new items, not removing old items.
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