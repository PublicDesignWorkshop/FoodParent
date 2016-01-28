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
                success: function (donation, response) {
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
                success: function (donation, response) {
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
    var AddDonationPicture = (function () {
        function AddDonationPicture(args, success, error, undoSuccess) {
            var self = this;
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
        AddDonationPicture.prototype.execute = function () {
            var self = this;
            self._donation.addPicture(self._filename);
            self._donation.save({}, {
                wait: true,
                success: function (donation, response) {
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
        AddDonationPicture.prototype.undo = function () {
            var self = this;
            self._donation.removePicture(self._filename);
            self._donation.save({}, {
                wait: true,
                success: function (donation, response) {
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
        return AddDonationPicture;
    })();
    FoodParent.AddDonationPicture = AddDonationPicture;
    var UpdateDonationCover = (function () {
        function UpdateDonationCover(args, success, error) {
            var self = this;
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
        UpdateDonationCover.prototype.execute = function () {
            var self = this;
            self._previousPicture = self._donation.getPicture(0);
            self._donation.setCoverPicture(self._picture);
            self._donation.save({}, {
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
        UpdateDonationCover.prototype.undo = function () {
            var self = this;
            self._donation.setCoverPicture(self._previousPicture);
            self._donation.save({}, {
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
        return UpdateDonationCover;
    })();
    FoodParent.UpdateDonationCover = UpdateDonationCover;
    var UpdateDonationDate = (function () {
        function UpdateDonationDate(args, success, error) {
            var self = this;
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
        UpdateDonationDate.prototype.execute = function () {
            var self = this;
            self._previousDate = self._donation.getFormattedDateTime();
            self._donation.save({
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
        UpdateDonationDate.prototype.undo = function () {
            var self = this;
            self._donation.save({
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
        return UpdateDonationDate;
    })();
    FoodParent.UpdateDonationDate = UpdateDonationDate;
    var AddDonationTree = (function () {
        function AddDonationTree(args, success, error, undoSuccess) {
            var self = this;
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
        AddDonationTree.prototype.execute = function () {
            var self = this;
            self._donation.addTreeId(self._tree.getId());
            self._donation.save({}, {
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
        AddDonationTree.prototype.undo = function () {
            var self = this;
            self._donation.removeTreeId(self._tree.getId());
            self._donation.save({}, {
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
        return AddDonationTree;
    })();
    FoodParent.AddDonationTree = AddDonationTree;
    var RemoveDonationTree = (function () {
        function RemoveDonationTree(args, success, error, undoSuccess) {
            var self = this;
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
        RemoveDonationTree.prototype.execute = function () {
            var self = this;
            self._donation.removeTreeId(self._tree.getId());
            self._donation.save({}, {
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
        RemoveDonationTree.prototype.undo = function () {
            var self = this;
            self._donation.addTreeId(self._tree.getId());
            self._donation.save({}, {
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
        return RemoveDonationTree;
    })();
    FoodParent.RemoveDonationTree = RemoveDonationTree;
    var UpdateDonationAmount = (function () {
        function UpdateDonationAmount(args, success, error, undoSuccess) {
            var self = this;
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
        UpdateDonationAmount.prototype.execute = function () {
            var self = this;
            self._prevAmount = self._donation.getQuantity();
            self._donation.setQuantity(self._amount);
            self._donation.save({}, {
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
        UpdateDonationAmount.prototype.undo = function () {
            var self = this;
            self._donation.setQuantity(self._prevAmount);
            self._donation.save({}, {
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
        return UpdateDonationAmount;
    })();
    FoodParent.UpdateDonationAmount = UpdateDonationAmount;
    var DeleteDonation = (function () {
        function DeleteDonation(args, success, error) {
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
        }
        DeleteDonation.prototype.execute = function () {
            var self = this;
            self._donation.destroy({
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
        DeleteDonation.prototype.undo = function () {
        };
        return DeleteDonation;
    })();
    FoodParent.DeleteDonation = DeleteDonation;
})(FoodParent || (FoodParent = {}));
