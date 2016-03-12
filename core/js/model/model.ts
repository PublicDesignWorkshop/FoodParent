module FoodParent {
    export class Model {
        private static _instance: Model = new Model();
        private static TAG: string = "Model - ";
        private bDebug: boolean = true;
        private auths: Auths;
        private foods: Foods;
        private adopts: Adopts;
        private trees: Trees;
        private flags: Flags;
        private ownerships: Ownerships;
        private notes: Notes;
        private persons: Persons;
        private places: Places;
        private donations: Donations;
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
        public static getFlags(): Flags {
            var self: Model = Model._instance;
            if (self.flags == undefined) {
                self.flags = new Flags();
            }
            return self.flags;
        }
        public static getOwnerships(): Ownerships {
            var self: Model = Model._instance;
            if (self.ownerships == undefined) {
                self.ownerships = new Ownerships();
            }
            return self.ownerships;
        }
        public static getNotes(): Notes {
            var self: Model = Model._instance;
            if (self.notes == undefined) {
                self.notes = new Notes();
            }
            return self.notes;
        }
        public static getPersons(): Persons {
            var self: Model = Model._instance;
            if (self.persons == undefined) {
                self.persons = new Persons();
            }
            return self.persons;
        }
        public static getPlaces(): Places {
            var self: Model = Model._instance;
            if (self.places == undefined) {
                self.places = new Places();
            }
            return self.places;
        }
        public static getDonations(): Donations {
            var self: Model = Model._instance;
            if (self.donations == undefined) {
                self.donations = new Donations();
            }
            return self.donations;
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

        public static fetchAllAuths(): JQueryXHR {
            var self: Model = Model._instance;
            if (self.auths == undefined) {
                self.auths = new Auths();
            }
            return self.auths.fetch({
                remove: true,	// if remove == false, it only adds new items, not removing old items.
                processData: true,
                data: {
                    
                },
                success(collection?: any, response?: any, options?: any): void {
                    //console.log("success fetch with " + collection.models.length + " auths");
                },
                error(collection?: any, jqxhr?: JQueryXHR, options?: any): void {
                    console.log("error while fetching item data from the server");
                }
            });
        }

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
                    self.foods.sortByAscendingName();
                    //console.log("success fetch with " + collection.models.length + " foods");
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
                    //console.log("success fetch with " + collection.models.length + " trees");
                    //that.fetchFoods(that.foods.getUndetectedIds(that.trees.getFoodIds()));
                },
                error(collection?: any, jqxhr?: JQueryXHR, options?: any): void {
                    console.log("error while fetching item data from the server");
                }
            });
        }

        public static fetchAllFlags(): JQueryXHR {
            var self: Model = Model._instance;
            if (self.flags == undefined) {
                self.flags = new Flags();
            }
            return self.flags.fetch({
                remove: true,	// if remove == false, it only adds new items, not removing old items.
                processData: true,
                data: {
                    
                },
                success(collection?: any, response?: any, options?: any): void {
                    self.flags.sortByAscendingName();
                    //console.log("success fetch with " + collection.models.length + " trees");
                    //that.fetchFoods(that.foods.getUndetectedIds(that.trees.getFoodIds()));
                },
                error(collection?: any, jqxhr?: JQueryXHR, options?: any): void {
                    console.log("error while fetching item data from the server");
                }
            });
        }

        public static fetchAllOwnerships(): JQueryXHR {
            var self: Model = Model._instance;
            if (self.ownerships == undefined) {
                self.ownerships = new Ownerships();
            }
            return self.ownerships.fetch({
                remove: true,	// if remove == false, it only adds new items, not removing old items.
                processData: true,
                data: {

                },
                success(collection?: any, response?: any, options?: any): void {
                    //console.log("success fetch with " + collection.models.length + " trees");
                    //that.fetchFoods(that.foods.getUndetectedIds(that.trees.getFoodIds()));
                },
                error(collection?: any, jqxhr?: JQueryXHR, options?: any): void {
                    console.log("error while fetching item data from the server");
                }
            });
        }

        public static fetchAllPersons(): JQueryXHR {
            var self: Model = Model._instance;
            if (self.persons == undefined) {
                self.persons = new Persons();
            }
            return self.persons.fetch({
                remove: true,	// if remove == false, it only adds new items, not removing old items.
                processData: true,
                data: {

                },
                success(collection?: any, response?: any, options?: any): void {
                    //console.log("success fetch with " + collection.models.length + " trees");
                    //that.fetchFoods(that.foods.getUndetectedIds(that.trees.getFoodIds()));
                },
                error(collection?: any, jqxhr?: JQueryXHR, options?: any): void {
                    console.log("error while fetching item data from the server");
                }
            });
        }

        public static fetchAllAdopts(): JQueryXHR {
            var self: Model = Model._instance;
            if (self.adopts == undefined) {
                self.adopts = new Adopts();
            }
            return self.adopts.fetch({
                remove: true,	// if remove == false, it only adds new items, not removing old items.
                processData: true,
                data: {

                },
                success(collection?: any, response?: any, options?: any): void {
                    //console.log("success fetch with " + collection.models.length + " trees");
                    //that.fetchFoods(that.foods.getUndetectedIds(that.trees.getFoodIds()));
                },
                error(collection?: any, jqxhr?: JQueryXHR, options?: any): void {
                    console.log("error while fetching item data from the server");
                }
            });
        }

        public static fetchNotesOfTrees(ids: Array<number>, type: NoteType, size: number, offset: number): JQueryXHR {
            var self: Model = Model._instance;
            if (self.notes == undefined) {
                self.notes = new Notes();
            }
            if (ids.length != 0) {
                if (type == NoteType.IMAGE) {
                    return self.notes.fetch({
                        remove: false,	// if remove == false, it only adds new items, not removing old items.
                        processData: true,
                        data: {
                            mode: 2,    // 0: fetch only the number of the size from offset, 1: fetch image notes between start and end, 2: fetch only image note the number of the size from offset, 3: fetch only info note the number of the size from offset
                            trees: ids.toString(),
                            start: "",
                            end: "",
                            size: size,
                            offset: offset,
                        },
                        success(collection?: any, response?: any, options?: any): void {
                            //console.log("success fetch with " + collection.models.length + " notes");
                            //Controller.getInstance().renderTreesOnMap();
                        },
                        error(collection?: any, jqxhr?: JQueryXHR, options?: any): void {
                            console.log("error while fetching item data from the server");
                        }
                    });
                } else if (type == NoteType.INFO) {
                    return self.notes.fetch({
                        remove: false,	// if remove == false, it only adds new items, not removing old items.
                        processData: true,
                        data: {
                            mode: 3,    // 0: fetch only the number of the size from offset, 1: fetch image notes between start and end, 2: fetch only image note the number of the size from offset, 3: fetch only info note the number of the size from offset
                            trees: ids.toString(),
                            start: "",
                            end: "",
                            size: size,
                            offset: offset,
                        },
                        success(collection?: any, response?: any, options?: any): void {
                            //console.log("success fetch with " + collection.models.length + " notes");
                            //Controller.getInstance().renderTreesOnMap();
                        },
                        error(collection?: any, jqxhr?: JQueryXHR, options?: any): void {
                            console.log("error while fetching item data from the server");
                        }
                    });
                }
                
            }
            return null;
        }

        public static fetchCommentsOfTreesDuringPeriod(ids: Array<number>, start: string, end: string, size: number, offset: number): JQueryXHR {
            var self: Model = Model._instance;
            if (self.notes == undefined) {
                self.notes = new Notes();
            }
            if (ids.length != 0) {
                return self.notes.fetch({
                    remove: false,	// if remove == false, it only adds new items, not removing old items.
                    processData: true,
                    data: {
                        mode: 1,    // 0: fetch only the number of the size from offset, 1: fetch image notes between start and end, 2: fetch only image note the number of the size from offset, 3: fetch only info note the number of the size from offset
                        trees: ids.toString(),
                        start: start,
                        end: end,
                        size: size,
                        offset: offset,
                    },
                    success(collection?: any, response?: any, options?: any): void {
                        //console.log("success fetch with " + collection.models.length + " notes");
                        //Controller.getInstance().renderTreesOnMap();
                    },
                    error(collection?: any, jqxhr?: JQueryXHR, options?: any): void {
                        console.log("error while fetching item data from the server");
                    }
                });
            }
            return null;
        }

        public static fetchLatestCommentOfTrees(ids: Array<number>): JQueryXHR {
            var self: Model = Model._instance;
            if (self.notes == undefined) {
                self.notes = new Notes();
            }
            if (ids.length != 0) {
                return self.notes.fetch({
                    remove: false,	// if remove == false, it only adds new items, not removing old items.
                    processData: true,
                    data: {
                        mode: 4,    // 0: fetch only the number of the size from offset, 1: fetch image notes between start and end, 2: fetch only image note the number of the size from offset, 3: fetch only info note the number of the size from offset, 4: fetch the lastest image note
                        trees: ids.toString(),
                        start: "",
                        end: "",
                        size: 1,
                        offset: 0,
                    },
                    success(collection?: any, response?: any, options?: any): void {
                        //console.log("success fetch with " + collection.models.length + " notes");
                        //Controller.getInstance().renderTreesOnMap();
                    },
                    error(collection?: any, jqxhr?: JQueryXHR, options?: any): void {
                        console.log("error while fetching item data from the server");
                    }
                });
            }
            return null;
        }

        public static fetchAllPlaces(): JQueryXHR {
            var self: Model = Model._instance;
            if (self.places == undefined) {
                self.places = new Places();
            }
            return self.places.fetch({
                remove: true,	// if remove == false, it only adds new items, not removing old items.
                processData: true,
                data: {
                    mode: 2,    // 0: fetch only 1, 1: fetch all ids, 2: fetch all
                    ids: 0,
                    id: 0,
                },
                success(collection?: any, response?: any, options?: any): void {
                    //console.log("success fetch with " + collection.models.length + " places");
                },
                error(collection?: any, jqxhr?: JQueryXHR, options?: any): void {
                    //console.log("error while fetching item data from the server");
                }
            });
        }

        public static fetchDonationsOfPlaces(ids: Array<number>, size: number, offset: number): JQueryXHR {
            var self: Model = Model._instance;
            if (self.donations == undefined) {
                self.donations = new Donations();
            }
            if (ids.length != 0) {
                return self.donations.fetch({
                    remove: false,	// if remove == false, it only adds new items, not removing old items.
                    processData: true,
                    data: {
                        mode: 0,    // 0: fetch only the number of the size from offset, 1: fetch between start and end
                        places: ids.toString(),
                        start: "",
                        end: "",
                        size: size,
                        offset: offset,
                    },
                    success(collection?: any, response?: any, options?: any): void {
                        //console.log("success fetch with " + collection.models.length + " notes");
                        //Controller.getInstance().renderTreesOnMap();
                    },
                    error(collection?: any, jqxhr?: JQueryXHR, options?: any): void {
                        console.log("error while fetching item data from the server");
                    }
                });
            }
            return null;
        }

        public static fetchDonationsOfPlacesDuringPeriod(ids: Array<number>, start: string, end: string, size: number, offset: number): JQueryXHR {
            var self: Model = Model._instance;
            if (self.donations == undefined) {
                self.donations = new Donations();
            }
            if (ids.length != 0) {
                return self.donations.fetch({
                    remove: false,	// if remove == false, it only adds new items, not removing old items.
                    processData: true,
                    data: {
                        mode: 1,    // 0: fetch only the number of the size from offset, 1: fetch image notes between start and end
                        places: ids.toString(),
                        start: start,
                        end: end,
                        size: size,
                        offset: offset,
                    },
                    success(collection?: any, response?: any, options?: any): void {
                        //console.log("success fetch with " + collection.models.length + " notes");
                        //Controller.getInstance().renderTreesOnMap();
                    },
                    error(collection?: any, jqxhr?: JQueryXHR, options?: any): void {
                        console.log("error while fetching item data from the server");
                    }
                });
            }
            return null;
        }
    }
}