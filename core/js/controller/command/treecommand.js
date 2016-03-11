var FoodParent;
(function (FoodParent) {
    var UpdateTreeFlag = (function () {
        function UpdateTreeFlag(args, success, error) {
            var self = this;
            if (args != undefined && args.tree != undefined && args.flag != undefined && args.addmode != undefined) {
                self._tree = args.tree;
                self._flag = args.flag;
                self._addmode = args.addmode;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        UpdateTreeFlag.prototype.execute = function () {
            var self = this;
            self._previousFlag = self._tree.getCopiedFlags();
            if (self._addmode) {
                self._tree.addFlag(self._flag);
                self._tree.removeFlag(0);
            }
            else {
                self._tree.removeFlag(self._flag);
            }
            self._tree.save({}, {
                wait: true,
                success: function (tree, response) {
                    if (self._addmode) {
                        self._note = new FoodParent.Note({
                            type: FoodParent.NoteType.INFO,
                            tree: self._tree.getId(),
                            person: 0,
                            comment: "Status '" + FoodParent.Model.getFlags().findWhere({ id: self._flag }).getName() + "' has added.",
                            picture: "",
                            rate: -1,
                            date: moment(new Date()).format(FoodParent.Setting.getDateTimeFormat()),
                        });
                    }
                    else {
                        self._note = new FoodParent.Note({
                            type: FoodParent.NoteType.INFO,
                            tree: self._tree.getId(),
                            person: 0,
                            comment: "Status '" + FoodParent.Model.getFlags().findWhere({ id: self._flag }).getName() + "' has removed.",
                            picture: "",
                            rate: -1,
                            date: moment(new Date()).format(FoodParent.Setting.getDateTimeFormat()),
                        });
                    }
                    self._note.save({}, {
                        wait: true,
                        success: function (note, response) {
                            FoodParent.Model.getNotes().add(note);
                            if (self._success) {
                                self._success();
                            }
                        },
                        error: function (error) {
                            if (self._error) {
                                self._error();
                            }
                        },
                    });
                },
                error: function (error, response) {
                    if (self._error) {
                        self._error();
                    }
                },
            });
        };
        UpdateTreeFlag.prototype.undo = function () {
            var self = this;
            self._tree.setFlags(self._previousFlag);
            self._tree.save({}, {
                wait: true,
                success: function (tree, response) {
                    FoodParent.Model.getNotes().remove(self._note);
                    self._note.destroy({
                        wait: true,
                        success: function (note, response) {
                            if (self._success) {
                                self._success();
                            }
                        },
                        error: function (error) {
                            if (self._error) {
                                self._error();
                            }
                        },
                    });
                },
                error: function (error, response) {
                    if (self._error) {
                        self._error();
                    }
                },
            });
        };
        return UpdateTreeFlag;
    })();
    FoodParent.UpdateTreeFlag = UpdateTreeFlag;
    var UpdateTreeOwnership = (function () {
        function UpdateTreeOwnership(args, success, error) {
            var self = this;
            if (args != undefined && args.tree != undefined && args.ownership != undefined) {
                self._tree = args.tree;
                self._ownership = args.ownership;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        UpdateTreeOwnership.prototype.execute = function () {
            var self = this;
            self._previousOwnership = self._tree.getOwnershipId();
            self._tree.save({
                'ownership': self._ownership,
            }, {
                wait: true,
                success: function (tree, response) {
                    self._note = new FoodParent.Note({
                        type: FoodParent.NoteType.INFO,
                        tree: self._tree.getId(),
                        person: 0,
                        //comment: "Ownership has changed from '" + Model.getOwnerships().findWhere({ id: self._previousOwnership }).getName()
                        //+ "' to '" + Model.getOwnerships().findWhere({ id: self._ownership }).getName() + "'",
                        comment: "Ownership has changed as '" + FoodParent.Model.getOwnerships().findWhere({ id: self._ownership }).getName() + "'",
                        picture: "",
                        rate: -1,
                        date: moment(new Date()).format(FoodParent.Setting.getDateTimeFormat()),
                    });
                    self._note.save({}, {
                        wait: true,
                        success: function (note, response) {
                            FoodParent.Model.getNotes().add(note);
                            if (self._success) {
                                self._success();
                            }
                        },
                        error: function (error) {
                            if (self._error) {
                                self._error();
                            }
                        },
                    });
                },
                error: function (error, response) {
                    if (self._error) {
                        self._error();
                    }
                },
            });
        };
        UpdateTreeOwnership.prototype.undo = function () {
            var self = this;
            self._tree.save({
                'ownership': self._previousOwnership,
            }, {
                wait: true,
                success: function (tree, response) {
                    FoodParent.Model.getNotes().remove(self._note);
                    self._note.destroy({
                        wait: true,
                        success: function (note, response) {
                            if (self._success) {
                                self._success();
                            }
                        },
                        error: function (error) {
                            if (self._error) {
                                self._error();
                            }
                        },
                    });
                },
                error: function (error, response) {
                    if (self._error) {
                        self._error();
                    }
                },
            });
        };
        return UpdateTreeOwnership;
    })();
    FoodParent.UpdateTreeOwnership = UpdateTreeOwnership;
    var UpdateTreeLocation = (function () {
        function UpdateTreeLocation(args, success, error) {
            var self = this;
            if (args != undefined && args.tree != undefined && args.location != undefined) {
                self._tree = args.tree;
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
        UpdateTreeLocation.prototype.execute = function () {
            var self = this;
            self._prevLocation = self._tree.getLocation();
            self._prevAddress = self._tree.getAddress();
            FoodParent.GeoLocation.reverseGeocoding(self._tree.getLocation(), function (data) {
                self._tree.save({
                    'lat': self._location.lat,
                    'lng': self._location.lng,
                    'address': data.road + ", " + data.county + ", " + data.state + ", " + data.country + ", " + data.postcode,
                }, {
                    wait: true,
                    success: function (tree, response) {
                        self._note = new FoodParent.Note({
                            type: FoodParent.NoteType.INFO,
                            tree: self._tree.getId(),
                            person: 0,
                            comment: "Location has changed as '" + '@ ' + self._location.lat.toFixed(4) + ", " + self._location.lng.toFixed(4) + "'",
                            picture: "",
                            rate: -1,
                            date: moment(new Date()).format(FoodParent.Setting.getDateTimeFormat()),
                        });
                        self._note.save({}, {
                            wait: true,
                            success: function (note, response) {
                                FoodParent.Model.getNotes().add(note);
                                if (self._success) {
                                    self._success();
                                }
                            },
                            error: function (error) {
                                if (self._error) {
                                    self._error();
                                }
                            },
                        });
                    },
                    error: function (error, response) {
                        if (self._error) {
                            self._error();
                        }
                    },
                });
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        };
        UpdateTreeLocation.prototype.undo = function () {
            var self = this;
            self._tree.save({
                'lat': self._prevLocation.lat,
                'lng': self._prevLocation.lng,
                'address': self._prevAddress,
            }, {
                wait: true,
                success: function (tree, response) {
                    FoodParent.Model.getNotes().remove(self._note);
                    self._note.destroy({
                        wait: true,
                        success: function (note, response) {
                            if (self._success) {
                                self._success();
                            }
                            if (self._marker) {
                                self._marker.setLatLng(self._prevLocation);
                            }
                        },
                        error: function (error) {
                            if (self._error) {
                                self._error();
                            }
                        },
                    });
                },
                error: function (error, response) {
                    if (self._error) {
                        self._error();
                    }
                },
            });
        };
        return UpdateTreeLocation;
    })();
    FoodParent.UpdateTreeLocation = UpdateTreeLocation;
    var UpdateTreeFoodType = (function () {
        function UpdateTreeFoodType(args, success, error) {
            var self = this;
            if (args != undefined && args.tree != undefined && args.food != undefined) {
                self._tree = args.tree;
                self._food = args.food;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        UpdateTreeFoodType.prototype.execute = function () {
            var self = this;
            self._previousFood = self._tree.getFoodId();
            self._tree.save({
                'food': self._food,
            }, {
                wait: true,
                success: function (tree, response) {
                    self._note = new FoodParent.Note({
                        type: FoodParent.NoteType.INFO,
                        tree: self._tree.getId(),
                        person: 0,
                        //comment: "Food type has changed from '" + Model.getFoods().findWhere({ id: self._previousFood }).getName()
                        //+ "' to '" + Model.getFoods().findWhere({ id: self._food }).getName() + "'",
                        comment: "Food type has changed as '" + FoodParent.Model.getFoods().findWhere({ id: self._food }).getName() + "'",
                        picture: "",
                        rate: -1,
                        date: moment(new Date()).format(FoodParent.Setting.getDateTimeFormat()),
                    });
                    self._note.save({}, {
                        wait: true,
                        success: function (note, response) {
                            FoodParent.Model.getNotes().add(note);
                            if (self._success) {
                                self._success();
                            }
                        },
                        error: function (error) {
                            if (self._error) {
                                self._error();
                            }
                        },
                    });
                },
                error: function (error, response) {
                    if (self._error) {
                        self._error();
                    }
                },
            });
        };
        UpdateTreeFoodType.prototype.undo = function () {
            var self = this;
            self._tree.save({
                'food': self._previousFood,
            }, {
                wait: true,
                success: function (tree, response) {
                    FoodParent.Model.getNotes().remove(self._note);
                    self._note.destroy({
                        wait: true,
                        success: function (note, response) {
                            if (self._success) {
                                self._success();
                            }
                        },
                        error: function (error) {
                            if (self._error) {
                                self._error();
                            }
                        },
                    });
                },
                error: function (error, response) {
                    if (self._error) {
                        self._error();
                    }
                },
            });
        };
        return UpdateTreeFoodType;
    })();
    FoodParent.UpdateTreeFoodType = UpdateTreeFoodType;
    var UpdateTreeDescription = (function () {
        function UpdateTreeDescription(args, success, error) {
            var self = this;
            if (args != undefined && args.tree != undefined && args.description != undefined) {
                self._tree = args.tree;
                self._description = args.description;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        UpdateTreeDescription.prototype.execute = function () {
            var self = this;
            self._previousDescription = self._tree.getDescription();
            self._tree.save({
                'description': self._description,
            }, {
                wait: true,
                success: function (tree, response) {
                    self._note = new FoodParent.Note({
                        type: FoodParent.NoteType.INFO,
                        tree: self._tree.getId(),
                        person: 0,
                        comment: "Description has changed as '" + self._description + "'",
                        picture: "",
                        rate: -1,
                        date: moment(new Date()).format(FoodParent.Setting.getDateTimeFormat()),
                    });
                    self._note.save({}, {
                        wait: true,
                        success: function (note, response) {
                            FoodParent.Model.getNotes().add(note);
                            if (self._success) {
                                self._success();
                            }
                        },
                        error: function (error) {
                            if (self._error) {
                                self._error();
                            }
                        },
                    });
                },
                error: function (error, response) {
                    if (self._error) {
                        self._error();
                    }
                },
            });
        };
        UpdateTreeDescription.prototype.undo = function () {
            var self = this;
            self._tree.save({
                'description': self._previousDescription,
            }, {
                wait: true,
                success: function (tree, response) {
                    FoodParent.Model.getNotes().remove(self._note);
                    self._note.destroy({
                        wait: true,
                        success: function (note, response) {
                            if (self._success) {
                                self._success();
                            }
                        },
                        error: function (error) {
                            if (self._error) {
                                self._error();
                            }
                        },
                    });
                },
                error: function (error, response) {
                    if (self._error) {
                        self._error();
                    }
                },
            });
        };
        return UpdateTreeDescription;
    })();
    FoodParent.UpdateTreeDescription = UpdateTreeDescription;
    var AddNewTree = (function () {
        function AddNewTree(args, success, error, undoSuccess) {
            var self = this;
            if (args != undefined && args.tree != undefined) {
                self._tree = args.tree;
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
        AddNewTree.prototype.execute = function () {
            var self = this;
            var food = FoodParent.Model.getFoods().findWhere({ id: self._tree.getFoodId() });
            self._tree.save({}, {
                wait: true,
                success: function (tree, response) {
                    FoodParent.Model.getTrees().add(self._tree);
                    self._note = new FoodParent.Note({
                        type: FoodParent.NoteType.INFO,
                        tree: self._tree.getId(),
                        person: 0,
                        comment: "'" + food.getName() + " " + self._tree.getName() + "' has been added.",
                        picture: "",
                        rate: -1,
                        date: moment(new Date()).format(FoodParent.Setting.getDateTimeFormat()),
                    });
                    self._note.save({}, {
                        wait: true,
                        success: function (note, response) {
                            FoodParent.Model.getNotes().add(note);
                            if (self._success) {
                                self._success();
                            }
                        },
                        error: function (error) {
                            if (self._error) {
                                self._error();
                            }
                        },
                    });
                },
                error: function (error, response) {
                    if (self._error) {
                        self._error();
                    }
                },
            });
        };
        AddNewTree.prototype.undo = function () {
            var self = this;
            FoodParent.Model.getTrees().remove(self._tree);
            self._tree.destroy({
                wait: true,
                success: function (note, response) {
                    FoodParent.Model.getNotes().remove(self._note);
                    self._note.destroy({
                        wait: true,
                        success: function (note, response) {
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
                },
                error: function (error) {
                    if (self._error) {
                        self._error();
                    }
                },
            });
        };
        return AddNewTree;
    })();
    FoodParent.AddNewTree = AddNewTree;
    var DeleteTree = (function () {
        function DeleteTree(args, success, error) {
            var self = this;
            if (args != undefined && args.tree != undefined) {
                self._tree = args.tree;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        DeleteTree.prototype.execute = function () {
            var self = this;
            FoodParent.Model.getTrees().remove(self._tree);
            self._tree.destroy({
                wait: true,
                success: function (note, response) {
                    if (self._success) {
                        self._success();
                    }
                },
                error: function (error) {
                    if (self._error) {
                        self._error();
                    }
                },
            });
        };
        DeleteTree.prototype.undo = function () {
        };
        return DeleteTree;
    })();
    FoodParent.DeleteTree = DeleteTree;
    var UpdateTreeAddress = (function () {
        function UpdateTreeAddress(args, success, error) {
            var self = this;
            if (args != undefined && args.tree != undefined && args.address != undefined) {
                self._tree = args.tree;
                self._address = args.address;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        UpdateTreeAddress.prototype.execute = function () {
            var self = this;
            self._previousAddress = self._tree.getAddress();
            self._tree.save({
                'address': self._address,
            }, {
                wait: true,
                success: function (tree, response) {
                    self._note = new FoodParent.Note({
                        type: FoodParent.NoteType.INFO,
                        tree: self._tree.getId(),
                        person: 0,
                        comment: "Address has changed as '" + self._address + "'",
                        picture: "",
                        rate: -1,
                        date: moment(new Date()).format(FoodParent.Setting.getDateTimeFormat()),
                    });
                    self._note.save({}, {
                        wait: true,
                        success: function (note, response) {
                            FoodParent.Model.getNotes().add(note);
                            if (self._success) {
                                self._success();
                            }
                        },
                        error: function (error) {
                            if (self._error) {
                                self._error();
                            }
                        },
                    });
                },
                error: function (error, response) {
                    if (self._error) {
                        self._error();
                    }
                },
            });
        };
        UpdateTreeAddress.prototype.undo = function () {
            var self = this;
            self._tree.save({
                'address': self._previousAddress,
            }, {
                wait: true,
                success: function (tree, response) {
                    FoodParent.Model.getNotes().remove(self._note);
                    self._note.destroy({
                        wait: true,
                        success: function (note, response) {
                            if (self._success) {
                                self._success();
                            }
                        },
                        error: function (error) {
                            if (self._error) {
                                self._error();
                            }
                        },
                    });
                },
                error: function (error, response) {
                    if (self._error) {
                        self._error();
                    }
                },
            });
        };
        return UpdateTreeAddress;
    })();
    FoodParent.UpdateTreeAddress = UpdateTreeAddress;
})(FoodParent || (FoodParent = {}));
