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
            View._viewStatus = viewStatus;
        };
        View.getViewStatus = function () {
            return View._viewStatus;
        };
        View.setActionStatus = function (actionStatus) {
            View._actionStatus = actionStatus;
        };
        View.getActionStatus = function () {
            return View._actionStatus;
        };
        View.addChild = function (view) {
            var self = View._instance;
            if (self.children == undefined) {
                self.children = new Array();
            }
            self.children.push(view);
        };
        View.getChildren = function () {
            var self = View._instance;
            return self.children;
        };
        View._instance = new View();
        View.TAG = "View - ";
        View._viewStatus = FoodParent.VIEW_STATUS.NONE;
        View._actionStatus = FoodParent.ACTION_STATUS.NONE;
        return View;
    })(FoodParent.BaseView);
    FoodParent.View = View;
})(FoodParent || (FoodParent = {}));
