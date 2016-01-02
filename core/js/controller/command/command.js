var FoodParent;
(function (FoodParent) {
    var Command = (function () {
        function Command() {
        }
        Command.prototype.execute = function () {
        };
        Command.prototype.undo = function () {
        };
        return Command;
    })();
    FoodParent.Command = Command;
    var RemoveChildViewCommand = (function () {
        function RemoveChildViewCommand(args) {
            var self = this;
            self._parent = args.parent;
        }
        RemoveChildViewCommand.prototype.execute = function () {
            var self = this;
            self._parent.removeAllChildren();
        };
        RemoveChildViewCommand.prototype.undo = function () {
        };
        return RemoveChildViewCommand;
    })();
    FoodParent.RemoveChildViewCommand = RemoveChildViewCommand;
    var RenderHomeViewCommand = (function () {
        function RenderHomeViewCommand(args) {
            var self = this;
            self._el = args.el;
        }
        RenderHomeViewCommand.prototype.execute = function () {
            var self = this;
            FoodParent.View.addChild(FoodParent.HomeViewFractory.create(self._el).render());
        };
        RenderHomeViewCommand.prototype.undo = function () {
        };
        return RenderHomeViewCommand;
    })();
    FoodParent.RenderHomeViewCommand = RenderHomeViewCommand;
    var RenderNavViewCommand = (function () {
        function RenderNavViewCommand(args) {
            var self = this;
            self._el = args.el;
            self._viewStatus = args.viewStatus;
        }
        RenderNavViewCommand.prototype.execute = function () {
            var self = this;
            if (FoodParent.View.getNavView()) {
                FoodParent.View.getNavView().render({ viewStatus: self._viewStatus });
            }
            else {
                FoodParent.View.setNavView(FoodParent.NavViewFractory.create(self._el).render({ viewStatus: self._viewStatus }));
            }
        };
        RenderNavViewCommand.prototype.undo = function () {
        };
        return RenderNavViewCommand;
    })();
    FoodParent.RenderNavViewCommand = RenderNavViewCommand;
    var RenderManageTreesViewCommand = (function () {
        function RenderManageTreesViewCommand(args) {
            var self = this;
            self._el = args.el;
            self._viewMode = args.viewMode;
        }
        RenderManageTreesViewCommand.prototype.execute = function () {
            var self = this;
            if (FoodParent.View.getManageTreesView()) {
            }
            else {
                var view = FoodParent.ManageTreesViewFractory.create(self._el, self._viewMode).render();
                FoodParent.View.addChild(view);
                FoodParent.View.setManageTreesView(view);
            }
        };
        RenderManageTreesViewCommand.prototype.undo = function () {
        };
        return RenderManageTreesViewCommand;
    })();
    FoodParent.RenderManageTreesViewCommand = RenderManageTreesViewCommand;
    var RenderAlertViewCommand = (function () {
        function RenderAlertViewCommand(args) {
            var self = this;
            self._el = args.el;
            self._errorMode = args.errorMode;
        }
        RenderAlertViewCommand.prototype.execute = function () {
            var self = this;
            var view = FoodParent.AlertViewFractory.create(self._el, self._errorMode).render();
            FoodParent.View.setPopupView(view);
            switch (self._errorMode) {
                case FoodParent.ERROR_MODE.GEO_PERMISSION_ERROR:
                    FoodParent.View.setViewStatus(FoodParent.VIEW_STATUS.GEO_ERROR);
                    break;
                case FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR:
                    FoodParent.View.setViewStatus(FoodParent.VIEW_STATUS.NETWORK_ERROR);
                    break;
            }
        };
        RenderAlertViewCommand.prototype.undo = function () {
        };
        return RenderAlertViewCommand;
    })();
    FoodParent.RenderAlertViewCommand = RenderAlertViewCommand;
    var RemoveAlertViewCommand = (function () {
        function RemoveAlertViewCommand(args) {
            var self = this;
            if (args != undefined && args.delay != undefined) {
                self._delay = args.delay;
            }
            else {
                self._delay = 0;
            }
        }
        RemoveAlertViewCommand.prototype.execute = function () {
            var self = this;
            if (FoodParent.View.getPopupView()) {
                setTimeout(function () {
                    FoodParent.View.getPopupView().setInvisible();
                }, self._delay);
            }
            FoodParent.View.popViewStatus();
        };
        RemoveAlertViewCommand.prototype.undo = function () {
        };
        return RemoveAlertViewCommand;
    })();
    FoodParent.RemoveAlertViewCommand = RemoveAlertViewCommand;
    var FocusMenuLeftCommand = (function () {
        function FocusMenuLeftCommand() {
        }
        FocusMenuLeftCommand.prototype.execute = function () {
            var self = this;
            FoodParent.View.getNavView().focusOnLeft();
        };
        FocusMenuLeftCommand.prototype.undo = function () {
        };
        return FocusMenuLeftCommand;
    })();
    FoodParent.FocusMenuLeftCommand = FocusMenuLeftCommand;
    var FocusMenuRightCommand = (function () {
        function FocusMenuRightCommand() {
        }
        FocusMenuRightCommand.prototype.execute = function () {
            var self = this;
            FoodParent.View.getNavView().focusOnRight();
        };
        FocusMenuRightCommand.prototype.undo = function () {
        };
        return FocusMenuRightCommand;
    })();
    FoodParent.FocusMenuRightCommand = FocusMenuRightCommand;
    var NavigateCommand = (function () {
        function NavigateCommand(args) {
            var self = this;
            self._hash = args.hash;
            if (args.id) {
                self._id = args.id;
            }
        }
        NavigateCommand.prototype.execute = function () {
            var self = this;
            if (self._id) {
                FoodParent.Router.getInstance().navigate(self._hash + "/" + self._id, { trigger: true, replace: false });
            }
            else {
                FoodParent.Router.getInstance().navigate(self._hash, { trigger: true, replace: false });
            }
        };
        NavigateCommand.prototype.undo = function () {
        };
        return NavigateCommand;
    })();
    FoodParent.NavigateCommand = NavigateCommand;
    var MovePaceBarToTop = (function () {
        function MovePaceBarToTop() {
        }
        MovePaceBarToTop.prototype.execute = function () {
            var self = this;
            var bFound = false;
            if ($('.pace-progress').length) {
                $('.pace-progress').css({ top: 0 });
            }
            else {
                setTimeout(function () {
                    new MovePaceBarToTop().execute();
                }, 100);
            }
        };
        MovePaceBarToTop.prototype.undo = function () {
        };
        return MovePaceBarToTop;
    })();
    FoodParent.MovePaceBarToTop = MovePaceBarToTop;
    var MovePaceBarToUnderNav = (function () {
        function MovePaceBarToUnderNav() {
        }
        MovePaceBarToUnderNav.prototype.execute = function () {
            var self = this;
            var bFound = false;
            if ($('.pace-progress').length) {
                $('.pace-progress').css({ top: '64px' });
            }
            else {
                setTimeout(function () {
                    new MovePaceBarToUnderNav().execute();
                }, 100);
            }
        };
        MovePaceBarToUnderNav.prototype.undo = function () {
        };
        return MovePaceBarToUnderNav;
    })();
    FoodParent.MovePaceBarToUnderNav = MovePaceBarToUnderNav;
    var UpdateTreeFlag = (function () {
        function UpdateTreeFlag(args, success, error) {
            var self = this;
            if (args != undefined && args.tree != undefined && args.flag != undefined) {
                self._tree = args.tree;
                self._flag = args.flag;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        UpdateTreeFlag.prototype.execute = function () {
            var self = this;
            self._previousFlag = self._tree.getFlagId();
            self._tree.save({
                'flag': self._flag,
            }, {
                wait: true,
                success: function (tree, response) {
                    self._note = new FoodParent.Note({
                        type: FoodParent.NoteType.INFO,
                        tree: self._tree.getId(),
                        person: 0,
                        comment: "Status has changed from '" + FoodParent.Model.getFlags().findWhere({ id: self._previousFlag }).getName()
                            + "'to '" + FoodParent.Model.getFlags().findWhere({ id: self._flag }).getName() + "'",
                        picture: "",
                        rate: -1,
                        date: moment(new Date()).format(FoodParent.Setting.getDateTimeFormat()),
                    });
                    self._note.save({}, {
                        wait: true,
                        success: function (note, response) {
                            FoodParent.Model.getNotes().add(note);
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
                },
                error: function (error, response) {
                    if (self._error) {
                        self._error();
                    }
                },
            });
        };
        UpdateTreeFlag.prototype.undo = function () {
            var self = this;
            self._tree.save({
                'flag': self._previousFlag,
            }, {
                wait: true,
                success: function (tree, response) {
                    FoodParent.Model.getNotes().remove(self._note);
                    self._note.destroy({
                        wait: true,
                        success: function (note, response) {
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
                },
                error: function (error, response) {
                    if (self._error) {
                        self._error();
                    }
                },
            });
        };
        return UpdateTreeFlag;
    })();
    FoodParent.UpdateTreeFlag = UpdateTreeFlag;
    var UpdateTreeOwnership = (function () {
        function UpdateTreeOwnership(args, success, error) {
            var self = this;
            if (args != undefined && args.tree != undefined && args.ownership != undefined) {
                self._tree = args.tree;
                self._ownership = args.ownership;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        UpdateTreeOwnership.prototype.execute = function () {
            var self = this;
            self._previousOwnership = self._tree.getOwnershipId();
            self._tree.save({
                'ownership': self._ownership,
            }, {
                wait: true,
                success: function (tree, response) {
                    self._note = new FoodParent.Note({
                        type: FoodParent.NoteType.INFO,
                        tree: self._tree.getId(),
                        person: 0,
                        comment: "Ownership has changed from '" + FoodParent.Model.getOwnerships().findWhere({ id: self._previousOwnership }).getName()
                            + "'to '" + FoodParent.Model.getOwnerships().findWhere({ id: self._ownership }).getName() + "'",
                        picture: "",
                        rate: -1,
                        date: moment(new Date()).format(FoodParent.Setting.getDateTimeFormat()),
                    });
                    self._note.save({}, {
                        wait: true,
                        success: function (note, response) {
                            FoodParent.Model.getNotes().add(note);
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
                },
                error: function (error, response) {
                    if (self._error) {
                        self._error();
                    }
                },
            });
        };
        UpdateTreeOwnership.prototype.undo = function () {
            var self = this;
            self._tree.save({
                'ownership': self._previousOwnership,
            }, {
                wait: true,
                success: function (tree, response) {
                    FoodParent.Model.getNotes().remove(self._note);
                    self._note.destroy({
                        wait: true,
                        success: function (note, response) {
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
                },
                error: function (error, response) {
                    if (self._error) {
                        self._error();
                    }
                },
            });
        };
        return UpdateTreeOwnership;
    })();
    FoodParent.UpdateTreeOwnership = UpdateTreeOwnership;
    var UpdateTreeLocation = (function () {
        function UpdateTreeLocation(args, success, error) {
            var self = this;
            if (args != undefined && args.tree != undefined && args.location != undefined) {
                self._tree = args.tree;
                self._marker = args.marker;
                self._location = args.location;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        UpdateTreeLocation.prototype.execute = function () {
            var self = this;
            self._prevLocation = self._tree.getLocation();
            self._tree.save({
                'lat': self._location.lat,
                'lng': self._location.lng
            }, {
                wait: true,
                success: function (tree, response) {
                    self._note = new FoodParent.Note({
                        type: FoodParent.NoteType.INFO,
                        tree: self._tree.getId(),
                        person: 0,
                        comment: "Location has changed from '@ " + self._prevLocation.lat.toFixed(4) + ", " + self._prevLocation.lng.toFixed(4)
                            + "' to '" + '@ ' + self._location.lat.toFixed(4) + ", " + self._location.lng.toFixed(4) + "'",
                        picture: "",
                        rate: -1,
                        date: moment(new Date()).format(FoodParent.Setting.getDateTimeFormat()),
                    });
                    self._note.save({}, {
                        wait: true,
                        success: function (note, response) {
                            FoodParent.Model.getNotes().add(note);
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
                },
                error: function (error, response) {
                    if (self._error) {
                        self._error();
                    }
                },
            });
        };
        UpdateTreeLocation.prototype.undo = function () {
            var self = this;
            self._tree.save({
                'lat': self._prevLocation.lat,
                'lng': self._prevLocation.lng
            }, {
                wait: true,
                success: function (tree, response) {
                    FoodParent.Model.getNotes().remove(self._note);
                    self._note.destroy({
                        wait: true,
                        success: function (note, response) {
                            if (self._success) {
                                self._success();
                            }
                            self._marker.setLatLng(self._prevLocation);
                        },
                        error: function (error) {
                            if (self._error) {
                                self._error();
                            }
                        },
                    });
                },
                error: function (error, response) {
                    if (self._error) {
                        self._error();
                    }
                },
            });
        };
        return UpdateTreeLocation;
    })();
    FoodParent.UpdateTreeLocation = UpdateTreeLocation;
    var RenderMessageViewCommand = (function () {
        function RenderMessageViewCommand(args) {
            var self = this;
            self._el = args.el;
            self._message = args.message;
            self._undoable = args.undoable;
        }
        RenderMessageViewCommand.prototype.execute = function () {
            var self = this;
            if (FoodParent.View.getMessageView()) {
                FoodParent.View.getMessageView().setInvisible();
            }
            var view = FoodParent.MessageViewFractory.create(self._el, self._message, self._undoable).render();
            FoodParent.View.setMessageView(view);
        };
        RenderMessageViewCommand.prototype.undo = function () {
        };
        return RenderMessageViewCommand;
    })();
    FoodParent.RenderMessageViewCommand = RenderMessageViewCommand;
})(FoodParent || (FoodParent = {}));
