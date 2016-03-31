module FoodParent {
    export class EditNoteViewForParent extends EditNoteView {
        protected static TAG: string = "EditNoteViewForParent - ";
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: EditNoteViewForParent = this;
            self.bDebug = true;
            self.events = <any>{
                "click .evt-close": "_mouseClick",
                "click .evt-prev": "_prevNote",
                "click .evt-next": "_nextNote",
                "click .image-group img": "_applyCoverPicture",
                "click .evt-delete": "_deleteNote",
            };
            self.delegateEvents();
        }
        public render(args?: any): any {
            super.render(args);
            var self: EditNoteViewForParent = this;
            var tree: Tree = Model.getTrees().findWhere({ id: self._note.getTreeId() });
            var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
            var template = _.template(Template.getEditNoteViewForAdmin());
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
        }
        public update(args?: any): any {
            super.update(args);
            var self: EditNoteViewForParent = this;
            if (self.bDebug) console.log(EditNoteViewForParent.TAG + "update()");
            // Render note info
            self.renderNoteInfo();
            // Render pictures
            self.renderNoteImages();
        }
        public renderNoteInfo() {
            var self: EditNoteViewForParent = this;
            if (self.bDebug) console.log(EditNoteViewForParent.TAG + "renderNoteInfo()");

            Controller.checkIsLoggedIn(function (response) {
                var parent: Person = Model.getPersons().findWhere({ id: self._note.getPersonId() });
                var tree: Tree = Model.getTrees().findWhere({ id: self._note.getTreeId() });
                var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                var bAuthor: boolean = false;
                if (parseInt(response.id) == parent.getId()) {
                    bAuthor = true;
                }

                self.$('.input-rating').replaceWith('<div class="input-rating"></div>');
                self.$('.input-rating').html(Math.ceil(self._note.getRate()).toFixed(2) + " / " + Setting.getMaxRating().toFixed(2));

                self.$('.input-rating-slider').html("");
                if (bAuthor) {
                    var rate = rating(self.$('.input-rating-slider')[0], (self._note.getRate() + 1).toFixed(2), Setting.getMaxRating() + 1, function (rate) {
                        if (Math.ceil(self._note.getRate()) != (rate - 1)) {
                            EventHandler.handleNoteData(self._note, DATA_MODE.UPDATE_RATING, { rate: (rate - 1) }, function () {
                                EventHandler.handleDataChange("Rating of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> was changed successfully.", true);
                                self.renderNoteInfo();
                            }, function () {
                                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                            });
                        } else {
                            self.renderNoteInfo();
                        }
                    });
                } else {
                    self.$('.input-rating-slider').html("");
                    var rate = rating(self.$('.input-rating-slider')[0], (self._note.getRate() + 1).toFixed(2), Setting.getMaxRating() + 1, function (rate) {
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
                            var comment: string = self.$('.input-comment').val();
                            if (self._note.getComment().trim() != comment.trim()) {
                                EventHandler.handleNoteData(self._note, DATA_MODE.UPDATE_COMMENT, { comment: comment }, function () {
                                    EventHandler.handleDataChange("Comment of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> was changed successfully.", true);
                                    self.renderNoteInfo();
                                }, function () {
                                    EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                                });
                            } else {
                                self.renderNoteInfo();
                            }
                        });
                    });
                }
                

                var today: Date = new Date();
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
                            EventHandler.handleNoteData(self._note, DATA_MODE.UPDATE_DATE, { date: moment(this.get()).hour(moment(new Date()).hour()).format(Setting.getDateTimeFormat()) }, function () {
                                EventHandler.handleDataChange("Date of this <strong><i>Note</i></strong> was changed successfully.", true);
                                self.renderNoteInfo();
                            }, function () {
                                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                            });
                        } else {
                            self._note.setDate(moment(this.get()).hour(moment(new Date()).hour()));
                            self.renderNoteInfo();
                        }
                    }
                });
                if (bAuthor) {
                    self.$('.input-date').removeAttr('disabled');
                } else {
                    self.$('.input-date').attr({ 'disabled': true });
                }

                // Fill out name of the author
                self.$('.input-contact').html(parent.getName());

                // Hide some unecesarry buttons
                if (bAuthor) {
                    self.$('.input-upload-picture').removeClass('hidden');
                    self.$('.delete-group').removeClass('hidden');
                } else {
                    self.$('.input-upload-picture').addClass('hidden');
                    self.$('.delete-group').addClass('hidden');
                }
            }, function (response) {
                Backbone.history.loadUrl(Backbone.history.fragment);
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }

        protected _applyCoverPicture(event: Event) {
            var self: EditNoteViewForParent = this;
            var parent: Person = Model.getPersons().findWhere({ id: self._note.getPersonId() });
            Controller.checkIsLoggedIn(function (response) {
                if (parseInt(response.id) == parent.getId()) {
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
            }, function () {
                Backbone.history.loadUrl(Backbone.history.fragment);
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }

        private _deleteNote(event: Event): void {
            var self: EditNoteViewForParent = this;
            var parent: Person = Model.getPersons().findWhere({ id: self._note.getPersonId() });
            Controller.checkIsLoggedIn(function (response) {
                EventHandler.handleMouseClick($(event.currentTarget), self, { note: self._note.getId() });
            }, function () {
                Backbone.history.loadUrl(Backbone.history.fragment);
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
            
        }
    }
}
