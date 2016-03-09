var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var PopupView = (function (_super) {
        __extends(PopupView, _super);
        function PopupView() {
            _super.apply(this, arguments);
        }
        PopupView.prototype.setVisible = function () {
            var self = this;
            FoodParent.Setting.getPopWrapperElement().removeClass('hidden');
        };
        PopupView.prototype.setInvisible = function () {
            var self = this;
            FoodParent.Setting.getPopWrapperElement().addClass('hidden');
        };
        return PopupView;
    })(FoodParent.BaseView);
    FoodParent.PopupView = PopupView;
})(FoodParent || (FoodParent = {}));
