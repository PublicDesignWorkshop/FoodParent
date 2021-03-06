var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var EditNoteViewForParent = (function (_super) {
        __extends(EditNoteViewForParent, _super);
        function EditNoteViewForParent(options) {
            _super.call(this, options);
            var self = this;
            self.bDebug = true;
            self.events = {
                "click .evt-close": "_mouseClick",
                "click .evt-prev": "_prevNote",
                "click .evt-next": "_nextNote",
                "click .image-group img": "_applyCoverPicture",
                "click .evt-delete": "_deleteNote",
            };
            self.delegateEvents();
        }
        EditNoteViewForParent.prototype.render = function (args) {
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
        EditNoteViewForParent.prototype.update = function (args) {
            _super.prototype.update.call(this, args);
            var self = this;
            if (self.bDebug)
                console.log(EditNoteViewForParent.TAG + "update()");
            // Render note info
            self.renderNoteInfo();
            // Render pictures
            self.renderNoteImages();
        };
        EditNoteViewForParent.prototype.renderNoteInfo = function () {
            var self = this;
            if (self.bDebug)
                console.log(EditNoteViewForParent.TAG + "renderNoteInfo()");
            FoodParent.Controller.checkIsLoggedIn(function (response) {
                var parent = FoodParent.Model.getPersons().findWhere({ id: self._note.getPersonId() });
                var tree = FoodParent.Model.getTrees().findWhere({ id: self._note.getTreeId() });
                var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                var bAuthor = false;
                if (parseInt(response.id) == parent.getId()) {
                    bAuthor = true;
                }
                self.$('.input-rating').replaceWith('<div class="input-rating"></div>');
                self.$('.input-rating').html(Math.ceil(self._note.getRate()).toFixed(2) + " / " + FoodParent.Setting.getMaxRating().toFixed(2));
                self.$('.input-rating-slider').html("");
                if (bAuthor) {
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
                }
                else {
                    self.$('.input-rating-slider').html("");
                    var rate = rating(self.$('.input-rating-slider')[0], (self._note.getRate() + 1).toFixed(2), FoodParent.Setting.getMaxRating() + 1, function (rate) {
                        self.renderNoteInfo();
                    });
                }
                self.$('.input-comment').replaceWith('<div class="input-comment"></div>');
                self.$('.input-comment').html(htmlDecode(self._note.getComment()));
                if (bAuthor) {
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
                }
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
                        if (bAuthor) {
                            FoodParent.EventHandler.handleNoteData(self._note, FoodParent.DATA_MODE.UPDATE_DATE, { date: moment(this.get()).hour(moment(new Date()).hour()).format(FoodParent.Setting.getDateTimeFormat()) }, function () {
                                FoodParent.EventHandler.handleDataChange("Date of this <strong><i>Note</i></strong> has changed successfully.", true);
                                self.renderNoteInfo();
                            }, function () {
                                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                            });
                        }
                        else {
                            self._note.setDate(moment(this.get()).hour(moment(new Date()).hour()));
                            self.renderNoteInfo();
                        }
                    }
                });
                if (bAuthor) {
                    self.$('.input-date').removeAttr('disabled');
                }
                else {
                    self.$('.input-date').attr({ 'disabled': true });
                }
                // Fill out name of the author
                self.$('.input-contact').html(parent.getName());
                // Hide some unecesarry buttons
                if (bAuthor) {
                    self.$('.input-upload-picture').removeClass('hidden');
                    self.$('.delete-group').removeClass('hidden');
                }
                else {
                    self.$('.input-upload-picture').addClass('hidden');
                    self.$('.delete-group').addClass('hidden');
                }
            }, function (response) {
                Backbone.history.loadUrl(Backbone.history.fragment);
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        };
        EditNoteViewForParent.prototype._applyCoverPicture = function (event) {
            var self = this;
            var parent = FoodParent.Model.getPersons().findWhere({ id: self._note.getPersonId() });
            FoodParent.Controller.checkIsLoggedIn(function (response) {
                if (parseInt(response.id) == parent.getId()) {
                    var cover = parseInt($(event.target).attr('data-target'));
                    var tree = FoodParent.Model.getTrees().findWhere({ id: self._note.getTreeId() });
                    var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                    if (cover != 0) {
                        FoodParent.EventHandler.handleNoteData(self._note, FoodParent.DATA_MODE.UPDATE_COVER, { cover: cover }, function () {
                            FoodParent.EventHandler.handleDataChange("Cover picture of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                            self.renderImageNote();
                        }, function () {
                            FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    }
                }
            }, function () {
                Backbone.history.loadUrl(Backbone.history.fragment);
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        };
        EditNoteViewForParent.prototype._deleteNote = function (event) {
            var self = this;
            var parent = FoodParent.Model.getPersons().findWhere({ id: self._note.getPersonId() });
            FoodParent.Controller.checkIsLoggedIn(function (response) {
                FoodParent.EventHandler.handleMouseClick($(event.currentTarget), self, { note: self._note.getId() });
            }, function () {
                Backbone.history.loadUrl(Backbone.history.fragment);
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        };
        EditNoteViewForParent.TAG = "EditNoteViewForParent - ";
        return EditNoteViewForParent;
    })(FoodParent.EditNoteView);
    FoodParent.EditNoteViewForParent = EditNoteViewForParent;
})(FoodParent || (FoodParent = {}));
