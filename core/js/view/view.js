var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var View = (function (_super) {
        __extends(View, _super);
        function View(options) {
            _super.call(this, options);
            this._viewStatus = FoodParent.VIEW_STATUS.NONE;
            this._actionStatus = FoodParent.ACTION_STATUS.NONE;
            if (View._instance) {
                throw new Error("Error: Instantiation failed: Use View.getInstance() instead of new.");
            }
            View._instance = this;
            var self = View._instance;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
        }
        View.getInstance = function () {
            return View._instance;
        };
        View.setElement = function (options) {
            View._instance.setElement(options.el);
        };
        View.setViewStatus = function (viewStatus) {
            View._instance._viewStatus = viewStatus;
        };
        View.getViewStatus = function () {
            return View._instance._viewStatus;
        };
        View.setActionStatus = function (actionStatus) {
            View._instance._actionStatus = actionStatus;
        };
        View.getActionStatus = function () {
            return View._instance._actionStatus;
        };
        View.addChild = function (view) {
            var self = View._instance;
            if (self.children == undefined) {
                self.children = new Array();
            }
            self.children.push(view);
        };
        View.getChildren = function () {
            return View._instance.children;
        };
        View.setNavView = function (view) {
            View._instance._navView = view;
        };
        View.getNavView = function () {
            return View._instance._navView;
        };
        View.removeNavView = function () {
            var self = View._instance;
            self._navView.destroy();
            self._navView = null;
        };
        View._instance = new View();
        View.TAG = "View - ";
        return View;
    })(FoodParent.BaseView);
    FoodParent.View = View;
})(FoodParent || (FoodParent = {}));
