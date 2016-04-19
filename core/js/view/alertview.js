var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
function (FoodParent) {
    var AlertView = (function (_super) {
        __extends(AlertView, _super);
        function AlertView(options) {
            _super.call(this, options);
            var self = this;
            self.bDebug = true;
            self.events = {
                "click .evt-close": "_mouseClick",
            };
            self.delegateEvents();
        }
        AlertView.prototype.setErrorMode = function (errorMode) {
            var self = this;
            self._errorMode = errorMode;
        };
        AlertView.prototype.setCustomMessage = function (message) {
            var self = this;
            self._customMessage = message;
        };
        AlertView.prototype.render = function (args) {
            _super.prototype.render.call(this, args);
            var self = this;
            if (self.bDebug)
                console.log(AlertView.TAG + "render()");
            var tag = "";
            switch (self._errorMode) {
                case FoodParent.ERROR_MODE.GEO_PERMISSION_ERROR:
                    tag += "<p>The device cannot find its's location information.<br />Please turn Geolocation setting on & refresh the page.</p>";
                    break;
                case FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR:
                    tag += "<p>There is a server connection error.<br/>If the issue keeps occuring,";
                    tag += "<br/>please contact <a href='mailto:" + FoodParent.Setting.getDevContact() + "'>" + FoodParent.Setting.getDevContact() + "</a>.</p>";
                    break;
                case FoodParent.ERROR_MODE.SEVER_RESPONSE_ERROR:
                    tag += "<p>" + self._customMessage;
                    tag += "<br/>please contact <a href='mailto:" + FoodParent.Setting.getDevContact() + "'>" + FoodParent.Setting.getDevContact() + "</a>.</p>";
                    break;
            }
            var template = _.template(FoodParent.Template.getAlertViewTemplate());
            self.$el.append(template({
                header: "Error!",
                message: tag,
            }));
            self.setElement(self.$('#wrapper-confirm'));
            self.setVisible();
            return self;
        };
        AlertView.prototype._mouseClick = function (event) {
            var self = this;
            FoodParent.EventHandler.handleMouseClick($(event.currentTarget), self);
        };
        AlertView.TAG = "AlertView - ";
        return AlertView;
    })(FoodParent.PopupView);
    FoodParent.AlertView = AlertView;
    var ImageNoteViewFactory = (function () {
        function ImageNoteViewFactory(args) {
            if (ImageNoteViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use ImageNoteViewFactory.getInstance() instead of new.");
            }
            ImageNoteViewFactory._instance = this;
        }
        ImageNoteViewFactory.getInstance = function () {
            return ImageNoteViewFactory._instance;
        };
        ImageNoteViewFactory.create = function (el, note) {
            var view = new ImageNoteView({ el: el });
            view.setNote(note);
            return view;
        };
        ImageNoteViewFactory._instance = new ImageNoteViewFactory();
        return ImageNoteViewFactory;
    })();
    FoodParent.ImageNoteViewFactory = ImageNoteViewFactory;
    var AlertViewFractory = (function () {
        function AlertViewFractory(args) {
            if (AlertViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use AlertViewFractory.getInstance() instead of new.");
            }
            AlertViewFractory._instance = this;
        }
        AlertViewFractory.getInstance = function () {
            return AlertViewFractory._instance;
        };
        AlertViewFractory.create = function (el, errorMode, customMessage) {
            var view = new AlertView({ el: el });
            view.setErrorMode(errorMode);
            if (customMessage) {
                view.setCustomMessage(customMessage);
            }
            return view;
        };
        AlertViewFractory._instance = new AlertViewFractory();
        return AlertViewFractory;
    })();
    FoodParent.AlertViewFractory = AlertViewFractory;
    var ImageNoteView = (function (_super) {
        __extends(ImageNoteView, _super);
        function ImageNoteView(options) {
            _super.call(this, options);
            this._bAuthor = false;
            var self = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = {
                "click .alert-confirm": "_mouseClick",
                "click .top-right-button": "_mouseClick",
                "click .prev-note": "_prevNote",
                "click .next-note": "_nextNote",
                "click .image-group img": "_changeCoverImage",
                "click .delete-note": "_deleteNote",
            };
            self.delegateEvents();
        }
        ImageNoteView.prototype.setNote = function (note) {
            var self = this;
            self._note = note;
        };
        ImageNoteView.prototype.render = function (args) {
            //if (this.bRendered) {
            //    this.update(args);
            //    return;
            //}
            this.bRendered = true;
            /////
            var self = this;
            if (self.bDebug)
                console.log(ImageNoteView.TAG + "render()");
            var tree = FoodParent.Model.getTrees().findWhere({ id: self._note.getTreeId() });
            var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
            var person = FoodParent.Model.getPersons().findWhere({ id: self._note.getPersonId() });
            FoodParent.Controller.checkLogin(function (response1) {
                var bLogin = false;
                self._bAuthor = false;
                if (response1.result == true || response1.result == 'true') {
                    bLogin = true;
                }
                if (bLogin && parseInt(response1.id) == self._note.getPersonId()) {
                    self._bAuthor = true;
                }
                FoodParent.Controller.checkAdmin(function (response2) {
                  var template = _.template(FoodParent.Template.getImageNoteViewTemplate2());
                  if (response2.result == true || response2.result == 'true') {
                      self._bAuthor = true;
                  }
                  var origAmount = self._note.getAmount();
                  var amountLabel = (origAmount / 454).toFixed(1) + " lbs. (";
                  if (origAmount > 10000) {
                    amountLabel += (origAmount / 1000).toFixed(1) + " kg)";
                  } else {
                    amountLabel += origAmount + " grams)";
                  }
                  var data = {
                      name: food.getName() + " " + tree.getName(),
                      image: FoodParent.Setting.getBlankImagePath(),
                      value: self._note.getRate(),
                      comment: self._note.getComment(),
                      amount: amountLabel,
                      date: self._note.getFormattedHourTime(),
                      author: "Unknown",
                  };
                  if (person != undefined) {
                      data.author = person.getName();
                  }
                  if (self._bAuthor) {
                    template = _.template(FoodParent.Template.getImageNoteViewTemplate());
                  }
                  $('#wrapper-pop').html(template(data));
                  self.setElement($('#wrapper-note'));
                  self.renderImageNote();
                  self.setVisible();
                  self.resize();
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            }, function (response1) {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
            return self;
        };
        ImageNoteView.prototype.renderImageNote = function () {
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
                            FoodParent.EventHandler.handleDataChange("Rating of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> was changed successfully.", true);
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
                            FoodParent.EventHandler.handleDataChange("Date of this <strong><i>Note</i></strong> was changed successfully.", true);
                            self.renderImageNote();
                        }, function () {
                            FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                        //self._note.setDate(moment(this.get()).hour(moment(new Date()).hour()));
                        //self.renderImageNote(note);
                    }
                });
                self.$('.input-date').pickadate('picker').set('select', self._note.getFormattedDate(), { format: 'dd mmm yyyy' });
                self.$('.input-amount').replaceWith('<div class="input-amount"></div>');
                var origAmount = self._note.getAmount();
                var amountLabel = (origAmount / 454).toFixed(1) + " lbs. (";
                if (origAmount > 10000) {
                  amountLabel += (origAmount / 1000).toFixed(1) + " kg)";
                } else {
                  amountLabel += origAmount + " grams)";
                }
                self.$('.input-amount').html(amountLabel);
                self.$('.input-amount').on('click', function (event) {
                  $(this).replaceWith("<input type='number' min=0 class='input-amount form-control' value=" + self._note.getAmount() + "></input><select class='amount-unit'><option value='1'>grams</option><option value='454'>lbs.</option><option value='1000'>kg</option></select>");
                  self.$('.input-amount').focus();
                  self.$('.input-amount').on('focusout', function (event) {
                    self.$('.amount-unit').remove();
                    var amount = self.$('.input-amount').val();
                    var unit = parseInt(self.$('.amount-unit').val());
                    amount *= unit;
                    if (self._note.getAmount() != amount) {
                      FoodParent.EventHandler.handleNoteData(self._note, FoodParent.DATA_MODE.UPDATE_NOTE_AMOUNT, { amount: amount }, function () {
                        FoodParent.EventHandler.handleDataChange("Pick amount for <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> was changed successfully.", true);
                        self.renderNoteInfo();
                      }, function () {
                          FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                      });
                    }
                    else {
                        self.renderNoteInfo();
                    }
                    self._note.setAmount(amount);
                    self.renderNoteInfo();
                  });
                });
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
                              FoodParent.EventHandler.handleDataChange("Comment of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> was changed successfully.", true);
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
                // Event listener for uploading a file.
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
            }
        };
        ImageNoteView.prototype.renderNoteImages = function () {
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
        ImageNoteView.prototype.update = function (args) {
            if (!this.bRendered) {
                this.render(args);
                return self;
            }
            /////
            return self;
        };
        ImageNoteView.prototype.resize = function () {
            var self = this;
            //self.$('.image-group').css({ height: self.$('.image-wrapper').innerHeight() - 120 });
        };
        ImageNoteView.prototype._mouseEnter = function (event) {
            var self = this;
            FoodParent.EventHandler.handleMouseEnter($(event.currentTarget), self);
        };
        ImageNoteView.prototype._mouseClick = function (event) {
            var self = this;
            FoodParent.EventHandler.handleMouseClick($(event.currentTarget), self);
        };
        ImageNoteView.prototype._prevNote = function (event) {
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
                    self.render();
                    return;
                }
            });
        };
        ImageNoteView.prototype._nextNote = function (event) {
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
                    self.render();
                    return;
                }
            });
        };
        ImageNoteView.prototype._changeCoverImage = function (event) {
            var self = this;
            if (self._bAuthor) {
                var cover = parseInt($(event.target).attr('data-target'));
                var tree = FoodParent.Model.getTrees().findWhere({ id: self._note.getTreeId() });
                var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                if (cover != 0) {
                    FoodParent.EventHandler.handleNoteData(self._note, FoodParent.DATA_MODE.UPDATE_COVER, { cover: cover }, function () {
                        FoodParent.EventHandler.handleDataChange("Cover picture of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> was changed successfully.", true);
                        self.renderImageNote();
                    }, function () {
                        FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                }
            }
        };
        ImageNoteView.prototype._deleteNote = function (event) {
            var self = this;
            var tree = FoodParent.Model.getTrees().findWhere({ id: self._note.getTreeId() });
            var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
            FoodParent.EventHandler.handleNoteData(self._note, FoodParent.DATA_MODE.DELETE, {}, function () {
                FoodParent.EventHandler.handleDataChange("Note of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has been deleted successfully.", true);
                if (FoodParent.View.getDetailTreeView()) {
                    FoodParent.View.getDetailTreeView().refreshTreeInfo();
                    FoodParent.View.getDetailTreeView().resetNote();
                }
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        };
        ImageNoteView.prototype.setVisible = function () {
            var self = this;
            FoodParent.Setting.getPopWrapperElement().removeClass('hidden');
        };
        ImageNoteView.prototype.setInvisible = function () {
            var self = this;
            FoodParent.Setting.getPopWrapperElement().addClass('hidden');
        };
        ImageNoteView.TAG = "ImageNoteView - ";
        return ImageNoteView;
    })(FoodParent.PopupView);
    FoodParent.ImageNoteView = ImageNoteView;
)(FoodParent || (FoodParent = {}));
