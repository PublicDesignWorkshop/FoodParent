var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var PostNoteViewForAdmin = (function (_super) {
        __extends(PostNoteViewForAdmin, _super);
        function PostNoteViewForAdmin(options) {
            _super.call(this, options);
            var self = this;
            self.bDebug = true;
            self.events = {};
            self.delegateEvents();
        }
        PostNoteViewForAdmin.TAG = "PostNoteViewForAdmin - ";
        return PostNoteViewForAdmin;
    })(FoodParent.PostNoteView);
    FoodParent.PostNoteViewForAdmin = PostNoteViewForAdmin;
})(FoodParent || (FoodParent = {}));
