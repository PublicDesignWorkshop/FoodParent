var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var PostNoteViewForParent = (function (_super) {
        __extends(PostNoteViewForParent, _super);
        function PostNoteViewForParent(options) {
            _super.call(this, options);
            var self = this;
            self.bDebug = true;
            self.events = {};
            self.delegateEvents();
        }
        PostNoteViewForParent.TAG = "PostNoteViewForParent - ";
        return PostNoteViewForParent;
    })(FoodParent.PostNoteView);
    FoodParent.PostNoteViewForParent = PostNoteViewForParent;
})(FoodParent || (FoodParent = {}));
