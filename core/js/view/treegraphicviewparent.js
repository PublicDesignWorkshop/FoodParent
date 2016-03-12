var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var TreeGraphicViewForParent = (function (_super) {
        __extends(TreeGraphicViewForParent, _super);
        function TreeGraphicViewForParent(options) {
            _super.call(this, options);
            var self = this;
            self.bDebug = true;
            self.events = {
                "click .btn-date": "_applyDatePreset",
            };
            self.delegateEvents();
        }
        TreeGraphicViewForParent.TAG = "TreeGraphicViewForGuest - ";
        return TreeGraphicViewForParent;
    })(FoodParent.TreeGraphicView);
    FoodParent.TreeGraphicViewForParent = TreeGraphicViewForParent;
})(FoodParent || (FoodParent = {}));
