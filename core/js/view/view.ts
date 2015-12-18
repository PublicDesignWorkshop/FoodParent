module FoodParent {
    export class View extends BaseView {
        private static _instance: View = new View();
        private static TAG: string = "View - ";
        private _viewStatus: VIEW_STATUS = VIEW_STATUS.NONE;
        private _actionStatus: ACTION_STATUS = ACTION_STATUS.NONE;
        private _navView: NavView;

        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            if (View._instance) {
                throw new Error("Error: Instantiation failed: Use View.getInstance() instead of new.");
            }
            View._instance = this;
            var self: View = View._instance;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
        }
        public static getInstance(): View {
            return View._instance;
        }
        public static setElement(options?: Backbone.ViewOptions<Backbone.Model>): void {
            View._instance.setElement(options.el);
        }
        public static setViewStatus(viewStatus: VIEW_STATUS): void {
            View._instance._viewStatus = viewStatus;
        }
        public static getViewStatus(): VIEW_STATUS {
            return View._instance._viewStatus;
        }
        public static setActionStatus(actionStatus: ACTION_STATUS): void {
            View._instance._actionStatus = actionStatus;
        }
        public static getActionStatus(): ACTION_STATUS {
            return View._instance._actionStatus;
        }
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
        public static setNavView(view: NavView): void {
            View._instance._navView = view;
        }
        public static getNavView(): NavView {
            return View._instance._navView;
        }
        public static removeNavView(): void {
            var self: View = View._instance;
            self._navView.destroy();
            self._navView = null;
        }
    }
}