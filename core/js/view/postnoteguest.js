var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var PostNoteViewForGuest = (function (_super) {
        __extends(PostNoteViewForGuest, _super);
        function PostNoteViewForGuest(options) {
            _super.call(this, options);
            var self = this;
            self.bDebug = true;
            self.events = {
                "click .evt-close": "_mouseClick",
                "click .evt-submit": "_submitNote",
                "click .image-group img": "_applyCoverPicture",
            };
            self.delegateEvents();
        }
        PostNoteViewForGuest.prototype.render = function (args) {
            _super.prototype.render.call(this);
            var self = this;
            if (self.bDebug)
                console.log(PostNoteViewForGuest.TAG + "render()");
            var food = FoodParent.Model.getFoods().findWhere({ id: self._tree.getFoodId() });
            var template = _.template(FoodParent.Template.getPostNoteViewForGuest());
            self.$el.append(template({
                header: "Post Note",
                name: food.getName() + " " + self._tree.getName(),
            }));
            self.setElement($('#wrapper-post-note'));
            self.setVisible();
            self.resize();
            // Create a new note.
            self._note = new FoodParent.Note({ type: FoodParent.NoteType.IMAGE, tree: self._tree.getId(), person: 0, comment: "", picture: "", rate: 0, date: moment(new Date()).format(FoodParent.Setting.getDateTimeFormat()) });
            // Render note info
            self.renderNoteInfo();
            // Register file upload event listner
            self.addFileUploadEventListener();
            return self;
        };
        PostNoteViewForGuest.TAG = "PostNoteViewForGuest - ";
        return PostNoteViewForGuest;
    })(FoodParent.PostNoteView);
    FoodParent.PostNoteViewForGuest = PostNoteViewForGuest;
})(FoodParent || (FoodParent = {}));
