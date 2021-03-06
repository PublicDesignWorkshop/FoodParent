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
    var SetActiveNavItemCommand = (function () {
        function SetActiveNavItemCommand(args) {
            var self = this;
            self._el = args.el;
            self._viewStatus = args.viewStatus;
        }
        SetActiveNavItemCommand.prototype.execute = function () {
            var self = this;
            if (FoodParent.View.getNavView()) {
                FoodParent.View.getNavView().setActiveNavItem(self._viewStatus);
            }
            else {
                FoodParent.View.setNavView(FoodParent.NavViewFractory.create(self._el).render({ viewStatus: self._viewStatus }));
            }
        };
        SetActiveNavItemCommand.prototype.undo = function () {
        };
        return SetActiveNavItemCommand;
    })();
    FoodParent.SetActiveNavItemCommand = SetActiveNavItemCommand;
    var RenderTreesViewCommand = (function () {
        function RenderTreesViewCommand(args) {
            var self = this;
            self._el = args.el;
            self._id = args.id;
            self._credential = args.credential;
        }
        RenderTreesViewCommand.prototype.execute = function () {
            var self = this;
            if (FoodParent.View.getTreesView()) {
                FoodParent.View.getTreesView().render();
            }
            else {
                var view = FoodParent.TreesViewFractory.create(self._el, self._id, self._credential).render();
                FoodParent.View.addChild(view);
                FoodParent.View.setTreesView(view);
            }
        };
        RenderTreesViewCommand.prototype.undo = function () {
        };
        return RenderTreesViewCommand;
    })();
    FoodParent.RenderTreesViewCommand = RenderTreesViewCommand;
    var RenderManagePeopleViewCommand = (function () {
        function RenderManagePeopleViewCommand(args) {
            var self = this;
            self._el = args.el;
            self._id = args.id;
        }
        RenderManagePeopleViewCommand.prototype.execute = function () {
            var self = this;
            if (FoodParent.View.getManagePeopleView()) {
            }
            else {
                var view = FoodParent.ManagePeopleViewFractory.create(self._el, self._id).render();
                FoodParent.View.addChild(view);
                FoodParent.View.setManagePeopleView(view);
            }
        };
        RenderManagePeopleViewCommand.prototype.undo = function () {
        };
        return RenderManagePeopleViewCommand;
    })();
    FoodParent.RenderManagePeopleViewCommand = RenderManagePeopleViewCommand;
    var RenderTreeViewCommand = (function () {
        function RenderTreeViewCommand(args) {
            var self = this;
            self._el = args.el;
            self._id = args.id;
            self._credential = args.credential;
        }
        RenderTreeViewCommand.prototype.execute = function () {
            var self = this;
            if (FoodParent.View.getTreeView()) {
            }
            else {
                var view = FoodParent.TreeViewFractory.create(self._el, self._id, self._credential).render();
                FoodParent.View.addChild(view);
                FoodParent.View.setTreeView(view);
                console.log(FoodParent.View.getTreeView());
            }
        };
        RenderTreeViewCommand.prototype.undo = function () {
        };
        return RenderTreeViewCommand;
    })();
    FoodParent.RenderTreeViewCommand = RenderTreeViewCommand;
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
            FoodParent.View.addPopupView(view);
            FoodParent.View.setViewStatus(FoodParent.VIEW_STATUS.CONFIRM);
        };
        RenderConfirmViewCommand.prototype.undo = function () {
        };
        return RenderConfirmViewCommand;
    })();
    FoodParent.RenderConfirmViewCommand = RenderConfirmViewCommand;
    var RenderManageAdoptionViewCommand = (function () {
        function RenderManageAdoptionViewCommand(args) {
            var self = this;
            self._el = args.el;
            self._tree = args.tree;
        }
        RenderManageAdoptionViewCommand.prototype.execute = function () {
            var self = this;
            var view = FoodParent.AdoptionManageViewFactory.create(self._el, self._tree).render();
            FoodParent.View.addPopupView(view);
            FoodParent.View.setViewStatus(FoodParent.VIEW_STATUS.MANAGE_ADOPTION);
        };
        RenderManageAdoptionViewCommand.prototype.undo = function () { };
        return RenderManageAdoptionViewCommand;
    })();
    FoodParent.RenderManageAdoptionViewCommand = RenderManageAdoptionViewCommand;
    var RenderTreesTableViewCommand = (function () {
        function RenderTreesTableViewCommand(args) {
            var self = this;
            self._el = args.el;
        }
        RenderTreesTableViewCommand.prototype.execute = function () {
            var self = this;
            var view = FoodParent.TreesTableViewFactory.create(self._el).render();
            FoodParent.View.addPopupView(view);
            FoodParent.View.setViewStatus(FoodParent.VIEW_STATUS.TREES_TABLE);
        };
        RenderTreesTableViewCommand.prototype.undo = function () { };
        return RenderTreesTableViewCommand;
    })();
    FoodParent.RenderTreesTableViewCommand = RenderTreesTableViewCommand;
    var RenderAdoptTreeViewCommand = (function () {
        function RenderAdoptTreeViewCommand(args) {
            var self = this;
            self._el = args.el;
            self._tree = args.tree;
        }
        RenderAdoptTreeViewCommand.prototype.execute = function () {
            var self = this;
            var view = FoodParent.AdoptTreeViewFactory.create(self._el, self._tree).render();
            FoodParent.View.addPopupView(view);
            FoodParent.View.setViewStatus(FoodParent.VIEW_STATUS.ADOPT_TREE);
        };
        RenderAdoptTreeViewCommand.prototype.undo = function () { };
        return RenderAdoptTreeViewCommand;
    })();
    FoodParent.RenderAdoptTreeViewCommand = RenderAdoptTreeViewCommand;
    var RenderUnadoptTreeViewCommand = (function () {
        function RenderUnadoptTreeViewCommand(args) {
            var self = this;
            self._el = args.el;
            self._tree = args.tree;
        }
        RenderUnadoptTreeViewCommand.prototype.execute = function () {
            var self = this;
            var view = FoodParent.UnadoptTreeViewFactory.create(self._el, self._tree).render();
            FoodParent.View.addPopupView(view);
            FoodParent.View.setViewStatus(FoodParent.VIEW_STATUS.UNADOPT_TREE);
        };
        RenderUnadoptTreeViewCommand.prototype.undo = function () { };
        return RenderUnadoptTreeViewCommand;
    })();
    FoodParent.RenderUnadoptTreeViewCommand = RenderUnadoptTreeViewCommand;
    var RenderEditNoteViewCommand = (function () {
        function RenderEditNoteViewCommand(args) {
            var self = this;
            self._el = args.el;
            self._note = args.note;
            self._credential = args.credential;
        }
        RenderEditNoteViewCommand.prototype.execute = function () {
            var self = this;
            var view = FoodParent.EditNoteViewFactory.create(self._el, self._note, self._credential).render();
            FoodParent.View.addPopupView(view);
            FoodParent.View.setViewStatus(FoodParent.VIEW_STATUS.EDIT_NOTE);
        };
        RenderEditNoteViewCommand.prototype.undo = function () { };
        return RenderEditNoteViewCommand;
    })();
    FoodParent.RenderEditNoteViewCommand = RenderEditNoteViewCommand;
    var RenderPostNoteViewCommand = (function () {
        function RenderPostNoteViewCommand(args) {
            var self = this;
            self._el = args.el;
            self._tree = args.tree;
            self._credential = args.credential;
        }
        RenderPostNoteViewCommand.prototype.execute = function () {
            var self = this;
            var view = FoodParent.PostNoteViewFactory.create(self._el, self._tree, self._credential).render();
            FoodParent.View.addPopupView(view);
            FoodParent.View.setViewStatus(FoodParent.VIEW_STATUS.POST_NOTE);
        };
        RenderPostNoteViewCommand.prototype.undo = function () { };
        return RenderPostNoteViewCommand;
    })();
    FoodParent.RenderPostNoteViewCommand = RenderPostNoteViewCommand;
    var RenderAlertViewCommand = (function () {
        function RenderAlertViewCommand(args) {
            var self = this;
            self._el = args.el;
            self._errorMode = args.errorMode;
            if (args.customMessage) {
                self._customMessage = args.customMessage;
            }
        }
        RenderAlertViewCommand.prototype.execute = function () {
            var self = this;
            var view = FoodParent.AlertViewFractory.create(self._el, self._errorMode, self._customMessage).render();
            FoodParent.View.addPopupView(view);
            FoodParent.View.setViewStatus(FoodParent.VIEW_STATUS.ERROR);
        };
        RenderAlertViewCommand.prototype.undo = function () { };
        return RenderAlertViewCommand;
    })();
    FoodParent.RenderAlertViewCommand = RenderAlertViewCommand;
    var ResetPopupViewCommand = (function () {
        function ResetPopupViewCommand(args) {
            var self = this;
        }
        ResetPopupViewCommand.prototype.execute = function () {
            var self = this;
            while (FoodParent.View.getPopupView() != undefined) {
                FoodParent.Setting.getPopWrapperElement().children('.frame-pop').last().remove();
                FoodParent.View.removePopupView();
                console.log(FoodParent.View.getPopupViews());
                if (FoodParent.View.getPopupView() == undefined) {
                    FoodParent.Setting.getPopWrapperElement().addClass('hidden');
                }
                FoodParent.View.popViewStatus();
            }
        };
        ResetPopupViewCommand.prototype.undo = function () { };
        return ResetPopupViewCommand;
    })();
    FoodParent.ResetPopupViewCommand = ResetPopupViewCommand;
    var RemovePopupViewCommand = (function () {
        function RemovePopupViewCommand(args) {
            var self = this;
            if (args != undefined && args.delay != undefined) {
                self._delay = args.delay;
            }
            else {
                self._delay = 0;
            }
        }
        RemovePopupViewCommand.prototype.execute = function () {
            var self = this;
            if (FoodParent.View.getPopupView()) {
                setTimeout(function () {
                    FoodParent.Setting.getPopWrapperElement().children('.frame-pop').last().remove();
                    FoodParent.View.removePopupView();
                    console.log(FoodParent.View.getPopupViews());
                    if (FoodParent.View.getPopupView() == undefined) {
                        FoodParent.Setting.getPopWrapperElement().addClass('hidden');
                    }
                }, self._delay);
                FoodParent.View.popViewStatus();
                console.log(FoodParent.View.getViewStatus());
            }
        };
        RemovePopupViewCommand.prototype.undo = function () { };
        return RemovePopupViewCommand;
    })();
    FoodParent.RemovePopupViewCommand = RemovePopupViewCommand;
    var RefreshCurrentViewCommand = (function () {
        function RefreshCurrentViewCommand(args) {
            var self = this;
        }
        RefreshCurrentViewCommand.prototype.execute = function () {
            var self = this;
            setTimeout(function () {
                if (FoodParent.View.getViewStatus() == FoodParent.VIEW_STATUS.TREES) {
                    if (FoodParent.View.getTreesView()) {
                        FoodParent.View.getTreesView()._applyFilter();
                        FoodParent.View.getTreesView().renderTreeInfo();
                    }
                }
                if (FoodParent.View.getViewStatus() == FoodParent.VIEW_STATUS.TREES_TABLE) {
                    if (FoodParent.View.getPopupView()) {
                        FoodParent.View.getPopupView()._applyFilter();
                    }
                }
                else if (FoodParent.View.getViewStatus() == FoodParent.VIEW_STATUS.TREE) {
                    if (FoodParent.View.getTreeView()) {
                        FoodParent.View.getTreeView().update();
                    }
                }
                else if (FoodParent.View.getViewStatus() == FoodParent.VIEW_STATUS.MANAGE_ADOPTION) {
                    if (FoodParent.View.getPopupView()) {
                        FoodParent.View.getPopupView()._applyFilter();
                    }
                }
                new SetActiveNavItemCommand({ el: FoodParent.Setting.getNavWrapperElement(), viewStatus: FoodParent.View.getViewStatus() }).execute();
            }, FoodParent.Setting.getRemovePopupDuration());
        };
        RefreshCurrentViewCommand.prototype.undo = function () { };
        return RefreshCurrentViewCommand;
    })();
    FoodParent.RefreshCurrentViewCommand = RefreshCurrentViewCommand;
    var UpdateCurrentPositionCommand = (function () {
        function UpdateCurrentPositionCommand(args) {
            var self = this;
        }
        UpdateCurrentPositionCommand.prototype.execute = function () {
            var self = this;
            if (FoodParent.View.getViewStatus() == FoodParent.VIEW_STATUS.TREES) {
                if (FoodParent.View.getTreesView()) {
                    FoodParent.View.getTreesView().panToCurrentLocation();
                }
            }
        };
        UpdateCurrentPositionCommand.prototype.undo = function () { };
        return UpdateCurrentPositionCommand;
    })();
    FoodParent.UpdateCurrentPositionCommand = UpdateCurrentPositionCommand;
    var NavigateCommand = (function () {
        function NavigateCommand(args) {
            var self = this;
            self._hash = args.hash;
            if (args.id != undefined) {
                self._id = args.id;
            }
        }
        NavigateCommand.prototype.execute = function () {
            var self = this;
            if (self._id != undefined) {
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
    /*
    export class MovePaceBarToTop implements Command {
        public execute(): any {
            var self: MovePaceBarToTop = this;
            var bFound: boolean = false;
            if ($('.pace-progress').length) {
                $('.pace-progress').css({ top: 0 });
            } else {
                setTimeout(function () {
                    new MovePaceBarToTop().execute();
                }, 100);
            }
        }
        public undo(): any {

        }
    }
    export class MovePaceBarToUnderNav implements Command {
        public execute(): any {
            var self: MovePaceBarToUnderNav = this;
            var bFound: boolean = false;
            if ($('.pace-progress').length) {
                $('.pace-progress').css({ top: '48px' });
            } else {
                setTimeout(function () {
                    new MovePaceBarToUnderNav().execute();
                }, 100);
            }
        }
        public undo(): any {

        }
    }
    */
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
    var RenderManageDonationsViewCommand = (function () {
        function RenderManageDonationsViewCommand(args) {
            var self = this;
            self._el = args.el;
            self._id = args.id;
        }
        RenderManageDonationsViewCommand.prototype.execute = function () {
            var self = this;
            if (FoodParent.View.getManageDonationsView()) {
            }
            else {
                var view = FoodParent.ManageDonationsViewFractory.create(self._el, self._id).render();
                FoodParent.View.addChild(view);
                FoodParent.View.setManageDonationsView(view);
            }
        };
        RenderManageDonationsViewCommand.prototype.undo = function () {
        };
        return RenderManageDonationsViewCommand;
    })();
    FoodParent.RenderManageDonationsViewCommand = RenderManageDonationsViewCommand;
    var RenderAddDonationViewCommand = (function () {
        function RenderAddDonationViewCommand(args) {
            var self = this;
            self._el = args.el;
            self._place = args.place;
        }
        RenderAddDonationViewCommand.prototype.execute = function () {
            var self = this;
            var view = FoodParent.AddDonationViewFactory.create(self._el, self._place).render();
            FoodParent.View.addPopupView(view);
            FoodParent.View.setViewStatus(FoodParent.VIEW_STATUS.ADD_DONATION);
        };
        RenderAddDonationViewCommand.prototype.undo = function () {
        };
        return RenderAddDonationViewCommand;
    })();
    FoodParent.RenderAddDonationViewCommand = RenderAddDonationViewCommand;
    var RenderDetailDonationViewCommand = (function () {
        function RenderDetailDonationViewCommand(args) {
            var self = this;
            self._el = args.el;
            self._id = args.id;
        }
        RenderDetailDonationViewCommand.prototype.execute = function () {
            var self = this;
            if (FoodParent.View.getDetailDonationView()) {
            }
            else {
                var view = FoodParent.DetailDonationViewFractory.create(self._el, self._id).render();
                FoodParent.View.addChild(view);
                FoodParent.View.setDetailDonationView(view);
            }
        };
        RenderDetailDonationViewCommand.prototype.undo = function () {
        };
        return RenderDetailDonationViewCommand;
    })();
    FoodParent.RenderDetailDonationViewCommand = RenderDetailDonationViewCommand;
    var RenderEditDonationViewCommand = (function () {
        function RenderEditDonationViewCommand(args) {
            var self = this;
            self._donation = args.donation;
        }
        RenderEditDonationViewCommand.prototype.execute = function () {
            var self = this;
            var view = FoodParent.EditDonationViewFactory.create(self._el, self._donation).render();
            FoodParent.View.addPopupView(view);
            FoodParent.View.setViewStatus(FoodParent.VIEW_STATUS.EDIT_DONATION);
        };
        RenderEditDonationViewCommand.prototype.undo = function () {
        };
        return RenderEditDonationViewCommand;
    })();
    FoodParent.RenderEditDonationViewCommand = RenderEditDonationViewCommand;
    var RenderAccountViewCommand = (function () {
        function RenderAccountViewCommand(args) {
            var self = this;
            self._el = args.el;
        }
        RenderAccountViewCommand.prototype.execute = function () {
            var self = this;
            var view = FoodParent.AccountViewFactory.create(self._el).render();
            FoodParent.View.addPopupView(view);
            FoodParent.View.setViewStatus(FoodParent.VIEW_STATUS.LOGIN);
            new SetActiveNavItemCommand({ el: FoodParent.Setting.getNavWrapperElement(), viewStatus: FoodParent.VIEW_STATUS.LOGIN }).execute();
        };
        RenderAccountViewCommand.prototype.undo = function () { };
        return RenderAccountViewCommand;
    })();
    FoodParent.RenderAccountViewCommand = RenderAccountViewCommand;
    var RenderLogInViewCommand = (function () {
        function RenderLogInViewCommand(args) {
            var self = this;
            self._el = args.el;
        }
        RenderLogInViewCommand.prototype.execute = function () {
            var self = this;
            var view = FoodParent.LogInViewFactory.create(self._el).render();
            FoodParent.View.addPopupView(view);
            FoodParent.View.setViewStatus(FoodParent.VIEW_STATUS.LOGIN);
            new SetActiveNavItemCommand({ el: FoodParent.Setting.getNavWrapperElement(), viewStatus: FoodParent.VIEW_STATUS.LOGIN }).execute();
        };
        RenderLogInViewCommand.prototype.undo = function () {
        };
        return RenderLogInViewCommand;
    })();
    FoodParent.RenderLogInViewCommand = RenderLogInViewCommand;
    var RenderSignUpViewCommand = (function () {
        function RenderSignUpViewCommand(args) {
            var self = this;
            self._el = args.el;
        }
        RenderSignUpViewCommand.prototype.execute = function () {
            var self = this;
            var view = FoodParent.SignUpViewFactory.create(self._el).render();
            FoodParent.View.addPopupView(view);
            FoodParent.View.setViewStatus(FoodParent.VIEW_STATUS.SIGNUP);
            new SetActiveNavItemCommand({ el: FoodParent.Setting.getNavWrapperElement(), viewStatus: FoodParent.VIEW_STATUS.SIGNUP }).execute();
        };
        RenderSignUpViewCommand.prototype.undo = function () {
        };
        return RenderSignUpViewCommand;
    })();
    FoodParent.RenderSignUpViewCommand = RenderSignUpViewCommand;
    var RenderChangePasswordViewCommand = (function () {
        function RenderChangePasswordViewCommand(args) {
            var self = this;
            self._el = args.el;
            self._person = args.person;
        }
        RenderChangePasswordViewCommand.prototype.execute = function () {
            var self = this;
            var view = FoodParent.ChangePasswordViewFactory.create(self._el, self._person).render();
            FoodParent.View.addPopupView(view);
            FoodParent.View.setViewStatus(FoodParent.VIEW_STATUS.CHANGE_PASSWORD);
        };
        RenderChangePasswordViewCommand.prototype.undo = function () {
        };
        return RenderChangePasswordViewCommand;
    })();
    FoodParent.RenderChangePasswordViewCommand = RenderChangePasswordViewCommand;
})(FoodParent || (FoodParent = {}));
