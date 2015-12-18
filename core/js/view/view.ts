module FoodParent {
    export class View extends BaseView {
        private static _instance: View = new View();
        private static TAG: string = "View - ";
        private static _viewStatus: VIEW_STATUS = VIEW_STATUS.NONE;
        private static _actionStatus: ACTION_STATUS = ACTION_STATUS.NONE;

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
            View._viewStatus = viewStatus;
        }
        public static getViewStatus(): VIEW_STATUS {
            return View._viewStatus;
        }
        public static setActionStatus(actionStatus: ACTION_STATUS): void {
            View._actionStatus = actionStatus;
        }
        public static getActionStatus(): ACTION_STATUS {
            return View._actionStatus;
        }
        public static addChild(view: BaseView) {
            var self: View = View._instance;
            if (self.children == undefined) {
                self.children = new Array<BaseView>();
            }
            self.children.push(view);
        }
        public static getChildren(): Array<BaseView> {
            var self: View = View._instance;
            return self.children;
        }
    }
}