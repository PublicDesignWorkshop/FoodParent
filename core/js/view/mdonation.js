var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var ManageDonationViewFractory = (function () {
        function ManageDonationViewFractory(args) {
            if (ManageDonationViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use ManageDonationViewFractory.getInstance() instead of new.");
            }
            ManageDonationViewFractory._instance = this;
        }
        ManageDonationViewFractory.getInstance = function () {
            return ManageDonationViewFractory._instance;
        };
        ManageDonationViewFractory.create = function (el, viewMode, id) {
            var view;
            if (viewMode == FoodParent.VIEW_MODE.GRAPHIC) {
                view = new ManageDonationGraphicView({ el: el });
                view.setPlaceId(id);
            }
            else if (viewMode == FoodParent.VIEW_MODE.TABLE) {
            }
            return view;
        };
        ManageDonationViewFractory._instance = new ManageDonationViewFractory();
        return ManageDonationViewFractory;
    })();
    FoodParent.ManageDonationViewFractory = ManageDonationViewFractory;
    var ManageDonationView = (function (_super) {
        __extends(ManageDonationView, _super);
        function ManageDonationView() {
            _super.apply(this, arguments);
        }
        ManageDonationView.prototype.setPlaceId = function (id) {
            this._id = id;
        };
        return ManageDonationView;
    })(FoodParent.BaseView);
    FoodParent.ManageDonationView = ManageDonationView;
    var ManageDonationGraphicView = (function (_super) {
        __extends(ManageDonationGraphicView, _super);
        function ManageDonationGraphicView() {
            _super.apply(this, arguments);
        }
        return ManageDonationGraphicView;
    })(ManageDonationView);
    FoodParent.ManageDonationGraphicView = ManageDonationGraphicView;
})(FoodParent || (FoodParent = {}));
