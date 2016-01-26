module FoodParent {
    export class CreateDonation implements Command {
        private _tree: Tree;
        private _person: Person;
        private _adopt: Adopt;
        private _success: Function;
        private _error: Function;
        private _undoSuccess: Function;
        private _note: Note;
        constructor(args?: any, success?: Function, error?: Function, undoSuccess?: Function) {
            var self: CreateDonation = this;
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
        public execute(): any {
            var self: CreateDonation = this;
            self._adopt = new Adopt({ tree: self._tree.getId(), parent: self._person.getId() });
            self._adopt.save(
                {},
                {
                    wait: true,
                    success: function (tree: Tree, response: any) {
                        Model.getAdopts().add(self._adopt);
                        self._tree.updateParents();
                        self._person.updateTrees();

                        self._note = new Note({
                            type: NoteType.INFO,
                            tree: self._tree.getId(),
                            person: self._person.getId(),
                            comment: self._person.getName() + " has adopted this tree.",
                            picture: "",
                            rate: -1,
                            date: moment(new Date()).format(Setting.getDateTimeFormat()),
                        });
                        self._note.save(
                            {},
                            {
                                wait: true,
                                success: function (note: Note, response: any) {
                                    Model.getNotes().add(note);
                                    if (self._success) {
                                        self._success();
                                    }
                                },
                                error: function (error) {
                                    if (self._error) {
                                        self._error();
                                    }
                                },
                            }
                        );
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
            var self: CreateDonation = this;
            Model.getAdopts().remove(self._adopt);
            self._tree.updateParents();
            self._person.updateTrees();

            self._adopt.destroy({
                wait: true,
                success: function (note: Note, response: any) {
                    Model.getNotes().remove(self._note);
                    self._note.destroy({
                        wait: true,
                        success: function (note: Note, response: any) {
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
        }
    }
}