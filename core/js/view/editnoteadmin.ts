module FoodParent {
    export class EditNoteViewForAdmin extends EditNoteView {
        protected static TAG: string = "EditNoteViewForAdmin - ";
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: EditNoteViewForAdmin = this;
            self.bDebug = true;
            self.events = <any>{
                "click .evt-close": "_mouseClick",
                "click .evt-prev": "_prevNote",
                "click .evt-next": "_nextNote",
                "click .image-group img": "_applyCoverPicture",
                "click .evt-delete": "_mouseClick",
            };
            self.delegateEvents();
        }
        public render(args?: any): any {
            super.render(args);
            var self: EditNoteViewForAdmin = this;
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
            var self: EditNoteViewForAdmin = this;
            if (self.bDebug) console.log(EditNoteViewForAdmin.TAG + "update()");
            // Render note info
            self.renderNoteInfo();
            // Render pictures
            self.renderNoteImages();
        }

        public renderNoteInfo() {
            var self: EditNoteViewForAdmin = this;
            if (self.bDebug) console.log(EditNoteViewForAdmin.TAG + "renderNoteInfo()");
            var parent: Person = Model.getPersons().findWhere({ id: self._note.getPersonId() });
            var tree: Tree = Model.getTrees().findWhere({ id: self._note.getTreeId() });
            var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });

            self.$('.input-rating').replaceWith('<div class="input-rating"></div>');
            self.$('.input-rating').html(Math.ceil(self._note.getRate()).toFixed(2) + " / " + Setting.getMaxRating().toFixed(2));

            self.$('.input-rating-slider').html("");
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

            self.$('.input-comment').replaceWith('<div class="input-comment"></div>');
            self.$('.input-comment').html(htmlDecode(self._note.getComment()));
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
                    EventHandler.handleNoteData(self._note, DATA_MODE.UPDATE_DATE, { date: moment(this.get()).hour(moment(new Date()).hour()).format(Setting.getDateTimeFormat()) }, function () {
                        EventHandler.handleDataChange("Date of this <strong><i>Note</i></strong> was changed successfully.", true);
                        self.renderNoteInfo();
                    }, function () {
                        EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                }
            });

            // Fill out name of the author
            self.$('.input-contact').html(parent.getName());
        }
    }
}
