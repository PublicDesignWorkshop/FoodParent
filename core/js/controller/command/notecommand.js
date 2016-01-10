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
                self._cover = args.cover;
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
            self._previousCover = self._note.getCover();
            self._note.save({
                'cover': self._cover,
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
        UpdateNoteCover.prototype.undo = function () {
            var self = this;
            self._note.save({
                'cover': self._previousCover,
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
        return UpdateNoteCover;
    })();
    FoodParent.UpdateNoteCover = UpdateNoteCover;
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
})(FoodParent || (FoodParent = {}));
