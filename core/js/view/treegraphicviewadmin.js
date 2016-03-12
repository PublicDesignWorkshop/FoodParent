var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var TreeGraphicViewForAdmin = (function (_super) {
        __extends(TreeGraphicViewForAdmin, _super);
        function TreeGraphicViewForAdmin(options) {
            _super.call(this, options);
            var self = this;
            self.bDebug = true;
            self.events = {
                "click .btn-date": "_applyDatePreset",
            };
            self.delegateEvents();
        }
        TreeGraphicViewForAdmin.TAG = "TreeGraphicViewForGuest - ";
        return TreeGraphicViewForAdmin;
    })(FoodParent.TreeGraphicView);
    FoodParent.TreeGraphicViewForAdmin = TreeGraphicViewForAdmin;
})(FoodParent || (FoodParent = {}));
