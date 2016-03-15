var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var EditNoteViewFactory = (function () {
        function EditNoteViewFactory(args) {
            if (EditNoteViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use EditNoteViewFactory.getInstance() instead of new.");
            }
            EditNoteViewFactory._instance = this;
        }
        EditNoteViewFactory.getInstance = function () {
            return EditNoteViewFactory._instance;
        };
        EditNoteViewFactory.create = function (el, note, credential) {
            var view;
            if (credential == FoodParent.CREDENTIAL_MODE.GUEST) {
                view = new FoodParent.EditNoteViewForGuest({ el: el });
            }
            else if (credential == FoodParent.CREDENTIAL_MODE.PARENT) {
                view = new FoodParent.EditNoteViewForParent({ el: el });
            }
            else if (credential == FoodParent.CREDENTIAL_MODE.ADMIN) {
                view = new FoodParent.EditNoteViewForAdmin({ el: el });
            }
            view.setNote(note);
            return view;
        };
        EditNoteViewFactory._instance = new EditNoteViewFactory();
        return EditNoteViewFactory;
    })();
    FoodParent.EditNoteViewFactory = EditNoteViewFactory;
    var EditNoteView = (function (_super) {
        __extends(EditNoteView, _super);
        function EditNoteView(options) {
            _super.call(this, options);
            this._bAuthor = false;
            var self = this;
            self.bDebug = true;
            self.events = {};
            self.delegateEvents();
        }
        EditNoteView.prototype.setNote = function (note) {
            var self = this;
            self._note = note;
        };
        EditNoteView.prototype.update = function (args) {
            _super.prototype.update.call(this, args);
            var self = this;
            if (self.bDebug)
                console.log(EditNoteView.TAG + "update()");
        };
        EditNoteView.prototype.render = function (args) {
            _super.prototype.render.call(this, args);
            var self = this;
            if (self.bDebug)
                console.log(EditNoteView.TAG + "render()");
            /*
            var tree: Tree = Model.getTrees().findWhere({ id: self._note.getTreeId() });
            var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
            var person: Person = Model.getPersons().findWhere({ id: self._note.getPersonId() });

            Controller.checkLogin(function (response1) {
                var bLogin: boolean = false;
                self._bAuthor = false;
                if (response1.result == true || response1.result == 'true') {   // Logged in
                    bLogin = true;
                }
                if (bLogin && parseInt(response1.id) == self._note.getPersonId()) {
                    self._bAuthor = true;
                }

                Controller.checkAdmin(function (response2) {
                    if (response2.result == true || response2.result == 'true') {   // admin
                        self._bAuthor = true;
                    }
                    if (self._bAuthor) {
                        if (person != undefined) {
                            var template = _.template(Template.getImageNoteViewTemplate());
                            var data = {
                                name: food.getName() + " " + tree.getName(),
                                image: Setting.getBlankImagePath(),
                                value: self._note.getRate(),
                                comment: self._note.getComment(),
                                date: self._note.getFormattedHourTime(),
                                author: person.getName(),
                            }
                            $('#wrapper-pop').html(template(data));
                        } else {
                            var template = _.template(Template.getImageNoteViewTemplate());
                            var data = {
                                name: food.getName() + " " + tree.getName(),
                                image: Setting.getBlankImagePath(),
                                value: self._note.getRate(),
                                comment: self._note.getComment(),
                                date: self._note.getFormattedHourTime(),
                                author: "Unknown",
                            }
                            $('#wrapper-pop').html(template(data));
                        }
                        self.setElement($('#wrapper-note'));
                        self.renderImageNote();
                        self.setVisible();
                        self.resize();
                    } else {
                        var template = _.template(Template.getImageNoteViewTemplate2());
                        if (person != undefined) {
                            var data = {
                                name: food.getName() + " " + tree.getName(),
                                image: Setting.getBlankImagePath(),
                                value: self._note.getRate(),
                                comment: self._note.getComment(),
                                date: self._note.getFormattedDate(),
                                author: person.getName(),
                            }
                            $('#wrapper-pop').html(template(data));
                            self.setElement($('#wrapper-note'));
                        } else {
                            var data = {
                                name: food.getName() + " " + tree.getName(),
                                image: Setting.getBlankImagePath(),
                                value: self._note.getRate(),
                                comment: self._note.getComment(),
                                date: self._note.getFormattedDate(),
                                author: "Unknown",
                            }
                            $('#wrapper-pop').html(template(data));
                            self.setElement($('#wrapper-note'));
                        }


                        self.renderImageNote();
                        self.setVisible();
                        self.resize();
                    }
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            }, function (response1) {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
            */
            return self;
        };
        EditNoteView.prototype.renderNoteInfo = function () { };
        EditNoteView.prototype.renderNoteImages = function () {
            var self = this;
            var tag = '';
            $.each(self._note.getPictures(), function (index, filename) {
                if (index == 0) {
                    tag += '<img src="' + FoodParent.Setting.getBlankImagePath() + '" data-target="' + index + '" class="selected" />';
                }
                else {
                    tag += '<img src="' + FoodParent.Setting.getBlankImagePath() + '" data-target="' + index + '" />';
                }
            });
            self.$('.image-group').html(tag);
            $.each(self.$('.image-group img'), function (index, element) {
                $(element).attr('src', FoodParent.Setting.getContentPictureDir() + self._note.getPictures()[index]).load(function () {
                }).error(function () {
                    $(element).attr('src', FoodParent.Setting.getBlankImagePath());
                });
            });
        };
        EditNoteView.prototype._prevNote = function (event) {
            var self = this;
            var notes = new FoodParent.Notes(FoodParent.Model.getNotes().where({ tree: self._note.getTreeId(), type: FoodParent.NoteType.IMAGE }));
            notes.sortByAscendingDate();
            var bFound = false;
            $.each(notes.models, function (index, note) {
                if (self._note.getId() == note.getId() && !bFound) {
                    bFound = true;
                    if (index == 0) {
                        self._note = notes.models[notes.models.length - 1];
                    }
                    else {
                        self._note = notes.models[index - 1];
                    }
                    self.update();
                    return;
                }
            });
        };
        EditNoteView.prototype._nextNote = function (event) {
            var self = this;
            var notes = new FoodParent.Notes(FoodParent.Model.getNotes().where({ tree: self._note.getTreeId(), type: FoodParent.NoteType.IMAGE }));
            notes.sortByAscendingDate();
            var bFound = false;
            $.each(notes.models, function (index, note) {
                if (self._note.getId() == note.getId() && !bFound) {
                    bFound = true;
                    if (index == notes.models.length - 1) {
                        self._note = notes.models[0];
                    }
                    else {
                        self._note = notes.models[index + 1];
                    }
                    self.update();
                    return;
                }
            });
        };
        /**
         * Event listener for uploading files
         */
        EditNoteView.prototype.addFileUploadEventListener = function () {
            var self = this;
            var tree = FoodParent.Model.getTrees().findWhere({ id: self._note.getTreeId() });
            var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
            self.$('input[type=file]').off('change');
            self.$('input[type=file]').on('change', function (event) {
                self.$('.wrapper-input-upload-picture').addClass('hidden');
                self.$('.wrapper-uploading-picture').removeClass('hidden');
                var files = event.target.files;
                if (files.length > 0) {
                    FoodParent.Controller.uploadNotePictureFile(files[0], food.getName() + "_" + tree.getId(), function (fileName) {
                        FoodParent.EventHandler.handleNoteData(self._note, FoodParent.DATA_MODE.ADD_PICTURE, { filename: fileName }, function () {
                            FoodParent.EventHandler.handleDataChange("<strong><i>" + fileName + "</i></strong> has been added successfully.", true);
                            // Success
                            self.$('input[type=file]').val("");
                            self.$('.wrapper-uploading-picture').addClass('hidden');
                            self.$('.wrapper-input-upload-picture').removeClass('hidden');
                            self.renderNoteImages();
                        }, function () {
                            FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                        }, function () {
                            FoodParent.EventHandler.handleDataChange("<strong><i>" + fileName + "</i></strong> has been removed successfully.", true);
                            // Success
                            self.$('input[type=file]').val("");
                            self.$('.wrapper-uploading-picture').addClass('hidden');
                            self.$('.wrapper-input-upload-picture').removeClass('hidden');
                            self.renderNoteImages();
                        });
                        //self._note.addPicture(fileName);
                    }, function () {
                        // Error
                        self.$('.wrapper-uploading-picture').addClass('hidden');
                        self.$('.wrapper-input-upload-picture').removeClass('hidden');
                    });
                }
            });
        };
        EditNoteView.prototype._applyCoverPicture = function (event) {
            var self = this;
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
        };
        EditNoteView.prototype._mouseClick = function (event) {
            var self = this;
            FoodParent.EventHandler.handleMouseClick($(event.currentTarget), self, { note: self._note.getId() });
        };
        EditNoteView.prototype.renderImageNote = function () {
            var self = this;
            var tree = FoodParent.Model.getTrees().findWhere({ id: self._note.getTreeId() });
            var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
            self.$('.name').html(food.getName() + " " + tree.getName());
            self.$('.input-rating').replaceWith('<div class="input-rating"></div>');
            self.$('.input-rating').html(Math.ceil(self._note.getRate()).toFixed(2) + " / " + FoodParent.Setting.getMaxRating().toFixed(2));
            self.$('.input-rating-slider').html("");
            var rate = rating(self.$('.input-rating-slider')[0], (self._note.getRate() + 1).toFixed(2), FoodParent.Setting.getMaxRating() + 1, function (rate) {
                if (self._bAuthor) {
                    if (Math.ceil(self._note.getRate()) != (rate - 1)) {
                        FoodParent.EventHandler.handleNoteData(self._note, FoodParent.DATA_MODE.UPDATE_RATING, { rate: (rate - 1) }, function () {
                            FoodParent.EventHandler.handleDataChange("Rating of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                            self.renderImageNote();
                        }, function () {
                            FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    }
                    else {
                        self.renderImageNote();
                    }
                }
                else {
                    self.renderImageNote();
                }
            });
            if (self._bAuthor) {
                var today = new Date();
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
                            self.renderImageNote();
                        }, function () {
                            FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                        //self._note.setDate(moment(this.get()).hour(moment(new Date()).hour()));
                        //self.renderImageNote(note);
                    }
                });
                self.$('.input-date').pickadate('picker').set('select', self._note.getFormattedDate(), { format: 'dd mmm yyyy' });
                self.$('.input-comment').replaceWith('<div class="input-comment"></div>');
                self.$('.input-comment').html(htmlDecode(self._note.getComment()));
                self.$('.input-comment').on('click', function (event) {
                    //$(this).replaceWith("<input type='text' class='input-comment form-control' value='" + htmlEncode($(this).text()) + "' />");
                    $(this).replaceWith("<textarea rows='5' class='input-comment form-control'>" + self._note.getComment() + "</textarea>");
                    //self.$('.input-lat').css({ width: width });
                    self.$('.input-comment').focus();
                    self.$('.input-comment').on('focusout', function (event) {
                        var comment = self.$('.input-comment').val();
                        if (self._note.getComment().trim() != comment.trim()) {
                            FoodParent.EventHandler.handleNoteData(self._note, FoodParent.DATA_MODE.UPDATE_COMMENT, { comment: comment }, function () {
                                FoodParent.EventHandler.handleDataChange("Comment of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                                self.renderImageNote();
                            }, function () {
                                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                            });
                        }
                        else {
                            self.renderImageNote();
                        }
                    });
                });
            }
            self.renderNoteImages();
            if (self._bAuthor) {
            }
        };
        EditNoteView.TAG = "EditNoteView - ";
        return EditNoteView;
    })(FoodParent.PopupView);
    FoodParent.EditNoteView = EditNoteView;
})(FoodParent || (FoodParent = {}));
