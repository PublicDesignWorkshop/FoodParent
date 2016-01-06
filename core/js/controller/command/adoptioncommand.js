var FoodParent;
(function (FoodParent) {
    var CreateAdoption = (function () {
        function CreateAdoption(args, success, error, undoSuccess) {
            var self = this;
            if (args != undefined && args.tree != undefined && args.person != undefined) {
                self._tree = args.tree;
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
        CreateAdoption.prototype.execute = function () {
            var self = this;
            self._adopt = new FoodParent.Adopt({ tree: self._tree.getId(), parent: self._person.getId() });
            self._adopt.save({}, {
                wait: true,
                success: function (tree, response) {
                    FoodParent.Model.getAdopts().add(self._adopt);
                    self._tree.updateParents();
                    self._person.updateTrees();
                    self._note = new FoodParent.Note({
                        type: FoodParent.NoteType.INFO,
                        tree: self._tree.getId(),
                        person: self._person.getId(),
                        comment: self._person.getName() + " has adopted this tree.",
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
        CreateAdoption.prototype.undo = function () {
            var self = this;
            FoodParent.Model.getAdopts().remove(self._adopt);
            self._tree.updateParents();
            self._person.updateTrees();
            self._adopt.destroy({
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
        return CreateAdoption;
    })();
    FoodParent.CreateAdoption = CreateAdoption;
    var DeleteAdoption = (function () {
        function DeleteAdoption(args, success, error, undoSuccess) {
            var self = this;
            if (args != undefined && args.tree != undefined && args.person != undefined) {
                self._tree = args.tree;
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
        DeleteAdoption.prototype.execute = function () {
            var self = this;
            self._adopt = FoodParent.Model.getAdopts().findWhere({ tree: self._tree.getId(), parent: self._person.getId() });
            if (self._adopt != undefined) {
                FoodParent.Model.getAdopts().remove(self._adopt);
                self._tree.updateParents();
                self._person.updateTrees();
                self._adopt.destroy({
                    wait: true,
                    success: function (note, response) {
                        self._note = new FoodParent.Note({
                            type: FoodParent.NoteType.INFO,
                            tree: self._tree.getId(),
                            person: self._person.getId(),
                            comment: self._person.getName() + " has unadopted this tree.",
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
                    error: function (error) {
                        if (self._error) {
                            self._error();
                        }
                    },
                });
            }
        };
        DeleteAdoption.prototype.undo = function () {
            var self = this;
            self._adopt = new FoodParent.Adopt({ tree: self._tree.getId(), parent: self._person.getId() });
            self._adopt.save({}, {
                wait: true,
                success: function (tree, response) {
                    FoodParent.Model.getAdopts().add(self._adopt);
                    self._tree.updateParents();
                    self._person.updateTrees();
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
                error: function (error, response) {
                    if (self._error) {
                        self._error();
                    }
                },
            });
        };
        return DeleteAdoption;
    })();
    FoodParent.DeleteAdoption = DeleteAdoption;
})(FoodParent || (FoodParent = {}));
