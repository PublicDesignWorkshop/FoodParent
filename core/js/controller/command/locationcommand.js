var FoodParent;
(function (FoodParent) {
    var CreateLocation = (function () {
        function CreateLocation(args, success, error, undoSuccess) {
            var self = this;
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
        CreateLocation.prototype.execute = function () {
            var self = this;
            self._place.save({}, {
                wait: true,
                success: function (place, response) {
                    FoodParent.Model.getPlaces().add(self._place);
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
        };
        CreateLocation.prototype.undo = function () {
            var self = this;
            FoodParent.Model.getPlaces().remove(self._place);
            self._place.destroy({
                wait: true,
                success: function (place, response) {
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
        };
        return CreateLocation;
    })();
    FoodParent.CreateLocation = CreateLocation;
    var DeleteLocation = (function () {
        function DeleteLocation(args, success, error) {
            var self = this;
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
        DeleteLocation.prototype.execute = function () {
            var self = this;
            self._place.destroy({
                wait: true,
                success: function (place, response) {
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
        };
        DeleteLocation.prototype.undo = function () {
        };
        return DeleteLocation;
    })();
    FoodParent.DeleteLocation = DeleteLocation;
    var UpdateLocationName = (function () {
        function UpdateLocationName(args, success, error, undoSuccess) {
            var self = this;
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
        UpdateLocationName.prototype.execute = function () {
            var self = this;
            self._prevName = self._place.getName();
            self._place.save({
                'name': self._name,
            }, {
                wait: true,
                success: function (place, response) {
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
        };
        UpdateLocationName.prototype.undo = function () {
            var self = this;
            self._place.save({
                'name': self._prevName,
            }, {
                wait: true,
                success: function (place, response) {
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
        };
        return UpdateLocationName;
    })();
    FoodParent.UpdateLocationName = UpdateLocationName;
    var UpdateLocationDescription = (function () {
        function UpdateLocationDescription(args, success, error, undoSuccess) {
            var self = this;
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
        UpdateLocationDescription.prototype.execute = function () {
            var self = this;
            self._prevDescription = self._place.getDescription();
            self._place.save({
                'description': self._description,
            }, {
                wait: true,
                success: function (place, response) {
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
        };
        UpdateLocationDescription.prototype.undo = function () {
            var self = this;
            self._place.save({
                'description': self._prevDescription,
            }, {
                wait: true,
                success: function (place, response) {
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
        };
        return UpdateLocationDescription;
    })();
    FoodParent.UpdateLocationDescription = UpdateLocationDescription;
    var UpdateLocationLocation = (function () {
        function UpdateLocationLocation(args, success, error) {
            var self = this;
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
        UpdateLocationLocation.prototype.execute = function () {
            var self = this;
            self._prevLocation = self._place.getLocation();
            self._place.save({
                'lat': self._location.lat,
                'lng': self._location.lng
            }, {
                wait: true,
                success: function (place, response) {
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
        };
        UpdateLocationLocation.prototype.undo = function () {
            var self = this;
            self._place.save({
                'lat': self._prevLocation.lat,
                'lng': self._prevLocation.lng
            }, {
                wait: true,
                success: function (place, response) {
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
        };
        return UpdateLocationLocation;
    })();
    FoodParent.UpdateLocationLocation = UpdateLocationLocation;
    var UpdateLocationAddress = (function () {
        function UpdateLocationAddress(args, success, error) {
            var self = this;
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
        UpdateLocationAddress.prototype.execute = function () {
            var self = this;
            self._previousAddress = self._place.getAddress();
            self._place.save({
                'address': self._address,
            }, {
                wait: true,
                success: function (tree, response) {
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
        };
        UpdateLocationAddress.prototype.undo = function () {
            var self = this;
            self._place.save({
                'address': self._previousAddress,
            }, {
                wait: true,
                success: function (tree, response) {
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
        };
        return UpdateLocationAddress;
    })();
    FoodParent.UpdateLocationAddress = UpdateLocationAddress;
})(FoodParent || (FoodParent = {}));
