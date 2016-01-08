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
            var self: UpdateNoteComment = this;
            self._note.save(
                {
                    'comment': self._previousComment,
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
            var self: UpdateNoteRating = this;
            self._note.save(
                {
                    'rate': self._previousRate,
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