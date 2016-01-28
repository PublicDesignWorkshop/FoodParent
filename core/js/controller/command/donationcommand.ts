module FoodParent {
    export class CreateDonation implements Command {
        private _donation: Donation;
        private _success: Function;
        private _error: Function;
        private _undoSuccess: Function;
        private _note: Note;
        constructor(args?: any, success?: Function, error?: Function, undoSuccess?: Function) {
            var self: CreateDonation = this;
            if (args != undefined && args.donation != undefined) {
                self._donation = args.donation;
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
            self._donation.save(
                {},
                {
                    wait: true,
                    success: function (donation: Donation, response: any) {
                        Model.getDonations().add(self._donation);
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
            var self: CreateDonation = this;
            Model.getDonations().remove(self._donation);
            self._donation.destroy({
                wait: true,
                success: function (donation: Donation, response: any) {
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
        }
    }

    export class AddDonationPicture implements Command {
        private _filename: string;
        private _success: Function;
        private _error: Function;
        private _undoSuccess: Function;
        private _donation: Donation;
        constructor(args?: any, success?: Function, error?: Function, undoSuccess?: Function) {
            var self: AddDonationPicture = this;
            console.log(args.note);
            console.log(args.filename);
            if (args != undefined && args.donation != undefined && args.filename != undefined) {
                self._donation = args.donation;
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
            var self: AddDonationPicture = this;
            self._donation.addPicture(self._filename);
            self._donation.save(
                {},
                {
                    wait: true,
                    success: function (donation: Donation, response: any) {
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
            var self: AddDonationPicture = this;
            self._donation.removePicture(self._filename);
            self._donation.save(
                {},
                {
                    wait: true,
                    success: function (donation: Donation, response: any) {
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

    export class UpdateDonationCover implements Command {
        private _picture: string;
        private _previousPicture: string;
        private _success: Function;
        private _error: Function;
        private _donation: Donation;
        constructor(args?: any, success?: Function, error?: Function) {
            var self: UpdateDonationCover = this;
            if (args != undefined && args.donation != undefined && args.cover != undefined) {
                self._donation = args.donation;
                self._picture = self._donation.getPicture(args.cover);
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        public execute(): any {
            var self: UpdateDonationCover = this;
            self._previousPicture = self._donation.getPicture(0);
            self._donation.setCoverPicture(self._picture);
            self._donation.save(
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
            var self: UpdateDonationCover = this;
            self._donation.setCoverPicture(self._previousPicture);
            self._donation.save(
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

    export class UpdateDonationDate implements Command {
        private _date: string;
        private _previousDate: string;
        private _success: Function;
        private _error: Function;
        private _donation: Donation;
        constructor(args?: any, success?: Function, error?: Function) {
            var self: UpdateDonationDate = this;
            if (args != undefined && args.donation != undefined && args.date != undefined) {
                self._donation = args.donation;
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
            var self: UpdateDonationDate = this;
            self._previousDate = self._donation.getFormattedDateTime();
            self._donation.save(
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
            var self: UpdateDonationDate = this;
            self._donation.save(
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

    export class AddDonationTree implements Command {
        private _tree: Tree;
        private _success: Function;
        private _error: Function;
        private _donation: Donation;
        private _undoSuccess: Function;
        constructor(args?: any, success?: Function, error?: Function, undoSuccess?: Function) {
            var self: AddDonationTree = this;
            if (args != undefined && args.donation != undefined && args.tree != undefined) {
                self._donation = args.donation;
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
        public execute(): any {
            var self: AddDonationTree = this;
            self._donation.addTreeId(self._tree.getId());
            self._donation.save(
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
            var self: AddDonationTree = this;
            self._donation.removeTreeId(self._tree.getId());
            self._donation.save(
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

    export class RemoveDonationTree implements Command {
        private _tree: Tree;
        private _success: Function;
        private _error: Function;
        private _donation: Donation;
        private _undoSuccess: Function;
        constructor(args?: any, success?: Function, error?: Function, undoSuccess?: Function) {
            var self: RemoveDonationTree = this;
            if (args != undefined && args.donation != undefined && args.tree != undefined) {
                self._donation = args.donation;
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
        public execute(): any {
            var self: RemoveDonationTree = this;
            self._donation.removeTreeId(self._tree.getId());
            self._donation.save(
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
            var self: RemoveDonationTree = this;
            self._donation.addTreeId(self._tree.getId());
            self._donation.save(
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

    export class UpdateDonationAmount implements Command {
        private _amount: number;
        private _prevAmount: number;
        private _success: Function;
        private _error: Function;
        private _undoSuccess: Function;
        private _donation: Donation;
        constructor(args?: any, success?: Function, error?: Function, undoSuccess?: Function) {
            var self: UpdateDonationAmount = this;
            if (args != undefined && args.donation != undefined && args.amount != undefined) {
                self._donation = args.donation;
                self._amount = args.amount;
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
            var self: UpdateDonationAmount = this;
            self._prevAmount = self._donation.getQuantity();
            self._donation.setQuantity(self._amount);
            self._donation.save(
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
            var self: UpdateDonationAmount = this;
            self._donation.setQuantity(self._prevAmount);
            self._donation.save(
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

    export class DeleteDonation implements Command {
        private _success: Function;
        private _error: Function;
        private _donation: Donation;
        constructor(args?: any, success?: Function, error?: Function) {
            var self: DeleteDonation = this;
            if (args != undefined && args.donation != undefined) {
                self._donation = args.donation;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        public execute(): any {
            var self: DeleteDonation = this;
            self._donation.destroy({
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
            });
        }
        public undo(): any {

        }
    }
}