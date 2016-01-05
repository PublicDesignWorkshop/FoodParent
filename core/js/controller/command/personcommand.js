var FoodParent;
(function (FoodParent) {
    var UpdatePersonName = (function () {
        function UpdatePersonName(args, success, error) {
            var self = this;
            if (args != undefined && args.person != undefined && args.name != undefined) {
                self._person = args.person;
                self._name = args.name;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        UpdatePersonName.prototype.execute = function () {
            var self = this;
            self._previousName = self._person.getName();
            self._person.save({
                'name': self._name,
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
        UpdatePersonName.prototype.undo = function () {
            var self = this;
            self._person.save({
                'name': self._previousName,
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
        return UpdatePersonName;
    })();
    FoodParent.UpdatePersonName = UpdatePersonName;
    var UpdatePersonAddress = (function () {
        function UpdatePersonAddress(args, success, error) {
            var self = this;
            if (args != undefined && args.person != undefined && args.address != undefined) {
                self._person = args.person;
                self._address = args.address;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        UpdatePersonAddress.prototype.execute = function () {
            var self = this;
            self._previousAddress = self._person.getAddress();
            self._person.save({
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
        UpdatePersonAddress.prototype.undo = function () {
            var self = this;
            self._person.save({
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
        return UpdatePersonAddress;
    })();
    FoodParent.UpdatePersonAddress = UpdatePersonAddress;
    var UpdatePersonContact = (function () {
        function UpdatePersonContact(args, success, error) {
            var self = this;
            if (args != undefined && args.person != undefined && args.contact != undefined) {
                self._person = args.person;
                self._contact = args.contact;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        UpdatePersonContact.prototype.execute = function () {
            var self = this;
            self._previousContact = self._person.getContact();
            self._person.save({
                'contact': self._contact,
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
        UpdatePersonContact.prototype.undo = function () {
            var self = this;
            self._person.save({
                'contact': self._previousContact,
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
        return UpdatePersonContact;
    })();
    FoodParent.UpdatePersonContact = UpdatePersonContact;
    var UpdatePersonNeightborhood = (function () {
        function UpdatePersonNeightborhood(args, success, error) {
            var self = this;
            if (args != undefined && args.person != undefined && args.neighborhood != undefined) {
                self._person = args.person;
                self._neighborhood = args.neighborhood;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        UpdatePersonNeightborhood.prototype.execute = function () {
            var self = this;
            self._previousNeighborhood = self._person.getNeighboorhood();
            self._person.save({
                'neighborhood': self._neighborhood,
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
        UpdatePersonNeightborhood.prototype.undo = function () {
            var self = this;
            self._person.save({
                'neighborhood': self._previousNeighborhood,
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
        return UpdatePersonNeightborhood;
    })();
    FoodParent.UpdatePersonNeightborhood = UpdatePersonNeightborhood;
    var UpdatePersonAuth = (function () {
        function UpdatePersonAuth(args, success, error) {
            var self = this;
            if (args != undefined && args.person != undefined && args.auth != undefined) {
                self._person = args.person;
                self._auth = args.auth;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        UpdatePersonAuth.prototype.execute = function () {
            var self = this;
            self._previousAuth = self._person.getAuth();
            self._person.save({
                'auth': self._auth,
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
        UpdatePersonAuth.prototype.undo = function () {
            var self = this;
            self._person.save({
                'auth': self._previousAuth,
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
        return UpdatePersonAuth;
    })();
    FoodParent.UpdatePersonAuth = UpdatePersonAuth;
    var DeletePerson = (function () {
        function DeletePerson(args, success, error) {
            var self = this;
            if (args != undefined && args.person != undefined) {
                self._person = args.person;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        DeletePerson.prototype.execute = function () {
            var self = this;
            FoodParent.Model.getPersons().remove(self._person);
            self._person.destroy({
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
        DeletePerson.prototype.undo = function () {
        };
        return DeletePerson;
    })();
    FoodParent.DeletePerson = DeletePerson;
    var CreatePerson = (function () {
        function CreatePerson(args, success, error, undoSuccess) {
            var self = this;
            if (args != undefined && args.person != undefined) {
                self._person = args.person;
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
        CreatePerson.prototype.execute = function () {
            var self = this;
            self._person.save({}, {
                wait: true,
                success: function (tree, response) {
                    FoodParent.Model.getPersons().add(self._person);
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
        CreatePerson.prototype.undo = function () {
            var self = this;
            FoodParent.Model.getPersons().remove(self._person);
            self._person.destroy({
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
        };
        return CreatePerson;
    })();
    FoodParent.CreatePerson = CreatePerson;
})(FoodParent || (FoodParent = {}));
