module FoodParent {
    export class CreateLocation implements Command {
        private _place: Place;
        private _success: Function;
        private _error: Function;
        private _undoSuccess: Function;
        constructor(args?: any, success?: Function, error?: Function, undoSuccess?: Function) {
            var self: CreateLocation = this;
            if (args != undefined && args.place != undefined) {
                self._place = args.place;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
            if (undoSuccess) {
                self._undoSuccess = undoSuccess;
            }
        }
        public execute(): any {
            var self: CreateLocation = this;
            self._place.save(
                {},
                {
                    wait: true,
                    success: function (place: Place, response: any) {
                        Model.getPlaces().add(self._place);
                        if (self._success) {
                            self._success();
                        }
                    },
                    error: function (error, response) {
                        if (self._error) {
                            self._error();
                        }
                    },
                }
            );
        }
        public undo(): any {
            var self: CreateLocation = this;
            Model.getPlaces().remove(self._place);
            self._place.destroy({
                wait: true,
                success: function (place: Place, response: any) {
                    if (self._undoSuccess) {
                        self._undoSuccess();
                    }
                },
                error: function (error) {
                    if (self._error) {
                        self._error();
                    }
                },
            });
        }
    }

    export class DeleteLocation implements Command {
        private _success: Function;
        private _error: Function;
        private _place: Place;
        constructor(args?: any, success?: Function, error?: Function) {
            var self: DeleteLocation = this;
            if (args != undefined && args.place != undefined) {
                self._place = args.place;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        public execute(): any {
            var self: DeleteLocation = this;
            self._place.destroy({
                wait: true,
                success: function (place: Place, response: any) {
                    if (self._success) {
                        self._success();
                    }
                },
                error: function (error, response) {
                    if (self._error) {
                        self._error();
                    }
                },
            });
        }
        public undo(): any {

        }
    }

    export class UpdateLocationName implements Command {
        private _name: string;
        private _prevName: string;
        private _place: Place;
        private _success: Function;
        private _error: Function;
        private _undoSuccess: Function;
        constructor(args?: any, success?: Function, error?: Function, undoSuccess?: Function) {
            var self: UpdateLocationName = this;
            if (args != undefined && args.place != undefined && args.name != undefined) {
                self._place = args.place;
                self._name = args.name;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
            if (undoSuccess) {
                self._undoSuccess = undoSuccess;
            }
        }
        public execute(): any {
            var self: UpdateLocationName = this;
            self._prevName = self._place.getName();
            self._place.save(
                {
                    'name': self._name,
                },
                {
                    wait: true,
                    success: function (place: Place, response: any) {
                        if (self._success) {
                            self._success();
                        }
                    },
                    error: function (error, response) {
                        if (self._error) {
                            self._error();
                        }
                    },
                }
            );
        }
        public undo(): any {
            var self: UpdateLocationName = this;
            self._place.save(
                {
                    'name': self._prevName,
                },
                {
                    wait: true,
                    success: function (place: Place, response: any) {
                        if (self._success) {
                            self._success();
                        }
                    },
                    error: function (error, response) {
                        if (self._error) {
                            self._error();
                        }
                    },
                }
            );
        }
    }

    export class UpdateLocationDescription implements Command {
        private _description: string;
        private _prevDescription: string;
        private _place: Place;
        private _success: Function;
        private _error: Function;
        private _undoSuccess: Function;
        constructor(args?: any, success?: Function, error?: Function, undoSuccess?: Function) {
            var self: UpdateLocationDescription = this;
            if (args != undefined && args.place != undefined && args.description != undefined) {
                self._place = args.place;
                self._description = args.description;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
            if (undoSuccess) {
                self._undoSuccess = undoSuccess;
            }
        }
        public execute(): any {
            var self: UpdateLocationDescription = this;
            self._prevDescription = self._place.getDescription();
            self._place.save(
                {
                    'description': self._description,
                },
                {
                    wait: true,
                    success: function (place: Place, response: any) {
                        if (self._success) {
                            self._success();
                        }
                    },
                    error: function (error, response) {
                        if (self._error) {
                            self._error();
                        }
                    },
                }
            );
        }
        public undo(): any {
            var self: UpdateLocationDescription = this;
            self._place.save(
                {
                    'description': self._prevDescription,
                },
                {
                    wait: true,
                    success: function (place: Place, response: any) {
                        if (self._success) {
                            self._success();
                        }
                    },
                    error: function (error, response) {
                        if (self._error) {
                            self._error();
                        }
                    },
                }
            );
        }
    }

    export class UpdateLocationLocation implements Command {
        private _place: Place;
        private _marker: L.Marker;
        private _location: L.LatLng;
        private _prevLocation: L.LatLng;
        private _success: Function;
        private _error: Function;
        private _note: Note;
        constructor(args?: any, success?: Function, error?: Function) {
            var self: UpdateLocationLocation = this;
            if (args != undefined && args.place != undefined && args.location != undefined) {
                self._place = args.place;
                self._location = args.location;
            }
            if (args.marker) {
                self._marker = args.marker;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        public execute(): any {
            var self: UpdateLocationLocation = this;
            self._prevLocation = self._place.getLocation();
            self._place.save(
                {
                    'lat': self._location.lat,
                    'lng': self._location.lng
                },
                {
                    wait: true,
                    success: function (place: Place, response: any) {
                        if (self._success) {
                            self._success();
                        }
                    },
                    error: function (error, response) {
                        if (self._error) {
                            self._error();
                        }
                    },
                }
            );
        }
        public undo(): any {
            var self: UpdateLocationLocation = this;
            self._place.save(
                {
                    'lat': self._prevLocation.lat,
                    'lng': self._prevLocation.lng
                },
                {
                    wait: true,
                    success: function (place: Place, response: any) {
                        if (self._success) {
                            self._success();
                        }
                    },
                    error: function (error, response) {
                        if (self._error) {
                            self._error();
                        }
                    },
                }
            );
        }
    }

    export class UpdateLocationAddress implements Command {
        private _place: Place;
        private _address: string;
        private _previousAddress: string;
        private _success: Function;
        private _error: Function;
        private _note: Note;
        constructor(args?: any, success?: Function, error?: Function) {
            var self: UpdateLocationAddress = this;
            if (args != undefined && args.place != undefined && args.address != undefined) {
                self._place = args.place;
                self._address = args.address;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        public execute(): any {
            var self: UpdateLocationAddress = this;
            self._previousAddress = self._place.getAddress();
            self._place.save(
                {
                    'address': self._address,
                },
                {
                    wait: true,
                    success: function (tree: Tree, response: any) {
                        if (self._success) {
                            self._success();
                        }
                    },
                    error: function (error, response) {
                        if (self._error) {
                            self._error();
                        }
                    },
                }
            );
        }
        public undo(): any {
            var self: UpdateLocationAddress = this;
            self._place.save(
                {
                    'address': self._previousAddress,
                },
                {
                    wait: true,
                    success: function (tree: Tree, response: any) {
                        if (self._success) {
                            self._success();
                        }
                    },
                    error: function (error, response) {
                        if (self._error) {
                            self._error();
                        }
                    },
                }
            );
        }
    }
}