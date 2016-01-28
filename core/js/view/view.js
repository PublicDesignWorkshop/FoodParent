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
            self._viewStatus = new Array();
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
        }
        View.getInstance = function () {
            return View._instance;
        };
        View.setElement = function (options) {
            View._instance.setElement(options.el);
        };
        View.setViewStatus = function (viewStatus) {
            View._instance._viewStatus.push(viewStatus);
        };
        View.popViewStatus = function () {
            console.log(View.TAG + "popViewStatus()");
            View._instance._viewStatus.pop();
        };
        View.getViewStatus = function () {
            return View._instance._viewStatus[View._instance._viewStatus.length - 1];
        };
        View.getAllViewStatus = function () {
            return View._instance._viewStatus.toString();
        };
        /*
        public static setActionStatus(actionStatus: ACTION_STATUS): void {
            View._instance._actionStatus = actionStatus;
        }
        public static getActionStatus(): ACTION_STATUS {
            return View._instance._actionStatus;
        }
        */
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
        View.traverse = function (callback) {
            callback(View._instance);
            if (View._instance.children) {
                View._instance.children.forEach(function (view) {
                    view.traverse(callback);
                });
            }
        };
        View.removeAllChildren = function () {
            var self = View._instance;
            if (View._instance.children) {
                View._instance.children.forEach(function (view) {
                    if (view) {
                        view.traverse(destroyView);
                    }
                });
            }
            View._instance._manageTreesView = null;
            View._instance._managePeopleView = null;
            View._instance._detailTreeView = null;
            View._instance._manageDonationsView = null;
            View._instance._detailDonationView = null;
        };
        View.setMessageView = function (view) {
            View._instance._messageView = view;
        };
        View.getMessageView = function () {
            return View._instance._messageView;
        };
        View.setNavView = function (view) {
            View._instance._navView = view;
        };
        View.getNavView = function () {
            return View._instance._navView;
        };
        View.setPopupView = function (view) {
            View._instance._popupView = view;
        };
        View.getPopupView = function () {
            return View._instance._popupView;
        };
        View.setManageDonationsView = function (view) {
            View._instance._manageDonationsView = view;
        };
        View.getManageDonationsView = function () {
            return View._instance._manageDonationsView;
        };
        View.setDetailDonationView = function (view) {
            View._instance._detailDonationView = view;
        };
        View.getDetailDonationView = function () {
            return View._instance._detailDonationView;
        };
        View.setManageTreesView = function (view) {
            View._instance._manageTreesView = view;
        };
        View.getManageTreesView = function () {
            return View._instance._manageTreesView;
        };
        View.setManagePeopleView = function (view) {
            View._instance._managePeopleView = view;
        };
        View.getManagePeopleView = function () {
            return View._instance._managePeopleView;
        };
        View.setDetailTreeView = function (view) {
            View._instance._detailTreeView = view;
        };
        View.getDetailTreeView = function () {
            return View._instance._detailTreeView;
        };
        View.removeNavView = function () {
            var self = View._instance;
            self._navView.destroy();
            self._navView = null;
        };
        View.getWidth = function () {
            return $('body').innerWidth();
        };
        View.getHeight = function () {
            return $('body').innerHeight();
        };
        View._instance = new View();
        View.TAG = "View - ";
        return View;
    })(FoodParent.BaseView);
    FoodParent.View = View;
})(FoodParent || (FoodParent = {}));
