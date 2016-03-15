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
            self.events = {
                "click .evt-close": "_mouseClick",
                "click .evt-submit": "_submitNote",
                "click .image-group img": "_applyCoverPicture",
            };
            self.delegateEvents();
        }
        PostNoteViewForAdmin.prototype.render = function (args) {
            _super.prototype.render.call(this);
            var self = this;
            if (self.bDebug)
                console.log(PostNoteViewForAdmin.TAG + "render()");
            var food = FoodParent.Model.getFoods().findWhere({ id: self._tree.getFoodId() });
            var template = _.template(FoodParent.Template.getPostNoteViewForAdmin());
            self.$el.append(template({
                header: "Post Note",
                name: food.getName() + " " + self._tree.getName(),
            }));
            self.setElement($('#wrapper-post-note'));
            self.setVisible();
            self.resize();
            FoodParent.Controller.checkIsLoggedIn(function (response) {
                // Create a new note.
                self._note = new FoodParent.Note({ type: FoodParent.NoteType.IMAGE, tree: self._tree.getId(), person: parseInt(response.id), comment: "", picture: "", rate: 0, date: moment(new Date()).format(FoodParent.Setting.getDateTimeFormat()) });
                var parent = FoodParent.Model.getPersons().findWhere({ id: parseInt(response.id) });
                // Fill out name of the author
                self.$('.input-contact').html(parent.getName());
                // Render note info
                self.renderNoteInfo();
                // Register file upload event listner
                self.addFileUploadEventListener();
            }, function (response) {
                new FoodParent.ResetPopupViewCommand().execute();
                Backbone.history.loadUrl(Backbone.history.fragment);
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
            return self;
        };
        PostNoteViewForAdmin.TAG = "PostNoteViewForAdmin - ";
        return PostNoteViewForAdmin;
    })(FoodParent.PostNoteView);
    FoodParent.PostNoteViewForAdmin = PostNoteViewForAdmin;
})(FoodParent || (FoodParent = {}));
