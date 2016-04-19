module FoodParent {
    export class AlertView extends PopupView {
        private static TAG: string = "AlertView - ";
        private _errorMode: ERROR_MODE;
        private _customMessage: string;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: AlertView = this;
            self.bDebug = true;
            self.events = <any>{
                "click .evt-close": "_mouseClick",
            };
            self.delegateEvents();
        }
        public setErrorMode(errorMode: ERROR_MODE): void {
            var self: AlertView = this;
            self._errorMode = errorMode;
        }
        public setCustomMessage(message: string): void {
            var self: AlertView = this;
            self._customMessage = message;
        }
        public render(args?: any): any {
            super.render(args);
            var self: AlertView = this;
            if (self.bDebug) console.log(AlertView.TAG + "render()");

            var tag: string = "";
            switch (self._errorMode) {
                case ERROR_MODE.GEO_PERMISSION_ERROR:
                    tag += "<p>The device cannot find its's location information.<br />Please turn Geolocation setting on & refresh the page.</p>"
                    break;
                case ERROR_MODE.SEVER_CONNECTION_ERROR:
                    tag += "<p>There is a server connection error.<br/>If the issue keeps occuring,";
                    tag += "<br/>please contact <a href='mailto:" + Setting.getDevContact() + "'>" + Setting.getDevContact() + "</a>.</p>";
                    break;
                case ERROR_MODE.SEVER_RESPONSE_ERROR:
                    tag += "<p>" + self._customMessage;
                    tag += "<br/>please contact <a href='mailto:" + Setting.getDevContact() + "'>" + Setting.getDevContact() + "</a>.</p>";
                    break;
            }
            var template = _.template(Template.getAlertViewTemplate());
            self.$el.append(template({
                header: "Error!",
                message: tag,
            }));
            self.setElement(self.$('#wrapper-confirm'));
            self.setVisible();

            return self;
        }
        private _mouseClick(event: Event): void {
            var self: AlertView = this;
            EventHandler.handleMouseClick($(event.currentTarget), self);
        }
    }


























    export class ImageNoteViewFactory {
        private static _instance: ImageNoteViewFactory = new ImageNoteViewFactory();
        private baseUrl: string;
        constructor(args?: any) {
            if (ImageNoteViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use ImageNoteViewFactory.getInstance() instead of new.");
            }
            ImageNoteViewFactory._instance = this;
        }
        public static getInstance(): ImageNoteViewFactory {
            return ImageNoteViewFactory._instance;
        }
        public static create(el: JQuery, note: Note): ImageNoteView {
            var view: ImageNoteView = new ImageNoteView({ el: el });
            view.setNote(note);
            return view;
        }
    }





    export class AlertViewFractory {
        private static _instance: AlertViewFractory = new AlertViewFractory();
        private baseUrl: string;
        constructor(args?: any) {
            if (AlertViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use AlertViewFractory.getInstance() instead of new.");
            }
            AlertViewFractory._instance = this;
        }
        public static getInstance(): AlertViewFractory {
            return AlertViewFractory._instance;
        }
        public static create(el: JQuery, errorMode: ERROR_MODE, customMessage?: string): AlertView {
            var view: AlertView = new AlertView({ el: el });
            view.setErrorMode(errorMode);
            if (customMessage) {
                view.setCustomMessage(customMessage);
            }
            return view;
        }
    }



    export class ImageNoteView extends PopupView {
        private static TAG: string = "ImageNoteView - ";
        private _note: Note;
        private _bAuthor: boolean = false;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: ImageNoteView = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = <any>{
                "click .alert-confirm": "_mouseClick",
                "click .top-right-button": "_mouseClick",
                "click .prev-note": "_prevNote",
                "click .next-note": "_nextNote",
                "click .image-group img": "_changeCoverImage",
                "click .delete-note": "_deleteNote",
            };
            self.delegateEvents();
        }
        public setNote(note: Note): void {
            var self: ImageNoteView = this;
            self._note = note;
        }
        public render(args?: any): any {
            //if (this.bRendered) {
            //    this.update(args);
            //    return;
            //}
            this.bRendered = true;
            /////
            var self: ImageNoteView = this;
            if (self.bDebug) console.log(ImageNoteView.TAG + "render()");
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
                  var template: string = _.template(Template.getImageNoteViewTemplate2());
                  if (response2.result == true || response2.result == 'true') {   // admin
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
                    image: Setting.getBlankImagePath(),
                    value: self._note.getRate(),
                    comment: self._note.getComment(),
                    amount: amountLabel,
                    date: self._note.getFormattedHourTime(),
                    author: "Unknown",
                  }
                  if (person != undefined) {
                    data.author = person.getName();
                  }
                  if (self._bAuthor) {
                    template = _.template(Template.getImageNoteViewTemplate());
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
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
            return self;
        }

        public renderImageNote() {
            var self: ImageNoteView = this;
            var tree: Tree = Model.getTrees().findWhere({ id: self._note.getTreeId() });
            var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
            self.$('.name').html(food.getName() + " " + tree.getName());
            self.$('.input-rating').replaceWith('<div class="input-rating"></div>');
            self.$('.input-rating').html(Math.ceil(self._note.getRate()).toFixed(2) + " / " + Setting.getMaxRating().toFixed(2));

            self.$('.input-rating-slider').html("");
            var rate = rating(self.$('.input-rating-slider')[0], (self._note.getRate()+1).toFixed(2), Setting.getMaxRating()+1, function (rate) {
                if (self._bAuthor) {
                    if (Math.ceil(self._note.getRate()) != (rate - 1)) {
                        EventHandler.handleNoteData(self._note, DATA_MODE.UPDATE_RATING, { rate: (rate - 1) }, function () {
                            EventHandler.handleDataChange("Rating of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> was changed successfully.", true);
                            self.renderImageNote();
                        }, function () {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    } else {
                        self.renderImageNote();
                    }
                } else {
                    self.renderImageNote();
                }
            });
            if (self._bAuthor) {
                var today: Date = new Date();
                self.$('.input-date').attr({ 'data-value': self._note.getFormattedDate() });
                self.$('.input-date').pickadate({
                    format: "dd mmm yyyy",
                    today: 'Today',
                    max: today,
                    clear: '',
                    close: 'Close',
                    onClose: function () {
                        EventHandler.handleNoteData(self._note, DATA_MODE.UPDATE_DATE, { date: moment(this.get()).hour(moment(new Date()).hour()).format(Setting.getDateTimeFormat()) }, function () {
                            EventHandler.handleDataChange("Date of this <strong><i>Note</i></strong> was changed successfully.", true);
                            self.renderImageNote();
                        }, function () {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                        //self._note.setDate(moment(this.get()).hour(moment(new Date()).hour()));
                        //self.renderImageNote(note);
                    }
                });
                self.$('.input-date').pickadate('picker').set('select', self._note.getFormattedDate(), { format: 'dd mmm yyyy' })
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
                      var comment: string = self.$('.input-comment').val();
                      if (self._note.getComment().trim() != comment.trim()) {
                          EventHandler.handleNoteData(self._note, DATA_MODE.UPDATE_COMMENT, { comment: comment }, function () {
                              EventHandler.handleDataChange("Comment of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> was changed successfully.", true);
                              self.renderImageNote();
                          }, function () {
                              EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                          });
                      } else {
                          self.renderImageNote();
                      }
                    });
                });
            }

            self.renderNoteImages();

            if (self._bAuthor) {
                // Event listener for uploading a file.
                self.$('input[type=file]').off('change');
                self.$('input[type=file]').on('change', function (event: Event) {
                    self.$('.wrapper-input-upload-picture').addClass('hidden');
                    self.$('.wrapper-uploading-picture').removeClass('hidden');
                    var files = (<any>event.target).files;
                    if (files.length > 0) {
                        Controller.uploadNotePictureFile(files[0], food.getName() + "_" + tree.getId(), function (fileName: string) {
                            EventHandler.handleNoteData(self._note, DATA_MODE.ADD_PICTURE, { filename: fileName }, function () {
                                EventHandler.handleDataChange("<strong><i>" + fileName + "</i></strong> has been added successfully.", true);
                                // Success
                                self.$('input[type=file]').val("");
                                self.$('.wrapper-uploading-picture').addClass('hidden');
                                self.$('.wrapper-input-upload-picture').removeClass('hidden');
                                self.renderNoteImages();
                            }, function () {
                                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                            }, function () {
                                EventHandler.handleDataChange("<strong><i>" + fileName + "</i></strong> has been removed successfully.", true);
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
        }

        public renderNoteImages() {
            var self: ImageNoteView = this;
            var tag = '';
            $.each(self._note.getPictures(), function (index: number, filename: string) {
                if (index == 0) {
                    tag += '<img src="' + Setting.getBlankImagePath() + '" data-target="' + index + '" class="selected" />';
                } else {
                    tag += '<img src="' + Setting.getBlankImagePath() + '" data-target="' + index + '" />';
                }
            });
            self.$('.image-group').html(tag);
            $.each(self.$('.image-group img'), function (index: number, element: JQuery) {
                $(element).attr('src', Setting.getContentPictureDir() + self._note.getPictures()[index]).load(function () {

                }).error(function () {
                    $(element).attr('src', Setting.getBlankImagePath());
                });
            });
        }

        public update(args?: any): any {
            if (!this.bRendered) {
                this.render(args);
                return self;
            }
            /////
            return self;
        }

        public resize(): any {
            var self: ImageNoteView = this;
            //self.$('.image-group').css({ height: self.$('.image-wrapper').innerHeight() - 120 });
        }

        private _mouseEnter(event: Event): void {
            var self: ImageNoteView = this;
            EventHandler.handleMouseEnter($(event.currentTarget), self);
        }
        private _mouseClick(event: Event): void {
            var self: ImageNoteView = this;
            EventHandler.handleMouseClick($(event.currentTarget), self);
        }

        private _prevNote(event: Event): void {
            var self: ImageNoteView = this;
            var notes: Notes = new Notes(Model.getNotes().where({ tree: self._note.getTreeId(), type: NoteType.IMAGE }));
            notes.sortByAscendingDate();
            var bFound: boolean = false;
            $.each(notes.models, function (index: number, note: Note) {
                if (self._note.getId() == note.getId() && !bFound) {
                    bFound = true;
                    if (index == 0) {
                        self._note = notes.models[notes.models.length - 1];
                    } else {
                        self._note = notes.models[index - 1];
                    }
                    self.render();
                    return;
                }
            });
        }

        private _nextNote(event: Event): void {
            var self: ImageNoteView = this;
            var notes: Notes = new Notes(Model.getNotes().where({ tree: self._note.getTreeId(), type: NoteType.IMAGE }));
            notes.sortByAscendingDate();
            var bFound: boolean = false;
            $.each(notes.models, function (index: number, note: Note) {
                if (self._note.getId() == note.getId() && !bFound) {
                    bFound = true;
                    if (index == notes.models.length - 1) {
                        self._note = notes.models[0];
                    } else {
                        self._note = notes.models[index + 1];
                    }
                    self.render();
                    return;
                }
            });
        }

        private _changeCoverImage(event: Event) {
            var self: ImageNoteView = this;
            if (self._bAuthor) {
                var cover: number = parseInt($(event.target).attr('data-target'));
                var tree: Tree = Model.getTrees().findWhere({ id: self._note.getTreeId() });
                var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                if (cover != 0) {
                    EventHandler.handleNoteData(self._note, DATA_MODE.UPDATE_COVER, { cover: cover }, function () {
                        EventHandler.handleDataChange("Cover picture of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> was changed successfully.", true);
                        self.renderImageNote();
                    }, function () {
                        EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                }
            }
        }

        private _deleteNote(event: Event) {
            var self: ImageNoteView = this;
            var tree: Tree = Model.getTrees().findWhere({ id: self._note.getTreeId() });
            var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
            EventHandler.handleNoteData(self._note, DATA_MODE.DELETE, { }, function () {
                EventHandler.handleDataChange("Note of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has been deleted successfully.", true);
                if (View.getDetailTreeView()) {
                    (<DetailTreeGraphicView>View.getDetailTreeView()).refreshTreeInfo();
                    (<DetailTreeGraphicView>View.getDetailTreeView()).resetNote();
                }
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }

        public setVisible(): void {
            var self: ImageNoteView = this;
            Setting.getPopWrapperElement().removeClass('hidden');
        }
        public setInvisible(): void {
            var self: ImageNoteView = this;
            Setting.getPopWrapperElement().addClass('hidden');
        }
    }
}
