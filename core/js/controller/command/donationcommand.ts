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
                    success: function (tree: Tree, response: any) {
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
        }
    }
}