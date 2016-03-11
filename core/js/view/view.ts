module FoodParent {
    export class View extends BaseView {
        private static _instance: View = new View();
        private static TAG: string = "View - ";
        private _viewStatus: Array<VIEW_STATUS>;
        private _navView: NavView;
        private _popupViews: Array<PopupView>;
        private _messageView: MessageView;
        private _treesView: TreesView;
        private _managePeopleView: ManagePeopleView;
        private _detailTreeView: DetailTreeView;
        private _manageDonationsView: ManageDonationsView;
        private _detailDonationView: DetailDonationView;

        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            if (View._instance) {
                throw new Error("Error: Instantiation failed: Use View.getInstance() instead of new.");
            }
            View._instance = this;
            var self: View = View._instance;
            self.bDebug = true;
            self._viewStatus = new Array<VIEW_STATUS>();
            self._popupViews = new Array<PopupView>();
            $(window).resize(_.debounce(self.resize, Setting.getResizeTimeout()));
            $(document).bind("keydown", function (event) {
                EventHandler.handleKeyCode(event.keyCode);
            });
        }

        public resize(): any {
            var self: View = View._instance;
            if (View.getNavView()) {
                View.getNavView().resize();
            }
            $.each(self.children, function (index: number, view: BaseView) {
                view.resize();
            });
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
        public static getAllViewStatus(): string {
            return View._instance._viewStatus.toString();
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
                    if (view) {
                        view.traverse(destroyView);
                    }
                });
            }
            View._instance._treesView = null;
            View._instance._managePeopleView = null;
            View._instance._detailTreeView = null;
            View._instance._manageDonationsView = null;
            View._instance._detailDonationView = null;
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
        public static addPopupView(view: PopupView): void {
            View._instance._popupViews.push(view);
        }
        public static getPopupView(): PopupView {
            return View._instance._popupViews[View._instance._popupViews.length - 1];
        }
        public static getPopupViews(): Array<PopupView> {
            return View._instance._popupViews;
        }
        public static resetPopupViews(): void {
            View._instance._popupViews = new Array<PopupView>();
        }
        public static removePopupView(): void {
            View._instance._popupViews.pop();
        }
        public static setManageDonationsView(view: ManageDonationsView): void {
            View._instance._manageDonationsView = view;
        }
        public static getManageDonationsView(): ManageDonationsView {
            return View._instance._manageDonationsView;
        }
        public static setDetailDonationView(view: DetailDonationView): void {
            View._instance._detailDonationView = view;
        }
        public static getDetailDonationView(): DetailDonationView {
            return View._instance._detailDonationView;
        }
        public static setTreesView(view: TreesView): void {
            View._instance._treesView = view;
        }
        public static getTreesView(): TreesView {
            return View._instance._treesView;
        }
        public static setManagePeopleView(view: ManagePeopleView): void {
            View._instance._managePeopleView = view;
        }
        public static getManagePeopleView(): ManagePeopleView {
            return View._instance._managePeopleView;
        }
        public static setDetailTreeView(view: DetailTreeView): void {
            View._instance._detailTreeView = view;
        }
        public static getDetailTreeView(): DetailTreeView {
            return View._instance._detailTreeView;
        }
        public static removeNavView(): void {
            var self: View = View._instance;
            self._navView.destroy();
            self._navView = null;
        }

        public static getWidth(): number {
            return $('body').innerWidth();
        }
        public static getHeight(): number {
            return $('body').innerHeight();
        }
    }
}