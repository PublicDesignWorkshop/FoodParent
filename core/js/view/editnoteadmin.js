var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var EditNoteViewForAdmin = (function (_super) {
        __extends(EditNoteViewForAdmin, _super);
        function EditNoteViewForAdmin(options) {
            _super.call(this, options);
            var self = this;
            self.bDebug = true;
            self.events = {
                "click .evt-close": "_mouseClick",
                "click .evt-prev": "_prevNote",
                "click .evt-next": "_nextNote",
                "click .image-group img": "_applyCoverPicture",
                "click .evt-delete": "_mouseClick",
            };
            self.delegateEvents();
        }
        EditNoteViewForAdmin.prototype.render = function (args) {
            _super.prototype.render.call(this, args);
            var self = this;
            var tree = FoodParent.Model.getTrees().findWhere({ id: self._note.getTreeId() });
            var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
            var template = _.template(FoodParent.Template.getEditNoteViewForAdmin());
            self.$el.append(template({
                header: "Tree Note",
                name: food.getName() + " " + tree.getName(),
            }));
            self.setElement($('#wrapper-post-note'));
            self.setVisible();
            self.resize();
            // Render note info
            self.renderNoteInfo();
            // Render pictures
            self.renderNoteImages();
            // Register file upload event listner
            self.addFileUploadEventListener();
            return self;
        };
        EditNoteViewForAdmin.prototype.update = function (args) {
            _super.prototype.update.call(this, args);
            var self = this;
            if (self.bDebug)
                console.log(EditNoteViewForAdmin.TAG + "update()");
            // Render note info
            self.renderNoteInfo();
            // Render pictures
            self.renderNoteImages();
        };
        EditNoteViewForAdmin.prototype.renderNoteInfo = function () {
            var self = this;
            if (self.bDebug)
                console.log(EditNoteViewForAdmin.TAG + "renderNoteInfo()");
            var parent = FoodParent.Model.getPersons().findWhere({ id: self._note.getPersonId() });
            var tree = FoodParent.Model.getTrees().findWhere({ id: self._note.getTreeId() });
            var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
            self.$('.input-rating').replaceWith('<div class="input-rating"></div>');
            self.$('.input-rating').html(Math.ceil(self._note.getRate()).toFixed(2) + " / " + FoodParent.Setting.getMaxRating().toFixed(2));
            self.$('.input-rating-slider').html("");
            var rate = rating(self.$('.input-rating-slider')[0], (self._note.getRate() + 1).toFixed(2), FoodParent.Setting.getMaxRating() + 1, function (rate) {
                if (Math.ceil(self._note.getRate()) != (rate - 1)) {
                    FoodParent.EventHandler.handleNoteData(self._note, FoodParent.DATA_MODE.UPDATE_RATING, { rate: (rate - 1) }, function () {
                        FoodParent.EventHandler.handleDataChange("Rating of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                        self.renderNoteInfo();
                    }, function () {
                        FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                }
                else {
                    self.renderNoteInfo();
                }
            });
            self.$('.input-comment').replaceWith('<div class="input-comment"></div>');
            self.$('.input-comment').html(htmlDecode(self._note.getComment()));
            self.$('.input-comment').on('click', function (event) {
                $(this).replaceWith("<textarea rows='5' class='input-comment form-control'>" + self._note.getComment() + "</textarea>");
                self.$('.input-comment').focus();
                self.$('.input-comment').on('focusout', function (event) {
                    var comment = self.$('.input-comment').val();
                    if (self._note.getComment().trim() != comment.trim()) {
                        FoodParent.EventHandler.handleNoteData(self._note, FoodParent.DATA_MODE.UPDATE_COMMENT, { comment: comment }, function () {
                            FoodParent.EventHandler.handleDataChange("Comment of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                            self.renderNoteInfo();
                        }, function () {
                            FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    }
                    else {
                        self.renderNoteInfo();
                    }
                });
            });
            var today = new Date();
            self.$('.text-note-date').html(self._note.getFormattedDate());
            self.$('.input-date').attr({ 'data-value': self._note.getFormattedDate() });
            self.$('.input-date').pickadate({
                format: "dd mmm yyyy",
                today: 'Today',
                max: today,
                clear: '',
                close: 'Close',
                onClose: function () {
                    FoodParent.EventHandler.handleNoteData(self._note, FoodParent.DATA_MODE.UPDATE_DATE, { date: moment(this.get()).hour(moment(new Date()).hour()).format(FoodParent.Setting.getDateTimeFormat()) }, function () {
                        FoodParent.EventHandler.handleDataChange("Date of this <strong><i>Note</i></strong> has changed successfully.", true);
                        self.renderNoteInfo();
                    }, function () {
                        FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                }
            });
            // Fill out name of the author
            self.$('.input-contact').html(parent.getName());
        };
        EditNoteViewForAdmin.TAG = "EditNoteViewForAdmin - ";
        return EditNoteViewForAdmin;
    })(FoodParent.EditNoteView);
    FoodParent.EditNoteViewForAdmin = EditNoteViewForAdmin;
})(FoodParent || (FoodParent = {}));
