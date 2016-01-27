var FoodParent;
(function (FoodParent) {
    var CreateDonation = (function () {
        function CreateDonation(args, success, error, undoSuccess) {
            var self = this;
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
        CreateDonation.prototype.execute = function () {
            var self = this;
            self._donation.save({}, {
                wait: true,
                success: function (tree, response) {
                    FoodParent.Model.getDonations().add(self._donation);
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
        CreateDonation.prototype.undo = function () {
            var self = this;
            FoodParent.Model.getDonations().remove(self._donation);
            self._donation.destroy({
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
        return CreateDonation;
    })();
    FoodParent.CreateDonation = CreateDonation;
})(FoodParent || (FoodParent = {}));
