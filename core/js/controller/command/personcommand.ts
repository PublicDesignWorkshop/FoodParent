module FoodParent {
    export class UpdatePersonName implements Command {
        private _person: Person;
        private _name: string;
        private _previousName: string;
        private _success: Function;
        private _error: Function;
        private _note: Note;
        constructor(args?: any, success?: Function, error?: Function) {
            var self: UpdatePersonName = this;
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
        public execute(): any {
            var self: UpdatePersonName = this;
            self._previousName = self._person.getName();
            self._person.save(
                {
                    'name': self._name,
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
            var self: UpdatePersonName = this;
            self._person.save(
                {
                    'name': self._previousName,
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

    export class UpdatePersonAddress implements Command {
        private _person: Person;
        private _address: string;
        private _previousAddress: string;
        private _success: Function;
        private _error: Function;
        private _note: Note;
        constructor(args?: any, success?: Function, error?: Function) {
            var self: UpdatePersonAddress = this;
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
        public execute(): any {
            var self: UpdatePersonAddress = this;
            self._previousAddress = self._person.getAddress();
            self._person.save(
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
            var self: UpdatePersonAddress = this;
            self._person.save(
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

    export class UpdatePersonContact implements Command {
        private _person: Person;
        private _contact: string;
        private _previousContact: string;
        private _success: Function;
        private _error: Function;
        private _note: Note;
        constructor(args?: any, success?: Function, error?: Function) {
            var self: UpdatePersonContact = this;
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
        public execute(): any {
            var self: UpdatePersonContact = this;
            self._previousContact = self._person.getContact();
            self._person.save(
                {
                    'contact': self._contact,
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
            var self: UpdatePersonContact = this;
            self._person.save(
                {
                    'contact': self._previousContact,
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

    export class UpdatePersonNeightborhood implements Command {
        private _person: Person;
        private _neighborhood: string;
        private _previousNeighborhood: string;
        private _success: Function;
        private _error: Function;
        private _note: Note;
        constructor(args?: any, success?: Function, error?: Function) {
            var self: UpdatePersonNeightborhood = this;
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
        public execute(): any {
            var self: UpdatePersonNeightborhood = this;
            self._previousNeighborhood = self._person.getNeighboorhood();
            self._person.save(
                {
                    'neighborhood': self._neighborhood,
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
            var self: UpdatePersonNeightborhood = this;
            self._person.save(
                {
                    'neighborhood': self._previousNeighborhood,
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

    export class UpdatePersonAuth implements Command {
        private _person: Person;
        private _auth: number;
        private _previousAuth: number;
        private _success: Function;
        private _error: Function;
        private _note: Note;
        constructor(args?: any, success?: Function, error?: Function) {
            var self: UpdatePersonAuth = this;
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
        public execute(): any {
            var self: UpdatePersonAuth = this;
            self._previousAuth = self._person.getAuth();
            self._person.save(
                {
                    'auth': self._auth,
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
            var self: UpdatePersonAuth = this;
            self._person.save(
                {
                    'auth': self._previousAuth,
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

    export class DeletePerson implements Command {
        private _person: Person;
        private _success: Function;
        private _error: Function;
        constructor(args?: any, success?: Function, error?: Function) {
            var self: DeletePerson = this;
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
        public execute(): any {
            var self: DeletePerson = this;
            Model.getPersons().remove(self._person);
            self._person.destroy({
                wait: true,
                success: function (note: Note, response: any) {
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
        }
        public undo(): any {

        }
    }
}