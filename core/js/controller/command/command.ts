module FoodParent {
    export abstract class Command {
        public execute(): any {

        }
        public undo(): any {

        }
    }
    export class RemoveChildViewCommand implements Command {
        private _parent: BaseView;
        constructor(args?: any) {
            var self: RemoveChildViewCommand = this;
            self._parent = args.parent;
        }
        public execute(): any {
            var self: RemoveChildViewCommand = this;
            self._parent.removeAllChildren();
        }
        public undo(): any {

        }
    }
    export class RenderHomeViewCommand implements Command {
        private _el: JQuery;
        constructor(args?: any) {
            var self: RenderHomeViewCommand = this;
            self._el = args.el;
        }
        public execute(): any {
            var self: RenderHomeViewCommand = this;
            View.addChild(HomeViewFractory.create(self._el).render());
        }
        public undo(): any {

        }
    }
    export class RenderNavViewCommand implements Command {
        private _el: JQuery;
        private _viewStatus: VIEW_STATUS;
        constructor(args?: any) {
            var self: RenderNavViewCommand = this;
            self._el = args.el;
            self._viewStatus = args.viewStatus;
        }
        public execute(): any {
            var self: RenderNavViewCommand = this;
            if (View.getNavView()) {
                View.getNavView().render({ viewStatus: self._viewStatus });
            } else {
                View.setNavView(NavViewFractory.create(self._el).render({ viewStatus: self._viewStatus }));
            }
        }
        public undo(): any {

        }
    }

    export class SetActiveNavItemCommand implements Command {
        private _el: JQuery;
        private _viewStatus: VIEW_STATUS;
        constructor(args?: any) {
            var self: SetActiveNavItemCommand = this;
            self._el = args.el;
            self._viewStatus = args.viewStatus;
        }
        public execute(): any {
            var self: SetActiveNavItemCommand = this;
            if (View.getNavView()) {
                View.getNavView().setActiveNavItem(self._viewStatus);
            } else {
                View.setNavView(NavViewFractory.create(self._el).render({ viewStatus: self._viewStatus }));
            }
        }
        public undo(): any {

        }
    }

    export class RenderTreesViewCommand implements Command {
        private _el: JQuery;
        private _id: number;
        private _credential: CREDENTIAL_MODE;
        constructor(args?: any) {
            var self: RenderTreesViewCommand = this;
            self._el = args.el;
            self._id = args.id;
            self._credential = args.credential;
        }
        public execute(): any {
            var self: RenderTreesViewCommand = this;
            if (View.getTreesView()) {
                View.getTreesView().render();
            } else {
                var view: TreesView = TreesViewFractory.create(self._el, self._id, self._credential).render();
                View.addChild(view);
                View.setTreesView(view);
            }
        }
        public undo(): any {

        }
    }

    export class RenderManagePeopleViewCommand implements Command {
        private _el: JQuery;
        private _id: number;
        constructor(args?: any) {
            var self: RenderManagePeopleViewCommand = this;
            self._el = args.el;
            self._id = args.id;
        }
        public execute(): any {
            var self: RenderManagePeopleViewCommand = this;
            if (View.getManagePeopleView()) {

            } else {
                var view: ManagePeopleView = ManagePeopleViewFractory.create(self._el, self._id).render();
                View.addChild(view);
                View.setManagePeopleView(view);
            }
        }
        public undo(): any {

        }
    }

    export class RenderTreeViewCommand implements Command {
        private _el: JQuery;
        private _id: number;
        private _credential: CREDENTIAL_MODE;
        constructor(args?: any) {
            var self: RenderTreeViewCommand = this;
            self._el = args.el;
            self._id = args.id;
            self._credential = args.credential;
        }
        public execute(): any {
            var self: RenderTreeViewCommand = this;
            if (View.getTreeView()) {

            } else {
                var view: TreeView = TreeViewFractory.create(self._el, self._id, self._credential).render();
                View.addChild(view);
                View.setTreeView(view);
            }
        }
        public undo(): any {

        }
    }

    export class RenderConfirmViewCommand implements Command {
        private _el: JQuery;
        private _message: string;
        private _command: Command;
        constructor(args?: any) {
            var self: RenderConfirmViewCommand = this;
            self._el = args.el;
            self._message = args.message;
            self._command = args.command;
        }
        public execute(): any {
            var self: RenderConfirmViewCommand = this;
            var view: PopupView = ConfirmViewFractory.create(self._el, self._message, self._command).render();
            View.addPopupView(view);
            View.setViewStatus(VIEW_STATUS.CONFIRM);
        }
        public undo(): any {

        }
    }

    export class RenderManageAdoptionViewCommand implements Command {
        private _el: JQuery;
        private _tree: number;
        constructor(args?: any) {
            var self: RenderManageAdoptionViewCommand = this;
            self._el = args.el;
            self._tree = args.tree;
        }
        public execute(): any {
            var self: RenderManageAdoptionViewCommand = this;
            var view: PopupView = AdoptionManageViewFactory.create(self._el, self._tree).render();
            View.addPopupView(view);
            View.setViewStatus(VIEW_STATUS.MANAGE_ADOPTION);
        }
        public undo(): any { }
    }

    export class RenderTreesTableViewCommand implements Command {
        private _el: JQuery;
        constructor(args?: any) {
            var self: RenderTreesTableViewCommand = this;
            self._el = args.el;
        }
        public execute(): any {
            var self: RenderTreesTableViewCommand = this;
            var view: PopupView = TreesTableViewFactory.create(self._el).render();
            View.addPopupView(view);
            View.setViewStatus(VIEW_STATUS.TREES_TABLE);
        }
        public undo(): any { }
    }

    export class RenderAdoptTreeViewCommand implements Command {
        private _el: JQuery;
        private _tree: number;
        constructor(args?: any) {
            var self: RenderAdoptTreeViewCommand = this;
            self._el = args.el;
            self._tree = args.tree;
        }
        public execute(): any {
            var self: RenderAdoptTreeViewCommand = this;
            var view: PopupView = AdoptTreeViewFactory.create(self._el, self._tree).render();
            View.addPopupView(view);
            View.setViewStatus(VIEW_STATUS.ADOPT_TREE);
        }
        public undo(): any {}
    }

    export class RenderUnadoptTreeViewCommand implements Command {
        private _el: JQuery;
        private _tree: number;
        constructor(args?: any) {
            var self: RenderUnadoptTreeViewCommand = this;
            self._el = args.el;
            self._tree = args.tree;
        }
        public execute(): any {
            var self: RenderUnadoptTreeViewCommand = this;
            var view: PopupView = UnadoptTreeViewFactory.create(self._el, self._tree).render();
            View.addPopupView(view);
            View.setViewStatus(VIEW_STATUS.UNADOPT_TREE);
        }
        public undo(): any {}
    }

    export class RenderImageNoteViewCommand implements Command {
        private _el: JQuery;
        private _note: Note;
        constructor(args?: any) {
            var self: RenderImageNoteViewCommand = this;
            self._el = args.el;
            self._note = args.note;
        }
        public execute(): any {
            var self: RenderImageNoteViewCommand = this;
            var view: PopupView = ImageNoteViewFactory.create(self._el, self._note).render();
            View.addPopupView(view);
            View.setViewStatus(VIEW_STATUS.IMAGENOTE_TREE);
        }
        public undo(): any {

        }
    }

    export class RenderPostNoteViewCommand implements Command {
        private _el: JQuery;
        private _tree: Tree;
        constructor(args?: any) {
            var self: RenderPostNoteViewCommand = this;
            self._el = args.el;
            self._tree = args.tree;
        }
        public execute(): any {
            var self: RenderPostNoteViewCommand = this;
            var view: PopupView = PostNoteViewFactory.create(self._el, self._tree).render();
            View.addPopupView(view);
            View.setViewStatus(VIEW_STATUS.POST_NOTE);
        }
        public undo(): any { }
    }

    export class RenderAlertViewCommand implements Command {
        private _el: JQuery;
        private _errorMode: ERROR_MODE;
        private _customMessage: string;
        constructor(args?: any) {
            var self: RenderAlertViewCommand = this;
            self._el = args.el;
            self._errorMode = args.errorMode;
            if (args.customMessage) {
                self._customMessage = args.customMessage;
            }
        }
        public execute(): any {
            var self: RenderAlertViewCommand = this;
            var view: PopupView = AlertViewFractory.create(self._el, self._errorMode, self._customMessage).render();
            View.addPopupView(view);
            switch (self._errorMode) {
                case ERROR_MODE.GEO_PERMISSION_ERROR:
                    View.setViewStatus(VIEW_STATUS.GEO_ERROR);
                    break;
                case ERROR_MODE.SEVER_CONNECTION_ERROR:
                    View.setViewStatus(VIEW_STATUS.NETWORK_ERROR);
                    break;
                case ERROR_MODE.SEVER_RESPONSE_ERROR:
                    View.setViewStatus(VIEW_STATUS.SERVER_RESPONSE_ERROR);
                    break;
            }
            
        }
        public undo(): any {

        }
    }
    
    
    export class ResetPopupViewCommand implements Command {
        constructor(args?: any) {
            var self: ResetPopupViewCommand = this;
        }
        public execute(): any {
            var self: ResetPopupViewCommand = this;
            while (View.getPopupView() != undefined) {
                Setting.getPopWrapperElement().children('.frame-pop').last().remove();
                View.removePopupView();
                console.log(View.getPopupViews());
                if (View.getPopupView() == undefined) {
                    Setting.getPopWrapperElement().addClass('hidden');
                }
                View.popViewStatus();
            }
        }
        public undo(): any { }
    }
    

    export class RemovePopupViewCommand implements Command {
        private _delay: number;
        constructor(args?: any) {
            var self: RemovePopupViewCommand = this;
            if (args != undefined && args.delay != undefined) {
                self._delay = args.delay;
            } else {
                self._delay = 0;
            }
        }
        public execute(): any {
            var self: RemovePopupViewCommand = this;
            if (View.getPopupView()) {
                setTimeout(function () {
                    Setting.getPopWrapperElement().children('.frame-pop').last().remove();
                    View.removePopupView();
                    console.log(View.getPopupViews());
                    if (View.getPopupView() == undefined) {
                        Setting.getPopWrapperElement().addClass('hidden');
                    }
                }, self._delay);
                View.popViewStatus();
                console.log(View.getViewStatus());
            }
        }
        public undo(): any { }
    }

    export class RefreshCurrentViewCommand implements Command {
        constructor(args?: any) {
            var self: RefreshCurrentViewCommand = this;
        }
        public execute(): any {
            var self: RefreshCurrentViewCommand = this;
            setTimeout(function () {
                if (View.getViewStatus() == VIEW_STATUS.TREES) {
                    if (View.getTreesView()) {
                        View.getTreesView()._applyFilter();
                        View.getTreesView().renderTreeInfo();
                    }
                } if (View.getViewStatus() == VIEW_STATUS.TREES_TABLE) {
                    if (FoodParent.View.getPopupView()) {
                        (<FoodParent.TreesTableView>FoodParent.View.getPopupView())._applyFilter();
                    }
                } else if (View.getViewStatus() == VIEW_STATUS.TREE) {
                    if (View.getTreeView()) {
                        //View.getTreeView().renderMenu();
                    }
                } else if (View.getViewStatus() == VIEW_STATUS.MANAGE_ADOPTION) {
                    if (FoodParent.View.getPopupView()) {
                        (<FoodParent.AdoptionManageView>FoodParent.View.getPopupView())._applyFilter();
                    }
                }
                new SetActiveNavItemCommand({ el: Setting.getNavWrapperElement(), viewStatus: View.getViewStatus() }).execute();
            }, Setting.getRemovePopupDuration());
            
        }
        public undo(): any { }
    }

    export class UpdateCurrentPositionCommand implements Command {
        constructor(args?: any) {
            var self: UpdateCurrentPositionCommand = this;
        }
        public execute(): any {
            var self: UpdateCurrentPositionCommand = this;
            if (View.getViewStatus() == VIEW_STATUS.TREES) {
                if (View.getTreesView()) {
                    View.getTreesView().panToCurrentLocation();
                }
            }
        }
        public undo(): any { }
    }
    
    export class NavigateCommand implements Command {
        private _hash: string;
        private _id: number;
        constructor(args?: any) {
            var self: NavigateCommand = this;
            self._hash = args.hash;
            if (args.id != undefined) {
                self._id = args.id;
            }
        }
        public execute(): any {
            var self: NavigateCommand = this;
            if (self._id != undefined) {
                Router.getInstance().navigate(self._hash + "/" + self._id, { trigger: true, replace: false });
            } else {
                Router.getInstance().navigate(self._hash, { trigger: true, replace: false });
            }
        }
        public undo(): any {

        }
    }
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

    export class RenderMessageViewCommand implements Command {
        private _el: JQuery;
        private _message: string;
        private _undoable: boolean;
        constructor(args?: any) {
            var self: RenderMessageViewCommand = this;
            self._el = args.el;
            self._message = args.message;
            self._undoable = args.undoable;
        }
        public execute(): any {
            var self: RenderMessageViewCommand = this;
            if (View.getMessageView()) {
                View.getMessageView().setInvisible();
            }
            var view: MessageView = MessageViewFractory.create(self._el, self._message, self._undoable).render();
            View.setMessageView(view);
        }
        public undo(): any {

        }
    }

    export class RenderManageDonationsViewCommand implements Command {
        private _el: JQuery;
        private _id: number;
        constructor(args?: any) {
            var self: RenderManageDonationsViewCommand = this;
            self._el = args.el;
            self._id = args.id;
        }
        public execute(): any {
            var self: RenderManageDonationsViewCommand = this;
            if (View.getManageDonationsView()) {

            } else {
                var view: ManageDonationsView = ManageDonationsViewFractory.create(self._el, self._id).render();
                View.addChild(view);
                View.setManageDonationsView(view);
            }
        }
        public undo(): any {

        }
    }

    export class RenderAddDonationViewCommand implements Command {
        private _el: JQuery;
        private _place: Place;
        constructor(args?: any) {
            var self: RenderAddDonationViewCommand = this;
            self._el = args.el;
            self._place = args.place;
        }
        public execute(): any {
            var self: RenderAddDonationViewCommand = this;
            var view: PopupView = AddDonationViewFactory.create(self._el, self._place).render();
            View.addPopupView(view);
            View.setViewStatus(VIEW_STATUS.ADD_DONATION);
        }
        public undo(): any {

        }
    }

    export class RenderDetailDonationViewCommand implements Command {
        private _el: JQuery;
        private _id: number;
        constructor(args?: any) {
            var self: RenderDetailDonationViewCommand = this;
            self._el = args.el;
            self._id = args.id;
        }
        public execute(): any {
            var self: RenderDetailDonationViewCommand = this;
            if (View.getDetailDonationView()) {

            } else {
                var view: DetailDonationView = DetailDonationViewFractory.create(self._el, self._id).render();
                View.addChild(view);
                View.setDetailDonationView(view);
            }
        }
        public undo(): any {

        }
    }

    export class RenderEditDonationViewCommand implements Command {
        private _el: JQuery;
        private _donation: Donation;
        constructor(args?: any) {
            var self: RenderEditDonationViewCommand = this;
            self._donation = args.donation;
        }
        public execute(): any {
            var self: RenderEditDonationViewCommand = this;
            var view: PopupView = EditDonationViewFactory.create(self._el, self._donation).render();
            View.addPopupView(view);
            View.setViewStatus(VIEW_STATUS.EDIT_DONATION);
        }
        public undo(): any {

        }
    }

    export class RenderAccountViewCommand implements Command {
        private _el: JQuery;
        constructor(args?: any) {
            var self: RenderAccountViewCommand = this;
            self._el = args.el;
        }
        public execute(): any {
            var self: RenderAccountViewCommand = this;
            var view: PopupView = AccountViewFactory.create(self._el).render();
            View.addPopupView(view);
            View.setViewStatus(VIEW_STATUS.LOGIN);
            new SetActiveNavItemCommand({ el: Setting.getNavWrapperElement(), viewStatus: VIEW_STATUS.LOGIN }).execute();
        }
        public undo(): any { }
    }

    export class RenderLogInViewCommand implements Command {
        private _el: JQuery;
        constructor(args?: any) {
            var self: RenderLogInViewCommand = this;
            self._el = args.el;
        }
        public execute(): any {
            var self: RenderLogInViewCommand = this;
            var view: PopupView = LogInViewFactory.create(self._el).render();
            View.addPopupView(view);
            View.setViewStatus(VIEW_STATUS.LOGIN);
            new SetActiveNavItemCommand({ el: Setting.getNavWrapperElement(), viewStatus: VIEW_STATUS.LOGIN }).execute();
        }
        public undo(): any {

        }
    }

    export class RenderSignUpViewCommand implements Command {
        private _el: JQuery;
        constructor(args?: any) {
            var self: RenderSignUpViewCommand = this;
            self._el = args.el;
        }
        public execute(): any {
            var self: RenderSignUpViewCommand = this;
            var view: PopupView = SignUpViewFactory.create(self._el).render();
            View.addPopupView(view);
            View.setViewStatus(VIEW_STATUS.SIGNUP);
        }
        public undo(): any {

        }
    }

    export class RenderChangePasswordViewCommand implements Command {
        private _el: JQuery;
        private _person: Person;
        constructor(args?: any) {
            var self: RenderChangePasswordViewCommand = this;
            self._el = args.el;
            self._person = args.person;
        }
        public execute(): any {
            var self: RenderChangePasswordViewCommand = this;
            var view: PopupView = ChangePasswordViewFactory.create(self._el, self._person).render();
            View.addPopupView(view);
            View.setViewStatus(VIEW_STATUS.CHANGE_PASSWORD);
        }
        public undo(): any {

        }
    }
}