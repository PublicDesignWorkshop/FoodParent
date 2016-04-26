module FoodParent {

    export class EditNoteViewFactory {
        private static _instance: EditNoteViewFactory = new EditNoteViewFactory();
        private baseUrl: string;
        constructor(args?: any) {
            if (EditNoteViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use EditNoteViewFactory.getInstance() instead of new.");
            }
            EditNoteViewFactory._instance = this;
        }
        public static getInstance(): EditNoteViewFactory {
            return EditNoteViewFactory._instance;
        }
        public static create(el: JQuery, note: Note, credential: CREDENTIAL_MODE): EditNoteView {
            var view: EditNoteView;
            if (credential == CREDENTIAL_MODE.GUEST) {
                view = new EditNoteViewForGuest({ el: el });
            } else if (credential == CREDENTIAL_MODE.PARENT) {
                view = new EditNoteViewForParent({ el: el });
            } else if (credential == CREDENTIAL_MODE.ADMIN) {
                view = new EditNoteViewForAdmin({ el: el });
            }
            view.setNote(note);
            return view;
        }
    }

    export class EditNoteView extends PopupView {
        protected static TAG: string = "EditNoteView - ";
        protected _note: Note;
        protected _bAuthor: boolean = false;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: EditNoteView = this;
            self.bDebug = true;
            self.events = <any>{

            };
            self.delegateEvents();
        }
        public setNote(note: Note): void {
            var self: EditNoteView = this;
            self._note = note;
        }
        public update(args?: any): any {
            super.update(args);
            var self: EditNoteView = this;
            if (self.bDebug) console.log(EditNoteView.TAG + "update()");
        }
        public render(args?: any): any {
            super.render(args);
            var self: EditNoteView = this;
            if (self.bDebug) console.log(EditNoteView.TAG + "render()");
            return self;
        }
        public renderNoteInfo() { }
        protected renderNoteImages() {
            var self: EditNoteView = this;
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

        private _prevNote(event: Event): void {
            var self: EditNoteView = this;
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
                    self.update();
                    return;
                }
            });
        }

        private _nextNote(event: Event): void {
            var self: EditNoteView = this;
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
                    self.update();
                    return;
                }
            });
        }

        /**
         * Event listener for uploading files
         */
        protected addFileUploadEventListener(): void {
            var self: EditNoteView = this;
            var tree: Tree = Model.getTrees().findWhere({ id: self._note.getTreeId() });
            var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });


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

        protected _applyCoverPicture(event: Event) {
            var self: EditNoteView = this;
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

        private _mouseClick(event: Event): void {
            var self: EditNoteView = this;
            EventHandler.handleMouseClick($(event.currentTarget), self, { note: self._note.getId() });
        }

        public renderImageNote() {
            var self: ImageNoteView = this;
            var tree: Tree = Model.getTrees().findWhere({ id: self._note.getTreeId() });
            var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
            self.$('.name').html(food.getName() + " " + tree.getName());
            self.$('.input-rating').replaceWith('<div class="input-rating"></div>');
            self.$('.input-rating').html(Math.ceil(self._note.getRate()).toFixed(2) + " / " + Setting.getMaxRating().toFixed(2));

            self.$('.input-rating-slider').html("");
            var rate = rating(self.$('.input-rating-slider')[0], (self._note.getRate() + 1).toFixed(2), Setting.getMaxRating() + 1, function (rate) {
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
                    var amount = self.$('.input-amount').val();
                    var unit = parseInt(self.$('.amount-unit').val());
                    self.$('.amount-unit').remove();
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

            }
        }






    }
}
