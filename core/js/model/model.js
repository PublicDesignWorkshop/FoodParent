var FoodParent;
(function (FoodParent) {
    var Model = (function () {
        function Model(args) {
            this.bDebug = true;
            if (Model._instance) {
                throw new Error("Error: Instantiation failed: Use Model.getInstance() instead of new.");
            }
            Model._instance = this;
        }
        Model.getInstance = function () {
            return Model._instance;
        };
        Model.getAdopts = function () {
            var self = Model._instance;
            if (self.adopts == undefined) {
                self.adopts = new FoodParent.Adopts();
            }
            return self.adopts;
        };
        Model.getFoods = function () {
            var self = Model._instance;
            if (self.foods == undefined) {
                self.foods = new FoodParent.Foods();
            }
            return self.foods;
        };
        Model.getAuths = function () {
            var self = Model._instance;
            if (self.auths == undefined) {
                self.auths = new FoodParent.Auths();
            }
            return self.auths;
        };
        Model.getTrees = function () {
            var self = Model._instance;
            if (self.trees == undefined) {
                self.trees = new FoodParent.Trees();
            }
            return self.trees;
        };
        Model.getFlags = function () {
            var self = Model._instance;
            if (self.flags == undefined) {
                self.flags = new FoodParent.Flags();
            }
            return self.flags;
        };
        Model.getOwnerships = function () {
            var self = Model._instance;
            if (self.ownerships == undefined) {
                self.ownerships = new FoodParent.Ownerships();
            }
            return self.ownerships;
        };
        Model.getNotes = function () {
            var self = Model._instance;
            if (self.notes == undefined) {
                self.notes = new FoodParent.Notes();
            }
            return self.notes;
        };
        Model.getPersons = function () {
            var self = Model._instance;
            if (self.persons == undefined) {
                self.persons = new FoodParent.Persons();
            }
            return self.persons;
        };
        Model.getPlaces = function () {
            var self = Model._instance;
            if (self.places == undefined) {
                self.places = new FoodParent.Places();
            }
            return self.places;
        };
        Model.getDonations = function () {
            var self = Model._instance;
            if (self.donations == undefined) {
                self.donations = new FoodParent.Donations();
            }
            return self.donations;
        };
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
        Model.fetchAllAuths = function () {
            var self = Model._instance;
            if (self.auths == undefined) {
                self.auths = new FoodParent.Auths();
            }
            return self.auths.fetch({
                remove: true,
                processData: true,
                data: {},
                success: function (collection, response, options) {
                    //console.log("success fetch with " + collection.models.length + " auths");
                },
                error: function (collection, jqxhr, options) {
                    console.log("error while fetching item data from the server");
                }
            });
        };
        Model.fetchAllFoods = function () {
            var self = Model._instance;
            if (self.foods == undefined) {
                self.foods = new FoodParent.Foods();
            }
            return self.foods.fetch({
                remove: true,
                processData: true,
                data: {
                    mode: 2,
                    ids: 0,
                    id: 0,
                },
                success: function (collection, response, options) {
                    self.foods.sortByAscendingName();
                    //console.log("success fetch with " + collection.models.length + " foods");
                },
                error: function (collection, jqxhr, options) {
                    console.log("error while fetching item data from the server");
                }
            });
        };
        Model.fetchAllTrees = function () {
            var self = Model._instance;
            if (self.trees == undefined) {
                self.trees = new FoodParent.Trees();
            }
            if (self.foods == undefined) {
                self.foods = new FoodParent.Foods();
            }
            return self.trees.fetch({
                remove: true,
                processData: true,
                data: {
                    mode: 2,
                    id: 0,
                    south: 0,
                    north: 0,
                    west: 0,
                    east: 0,
                },
                success: function (collection, response, options) {
                    //console.log("success fetch with " + collection.models.length + " trees");
                    //that.fetchFoods(that.foods.getUndetectedIds(that.trees.getFoodIds()));
                },
                error: function (collection, jqxhr, options) {
                    console.log("error while fetching item data from the server");
                }
            });
        };
        Model.fetchAllFlags = function () {
            var self = Model._instance;
            if (self.flags == undefined) {
                self.flags = new FoodParent.Flags();
            }
            return self.flags.fetch({
                remove: true,
                processData: true,
                data: {},
                success: function (collection, response, options) {
                    self.flags.sortByAscendingName();
                    //console.log("success fetch with " + collection.models.length + " trees");
                    //that.fetchFoods(that.foods.getUndetectedIds(that.trees.getFoodIds()));
                },
                error: function (collection, jqxhr, options) {
                    console.log("error while fetching item data from the server");
                }
            });
        };
        Model.fetchAllOwnerships = function () {
            var self = Model._instance;
            if (self.ownerships == undefined) {
                self.ownerships = new FoodParent.Ownerships();
            }
            return self.ownerships.fetch({
                remove: true,
                processData: true,
                data: {},
                success: function (collection, response, options) {
                    //console.log("success fetch with " + collection.models.length + " trees");
                    //that.fetchFoods(that.foods.getUndetectedIds(that.trees.getFoodIds()));
                },
                error: function (collection, jqxhr, options) {
                    console.log("error while fetching item data from the server");
                }
            });
        };
        Model.fetchAllPersons = function () {
            var self = Model._instance;
            if (self.persons == undefined) {
                self.persons = new FoodParent.Persons();
            }
            return self.persons.fetch({
                remove: true,
                processData: true,
                data: {},
                success: function (collection, response, options) {
                    //console.log("success fetch with " + collection.models.length + " trees");
                    //that.fetchFoods(that.foods.getUndetectedIds(that.trees.getFoodIds()));
                },
                error: function (collection, jqxhr, options) {
                    console.log("error while fetching item data from the server");
                }
            });
        };
        Model.fetchAllAdopts = function () {
            var self = Model._instance;
            if (self.adopts == undefined) {
                self.adopts = new FoodParent.Adopts();
            }
            return self.adopts.fetch({
                remove: true,
                processData: true,
                data: {},
                success: function (collection, response, options) {
                    //console.log("success fetch with " + collection.models.length + " trees");
                    //that.fetchFoods(that.foods.getUndetectedIds(that.trees.getFoodIds()));
                },
                error: function (collection, jqxhr, options) {
                    console.log("error while fetching item data from the server");
                }
            });
        };
        Model.fetchNotesOfTrees = function (ids, type, size, offset) {
            var self = Model._instance;
            if (self.notes == undefined) {
                self.notes = new FoodParent.Notes();
            }
            if (ids.length != 0) {
                if (type == FoodParent.NoteType.IMAGE) {
                    return self.notes.fetch({
                        remove: false,
                        processData: true,
                        data: {
                            mode: 2,
                            trees: ids.toString(),
                            start: "",
                            end: "",
                            size: size,
                            offset: offset,
                        },
                        success: function (collection, response, options) {
                            //console.log("success fetch with " + collection.models.length + " notes");
                            //Controller.getInstance().renderTreesOnMap();
                        },
                        error: function (collection, jqxhr, options) {
                            console.log("error while fetching item data from the server");
                        }
                    });
                }
                else if (type == FoodParent.NoteType.INFO) {
                    return self.notes.fetch({
                        remove: false,
                        processData: true,
                        data: {
                            mode: 3,
                            trees: ids.toString(),
                            start: "",
                            end: "",
                            size: size,
                            offset: offset,
                        },
                        success: function (collection, response, options) {
                            //console.log("success fetch with " + collection.models.length + " notes");
                            //Controller.getInstance().renderTreesOnMap();
                        },
                        error: function (collection, jqxhr, options) {
                            console.log("error while fetching item data from the server");
                        }
                    });
                }
            }
            return null;
        };
        Model.fetchImageNotesOfTreesDuringPeriod = function (ids, start, end, size, offset) {
            var self = Model._instance;
            if (self.notes == undefined) {
                self.notes = new FoodParent.Notes();
            }
            if (ids.length != 0) {
                return self.notes.fetch({
                    remove: false,
                    processData: true,
                    data: {
                        mode: 1,
                        trees: ids.toString(),
                        start: start,
                        end: end,
                        size: size,
                        offset: offset,
                    },
                    success: function (collection, response, options) {
                        //console.log("success fetch with " + collection.models.length + " notes");
                        //Controller.getInstance().renderTreesOnMap();
                    },
                    error: function (collection, jqxhr, options) {
                        console.log("error while fetching item data from the server");
                    }
                });
            }
            return null;
        };
        Model.fetchAllPlaces = function () {
            var self = Model._instance;
            if (self.places == undefined) {
                self.places = new FoodParent.Places();
            }
            return self.places.fetch({
                remove: true,
                processData: true,
                data: {
                    mode: 2,
                    ids: 0,
                    id: 0,
                },
                success: function (collection, response, options) {
                    //console.log("success fetch with " + collection.models.length + " places");
                },
                error: function (collection, jqxhr, options) {
                    //console.log("error while fetching item data from the server");
                }
            });
        };
        Model.fetchDonationsOfPlaces = function (ids, size, offset) {
            var self = Model._instance;
            if (self.donations == undefined) {
                self.donations = new FoodParent.Donations();
            }
            if (ids.length != 0) {
                return self.donations.fetch({
                    remove: false,
                    processData: true,
                    data: {
                        mode: 0,
                        places: ids.toString(),
                        start: "",
                        end: "",
                        size: size,
                        offset: offset,
                    },
                    success: function (collection, response, options) {
                        //console.log("success fetch with " + collection.models.length + " notes");
                        //Controller.getInstance().renderTreesOnMap();
                    },
                    error: function (collection, jqxhr, options) {
                        console.log("error while fetching item data from the server");
                    }
                });
            }
            return null;
        };
        Model.fetchDonationsOfPlacesDuringPeriod = function (ids, start, end, size, offset) {
            var self = Model._instance;
            if (self.donations == undefined) {
                self.donations = new FoodParent.Donations();
            }
            if (ids.length != 0) {
                return self.donations.fetch({
                    remove: false,
                    processData: true,
                    data: {
                        mode: 1,
                        places: ids.toString(),
                        start: start,
                        end: end,
                        size: size,
                        offset: offset,
                    },
                    success: function (collection, response, options) {
                        //console.log("success fetch with " + collection.models.length + " notes");
                        //Controller.getInstance().renderTreesOnMap();
                    },
                    error: function (collection, jqxhr, options) {
                        console.log("error while fetching item data from the server");
                    }
                });
            }
            return null;
        };
        Model._instance = new Model();
        Model.TAG = "Model - ";
        return Model;
    })();
    FoodParent.Model = Model;
})(FoodParent || (FoodParent = {}));
