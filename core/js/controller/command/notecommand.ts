module FoodParent {
    export class UpdateNoteComment implements Command {
        private _comment: string;
        private _previousComment: string;
        private _success: Function;
        private _error: Function;
        private _note: Note;
        constructor(args?: any, success?: Function, error?: Function) {
            var self: UpdateNoteComment = this;
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
        public execute(): any {
            var self: UpdateNoteComment = this;
            self._previousComment = self._note.getComment();
            self._note.save(
                {
                    'comment': self._comment,
                },
                {
                    wait: true,
                    success: function (note: Note, response: any) {
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
            var self: UpdateNoteComment = this;
            self._note.save(
                {
                    'comment': self._previousComment,
                },
                {
                    wait: true,
                    success: function (note: Note, response: any) {
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


    
    export class UpdateNoteAmount implements Command {
        private _amount: string;
        private _previousAmount: number;
        private _success: Function;
        private _error: Function;
        private _note: Note;
        constructor(args?: any, success?: Function, error?: Function) {
            var self: UpdateNoteAmount = this;
            if (args != undefined && args.note != undefined && args.amount != undefined) {
                self._note = args.note;
                self._amount = args.amount;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        public execute(): any {
            var self: UpdateNoteAmount = this;
            self._previousAmount = self._note.getAmount();
            self._note.save(
                {
                    'amount': self._amount,
                },
                {
                    wait: true,
                    success: function (note: Note, response: any) {
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
            var self: UpdateNoteAmount = this;
            self._note.save(
                {
                    'amount': self._previousAmount,
                },
                {
                    wait: true,
                    success: function (note: Note, response: any) {
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
    

    export class UpdateNoteRating implements Command {
        private _rate: number;
        private _previousRate: number;
        private _success: Function;
        private _error: Function;
        private _note: Note;
        constructor(args?: any, success?: Function, error?: Function) {
            var self: UpdateNoteRating = this;
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
        public execute(): any {
            var self: UpdateNoteRating = this;
            self._previousRate = self._note.getRate();
            self._note.save(
                {
                    'rate': self._rate,
                },
                {
                    wait: true,
                    success: function (note: Note, response: any) {
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
            var self: UpdateNoteRating = this;
            self._note.save(
                {
                    'rate': self._previousRate,
                },
                {
                    wait: true,
                    success: function (note: Note, response: any) {
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

    export class UpdateNoteCover implements Command {
        private _picture: string;
        private _previousPicture: string;
        private _success: Function;
        private _error: Function;
        private _note: Note;
        constructor(args?: any, success?: Function, error?: Function) {
            var self: UpdateNoteCover = this;
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
        public execute(): any {
            var self: UpdateNoteCover = this;
            self._previousPicture = self._note.getPicture(0);
            self._note.setCoverPicture(self._picture);
            self._note.save(
                {},
                {
                    wait: true,
                    success: function (note: Note, response: any) {
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
            var self: UpdateNoteCover = this;
            self._note.setCoverPicture(self._previousPicture);
            self._note.save(
                {},
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

    export class UpdateNoteDate implements Command {
        private _date: string;
        private _previousDate: string;
        private _success: Function;
        private _error: Function;
        private _note: Note;
        constructor(args?: any, success?: Function, error?: Function) {
            var self: UpdateNoteDate = this;
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
        public execute(): any {
            var self: UpdateNoteDate = this;
            self._previousDate = self._note.getFormattedDateTime();
            self._note.save(
                {
                    'date': self._date,
                },
                {
                    wait: true,
                    success: function (note: Note, response: any) {
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
            var self: UpdateNoteDate = this;
            self._note.save(
                {
                    'date': self._previousDate,
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

    export class AddNotePicture implements Command {
        private _filename: string;
        private _success: Function;
        private _error: Function;
        private _undoSuccess: Function;
        private _note: Note;
        constructor(args?: any, success?: Function, error?: Function, undoSuccess?: Function) {
            var self: AddNotePicture = this;
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
        public execute(): any {
            var self: AddNotePicture = this;
            self._note.addPicture(self._filename);
            self._note.save(
                {},
                {
                    wait: true,
                    success: function (note: Note, response: any) {
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
            var self: AddNotePicture = this;
            self._note.removePicture(self._filename);
            self._note.save(
                {},
                {
                    wait: true,
                    success: function (tree: Tree, response: any) {
                        if (self._undoSuccess) {
                            self._undoSuccess();
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


    export class CreateNote implements Command {
        private _success: Function;
        private _error: Function;
        private _note: Note;
        constructor(args?: any, success?: Function, error?: Function) {
            var self: CreateNote = this;
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
        public execute(): any {
            var self: CreateNote = this;
            self._note.save(
                {},
                {
                    wait: true,
                    success: function (note: Note, response: any) {
                        Model.getNotes().add(self._note);
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
            var self: CreateNote = this;
            Model.getNotes().remove(self._note);
            self._note.destroy({
                    wait: true,
                    success: function (note: Note, response: any) {
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

    export class DeleteNoteCommand implements Command {
        private _success: Function;
        private _error: Function;
        private _note: Note;
        constructor(args?: any, success?: Function, error?: Function) {
            var self: DeleteNoteCommand = this;
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
        public execute(): any {
            var self: DeleteNoteCommand = this;
            Model.getNotes().remove(self._note);
            self._note.destroy({
                    wait: true,
                    success: function (note: Note, response: any) {
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
        public undo(): any { }
    }
}
