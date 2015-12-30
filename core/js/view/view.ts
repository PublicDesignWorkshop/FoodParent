module FoodParent {
    export class View extends BaseView {
        private static _instance: View = new View();
        private static TAG: string = "View - ";
        private _viewStatus: Array<VIEW_STATUS>;
        //private _actionStatus: ACTION_STATUS = ACTION_STATUS.NONE;
        private _navView: NavView;
        private _popupView: PopupView;
        private _messageView: MessageView;
        private _manageTreesView: ManageTreesView;

        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            if (View._instance) {
                throw new Error("Error: Instantiation failed: Use View.getInstance() instead of new.");
            }
            View._instance = this;
            var self: View = View._instance;
            self.bDebug = true;
            self._viewStatus = new Array<VIEW_STATUS>();
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
        }
        public static getInstance(): View {
            return View._instance;
        }
        public static setElement(options?: Backbone.ViewOptions<Backbone.Model>): void {
            View._instance.setElement(options.el);
        }
        public static setViewStatus(viewStatus: VIEW_STATUS): void {
            View._instance._viewStatus.push(viewStatus);
        }
        public static popViewStatus(): void {
            console.log(View.TAG + "popViewStatus()");
            View._instance._viewStatus.pop();
        }
        public static getViewStatus(): VIEW_STATUS {
            return View._instance._viewStatus[View._instance._viewStatus.length - 1];
        }
        /*
        public static setActionStatus(actionStatus: ACTION_STATUS): void {
            View._instance._actionStatus = actionStatus;
        }
        public static getActionStatus(): ACTION_STATUS {
            return View._instance._actionStatus;
        }
        */
        public static addChild(view: BaseView): void {
            var self: View = View._instance;
            if (self.children == undefined) {
                self.children = new Array<BaseView>();
            }
            self.children.push(view);
        }
        public static getChildren(): Array<BaseView> {
            return View._instance.children;
        }
        public static traverse(callback: (obj: BaseView) => void) {
            callback(View._instance);
            if (View._instance.children) {
                View._instance.children.forEach(function (view) {
                    view.traverse(callback);
                });
            }
        }
        public static removeAllChildren(): void {
            var self: View = View._instance;
            if (View._instance.children) {
                View._instance.children.forEach(function (view) {
                    view.traverse(destroyView);
                });
            }
            View._instance._manageTreesView = null;
        }

        public static setMessageView(view: MessageView): void {
            View._instance._messageView = view;
        }
        public static getMessageView(): MessageView {
            return View._instance._messageView;
        }
        public static setNavView(view: NavView): void {
            View._instance._navView = view;
        }
        public static getNavView(): NavView {
            return View._instance._navView;
        }
        public static setPopupView(view: PopupView): void {
            View._instance._popupView = view;
        }
        public static getPopupView(): PopupView {
            return View._instance._popupView;
        }
        public static setManageTreesView(view: ManageTreesView): void {
            View._instance._manageTreesView = view;
        }
        public static getManageTreesView(): ManageTreesView {
            return View._instance._manageTreesView;
        }
        public static removeNavView(): void {
            var self: View = View._instance;
            self._navView.destroy();
            self._navView = null;
        }
    }
}