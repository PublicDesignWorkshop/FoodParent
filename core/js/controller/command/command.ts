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

    export class RenderManageTreesViewCommand implements Command {
        private _el: JQuery;
        private _viewMode: VIEW_MODE;
        constructor(args?: any) {
            var self: RenderManageTreesViewCommand = this;
            self._el = args.el;
            self._viewMode = args.viewMode;
        }
        public execute(): any {
            var self: RenderManageTreesViewCommand = this;
            if (View.getManageTreesView()) {

            } else {
                var view: ManageTreesView = ManageTreesViewFractory.create(self._el, self._viewMode).render();
                View.addChild(view);
                View.setManageTreesView(view);
            }

            
        }
        public undo(): any {

        }
    }

    export class RenderAlertViewCommand implements Command {
        private _el: JQuery;
        private _errorMode: ERROR_MODE;
        constructor(args?: any) {
            var self: RenderAlertViewCommand = this;
            self._el = args.el;
            self._errorMode = args.errorMode;
        }
        public execute(): any {
            var self: RenderAlertViewCommand = this;
            var view: AlertView = AlertViewFractory.create(self._el, self._errorMode).render();
            View.setPopupView(view);
            View.setViewStatus(VIEW_STATUS.GEO_ERROR);
        }
        public undo(): any {

        }
    }

    export class RemoveAlertViewCommand implements Command {
        private _delay: number;
        constructor(args?: any) {
            var self: RemoveAlertViewCommand = this;
            if (args != undefined && args.delay != undefined) {
                self._delay = args.delay;
            } else {
                self._delay = 0;
            }
        }
        public execute(): any {
            var self: RemoveAlertViewCommand = this;
            if (View.getPopupView()) {
                setTimeout(function () {
                    View.getPopupView().setInvisible();
                }, self._delay);
            }
            View.popViewStatus();
        }
        public undo(): any {

        }
    }

    export class FocusMenuLeftCommand implements Command {
        public execute(): any {
            var self: FocusMenuLeftCommand = this;
            View.getNavView().focusOnLeft();
        }
        public undo(): any {

        }
    }
    export class FocusMenuRightCommand implements Command {
        public execute(): any {
            var self: FocusMenuLeftCommand = this;
            View.getNavView().focusOnRight();
        }
        public undo(): any {

        }
    }
    export class NavigateCommand implements Command {
        private _hash: string;
        private _id: number;
        constructor(args?: any) {
            var self: NavigateCommand = this;
            self._hash = args.hash;
            if (args.id) {
                self._id = args.id;
            }
        }
        public execute(): any {
            var self: NavigateCommand = this;
            if (self._id) {
                Router.getInstance().navigate(self._hash + "/" + self._id, { trigger: true, replace: false });
            } else {
                Router.getInstance().navigate(self._hash, { trigger: true, replace: false });
            }
            
        }
        public undo(): any {

        }
    }

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
                $('.pace-progress').css({ top: '64px' });
            } else {
                setTimeout(function () {
                    new MovePaceBarToUnderNav().execute();
                }, 100);
            }
        }
        public undo(): any {

        }
    }
}