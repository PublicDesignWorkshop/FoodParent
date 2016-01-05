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
            self._id = args.id;
        }
        RenderManageTreesViewCommand.prototype.execute = function () {
            var self = this;
            if (FoodParent.View.getManageTreesView()) {
            }
            else {
                var view = FoodParent.ManageTreesViewFractory.create(self._el, self._viewMode, self._id).render();
                FoodParent.View.addChild(view);
                FoodParent.View.setManageTreesView(view);
            }
        };
        RenderManageTreesViewCommand.prototype.undo = function () {
        };
        return RenderManageTreesViewCommand;
    })();
    FoodParent.RenderManageTreesViewCommand = RenderManageTreesViewCommand;
    var RenderManagePeopleViewCommand = (function () {
        function RenderManagePeopleViewCommand(args) {
            var self = this;
            self._el = args.el;
            self._viewMode = args.viewMode;
            self._id = args.id;
        }
        RenderManagePeopleViewCommand.prototype.execute = function () {
            var self = this;
            if (FoodParent.View.getManageTreesView()) {
            }
            else {
                var view = FoodParent.ManagePeopleViewFractory.create(self._el, self._viewMode, self._id).render();
                FoodParent.View.addChild(view);
                FoodParent.View.setManagePeopleView(view);
            }
        };
        RenderManagePeopleViewCommand.prototype.undo = function () {
        };
        return RenderManagePeopleViewCommand;
    })();
    FoodParent.RenderManagePeopleViewCommand = RenderManagePeopleViewCommand;
    var RenderConfirmViewCommand = (function () {
        function RenderConfirmViewCommand(args) {
            var self = this;
            self._el = args.el;
            self._message = args.message;
            self._command = args.command;
        }
        RenderConfirmViewCommand.prototype.execute = function () {
            var self = this;
            var view = FoodParent.ConfirmViewFractory.create(self._el, self._message, self._command).render();
            FoodParent.View.setPopupView(view);
            FoodParent.View.setViewStatus(FoodParent.VIEW_STATUS.CONFIRM);
        };
        RenderConfirmViewCommand.prototype.undo = function () {
        };
        return RenderConfirmViewCommand;
    })();
    FoodParent.RenderConfirmViewCommand = RenderConfirmViewCommand;
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
            if (args.id != undefined) {
                self._id = args.id;
            }
            if (args.viewMode != undefined) {
                self._viewMode = args.viewMode;
            }
        }
        NavigateCommand.prototype.execute = function () {
            var self = this;
            if (self._viewMode != undefined && self._id != undefined) {
                FoodParent.Router.getInstance().navigate(self._hash + "/" + self._viewMode + "/" + self._id, { trigger: true, replace: false });
            }
            else if (self._id != undefined) {
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
