var FoodParent;
(function (FoodParent) {
    var UpdateNoteComment = (function () {
        function UpdateNoteComment(args, success, error) {
            var self = this;
            if (args != undefined && args.note != undefined && args.comment != undefined) {
                self._note = args.note;
                self._comment = args.comment;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        UpdateNoteComment.prototype.execute = function () {
            var self = this;
            self._previousComment = self._note.getComment();
            self._note.save({
                'comment': self._comment,
            }, {
                wait: true,
                success: function (note, response) {
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
        UpdateNoteComment.prototype.undo = function () {
            var self = this;
            self._note.save({
                'comment': self._previousComment,
            }, {
                wait: true,
                success: function (note, response) {
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
        return UpdateNoteComment;
    })();
    FoodParent.UpdateNoteComment = UpdateNoteComment;
    var UpdateNoteRating = (function () {
        function UpdateNoteRating(args, success, error) {
            var self = this;
            if (args != undefined && args.note != undefined && args.rate != undefined) {
                self._note = args.note;
                self._rate = args.rate;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        UpdateNoteRating.prototype.execute = function () {
            var self = this;
            self._previousRate = self._note.getRate();
            self._note.save({
                'rate': self._rate,
            }, {
                wait: true,
                success: function (note, response) {
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
        UpdateNoteRating.prototype.undo = function () {
            var self = this;
            self._note.save({
                'rate': self._previousRate,
            }, {
                wait: true,
                success: function (note, response) {
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
        return UpdateNoteRating;
    })();
    FoodParent.UpdateNoteRating = UpdateNoteRating;
    var UpdateNoteCover = (function () {
        function UpdateNoteCover(args, success, error) {
            var self = this;
            if (args != undefined && args.note != undefined && args.cover != undefined) {
                self._note = args.note;
                self._picture = self._note.getPicture(args.cover);
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        UpdateNoteCover.prototype.execute = function () {
            var self = this;
            self._previousPicture = self._note.getPicture(0);
            self._note.setCoverPicture(self._picture);
            self._note.save({}, {
                wait: true,
                success: function (note, response) {
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
        UpdateNoteCover.prototype.undo = function () {
            var self = this;
            self._note.setCoverPicture(self._previousPicture);
            self._note.save({}, {
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
        return UpdateNoteCover;
    })();
    FoodParent.UpdateNoteCover = UpdateNoteCover;
    var UpdateNoteDate = (function () {
        function UpdateNoteDate(args, success, error) {
            var self = this;
            if (args != undefined && args.note != undefined && args.date != undefined) {
                self._note = args.note;
                self._date = args.date;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        UpdateNoteDate.prototype.execute = function () {
            var self = this;
            self._previousDate = self._note.getFormattedDateTime();
            self._note.save({
                'date': self._date,
            }, {
                wait: true,
                success: function (note, response) {
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
        UpdateNoteDate.prototype.undo = function () {
            var self = this;
            self._note.save({
                'date': self._previousDate,
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
        return UpdateNoteDate;
    })();
    FoodParent.UpdateNoteDate = UpdateNoteDate;
    var AddNotePicture = (function () {
        function AddNotePicture(args, success, error, undoSuccess) {
            var self = this;
            console.log(args.note);
            console.log(args.filename);
            if (args != undefined && args.note != undefined && args.filename != undefined) {
                self._note = args.note;
                self._filename = args.filename;
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
        AddNotePicture.prototype.execute = function () {
            var self = this;
            self._note.addPicture(self._filename);
            self._note.save({}, {
                wait: true,
                success: function (note, response) {
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
        AddNotePicture.prototype.undo = function () {
            var self = this;
            self._note.removePicture(self._filename);
            self._note.save({}, {
                wait: true,
                success: function (tree, response) {
                    if (self._undoSuccess) {
                        self._undoSuccess();
                    }
                },
                error: function (error, response) {
                    if (self._error) {
                        self._error();
                    }
                },
            });
        };
        return AddNotePicture;
    })();
    FoodParent.AddNotePicture = AddNotePicture;
    var CreateNote = (function () {
        function CreateNote(args, success, error) {
            var self = this;
            if (args != undefined && args.note != undefined) {
                self._note = args.note;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        CreateNote.prototype.execute = function () {
            var self = this;
            self._note.save({}, {
                wait: true,
                success: function (note, response) {
                    FoodParent.Model.getNotes().add(self._note);
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
        CreateNote.prototype.undo = function () {
            var self = this;
            FoodParent.Model.getNotes().remove(self._note);
            self._note.destroy({
                wait: true,
                success: function (note, response) {
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
        return CreateNote;
    })();
    FoodParent.CreateNote = CreateNote;
    var DeleteNoteCommand = (function () {
        function DeleteNoteCommand(args, success, error) {
            var self = this;
            if (args != undefined && args.note != undefined) {
                self._note = args.note;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        DeleteNoteCommand.prototype.execute = function () {
            var self = this;
            FoodParent.Model.getNotes().remove(self._note);
            self._note.destroy({
                wait: true,
                success: function (note, response) {
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
        DeleteNoteCommand.prototype.undo = function () { };
        return DeleteNoteCommand;
    })();
    FoodParent.DeleteNoteCommand = DeleteNoteCommand;
})(FoodParent || (FoodParent = {}));
