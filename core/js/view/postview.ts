module FoodParent {
    export class PostNoteView extends PopupView {
        private static TAG: string = "PostNoteView - ";
        private _tree: Tree;
        private _note: Note;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: PostNoteView = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = <any>{
                "click .alert-confirm": "_mouseClick",
                "click .top-right-button": "_mouseClick",
                "click .image-group img": "_selectCoverImage",
                "click .create-note": "_createNote",
            };
            self.delegateEvents();
        }
        public setTree(tree: Tree): void {
            var self: PostNoteView = this;
            self._tree = tree;
        }
        public render(args?: any): any {
            if (this.bRendered) {
                this.update(args);
                return;
            }
            this.bRendered = true;
            /////
            var self: PostNoteView = this;
            if (self.bDebug) console.log(PostNoteView.TAG + "render()");

            var food: Food = Model.getFoods().findWhere({ id: self._tree.getFoodId() });
            var template = _.template(Template.getPostNoteViewTemplate());
            var data = {
                name: food.getName() + " " + self._tree.getName(),
            }
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-note'));

            self.setVisible();

            // Create a new note.
            self._note = new Note({ type: NoteType.IMAGE, tree: self._tree.getId(), person: 0, comment: "", picture: "", rate: 0, cover: 0, date: moment(new Date()).format(Setting.getDateTimeFormat()) });

            // Event listener for uploading a file.
            self.$('input[type=file]').off('change');
            self.$('input[type=file]').on('change', function (event: Event) {
                self.$('.wrapper-input-upload-picture').addClass('hidden');
                self.$('.wrapper-uploading-picture').removeClass('hidden');
                var files = (<any>event.target).files;
                if (files.length > 0) {
                    Controller.uploadFile(files[0], function (fileName: string) {
                        self._note.addPicture(fileName);
                        // Success
                        self.$('input[type=file]').val("");
                        self.$('.wrapper-uploading-picture').addClass('hidden');
                        self.$('.wrapper-input-upload-picture').removeClass('hidden');
                        self.renderNoteImages();
                    }, function () {
                        // Error
                        self.$('.wrapper-uploading-picture').addClass('hidden');
                        self.$('.wrapper-input-upload-picture').removeClass('hidden');
                    });
                }

            });
            
            self.renderNoteInfo();
            self.resize();
            return self;
        }

        public resize(): any {
            var self: PostNoteView = this;
            self.$('.image-group').css({ height: self.$('.image-wrapper').innerHeight() - 60 });
        }

        public renderNoteInfo() {
            var self: PostNoteView = this;
            self.$('.input-rating').replaceWith('<div class="input-rating"></div>');
            self.$('.input-rating').html(Math.ceil(self._note.getRate()).toFixed(2) + " / " + Setting.getMaxRating().toFixed(2));

            self.$('.input-rating-slider').html("");
            var rate = rating(self.$('.input-rating-slider')[0], (self._note.getRate() + 1).toFixed(2), Setting.getMaxRating()+1, function (rate) {
                self._note.setRate(rate - 1);
                self.renderNoteInfo();
            });
            self.$('.input-comment').replaceWith('<div class="input-comment"></div>');
            self.$('.input-comment').html(htmlDecode(self._note.getComment()));
            self.$('.input-comment').on('click', function (event) {
                //$(this).replaceWith("<input type='text' class='input-comment form-control' value='" + htmlEncode($(this).text()) + "' />");
                $(this).replaceWith("<textarea rows='5' class='input-comment form-control'>" + self._note.getComment() + "</textarea>");
                //self.$('.input-lat').css({ width: width });
                self.$('.input-comment').focus();
                self.$('.input-comment').on('focusout', function (event) {
                    console.log(self.$('.input-comment').val());
                    var comment: string = self.$('.input-comment').val();
                    self._note.setComment(comment);
                    self.renderNoteInfo();
                });
            });

            var today: Date = new Date();
            self.$('.input-date').attr({ 'data-value': self._note.getFormattedDate() });
            self.$('.input-date').pickadate({
                format: "dd mmm yyyy",
                today: 'Today',
                max: today,
                clear: '',
                close: 'Close',
                onClose: function () {
                    self._note.setDate(moment(this.get()).hour(moment(new Date()).hour()));
                    self.renderNoteInfo();
                }
            });
        }

        public renderNoteImages() {
            var self: PostNoteView = this;
            var tag = '';
            $.each(self._note.getPictures(), function (index: number, filename: string) {
                tag += '<img src="' + Setting.getContentPictureDir() + filename + '" data-target="' + index + '" />';
            });
            
            self.$('.image-group').html(tag);

            $.each(self.$('.image-group img'), function (index: number, element: JQuery) {
                if (parseInt($(element).attr('data-target')) == self._note.getCover()) {
                    $(element).addClass('selected');
                } else {
                    $(element).removeClass('selected');
                }
            });
        }

        private _selectCoverImage(event: Event) {
            var self: PostNoteView = this;
            $.each(self.$('.image-group img'), function (index: number, element: JQuery) {
                $(element).removeClass('selected');
            });
            $(event.target).addClass('selected');
            self._note.setCover(parseInt($(event.target).attr('data-target')));
        }

        private _createNote(event: Event) {
            var self: PostNoteView = this;
            var food: Food = Model.getFoods().findWhere({ id: self._tree.getFoodId() });
            EventHandler.handleNoteData(self._note, DATA_MODE.CREATE, { }, function () {
                EventHandler.handleDataChange("New note for <strong><i>" + food.getName() + " " + self._tree.getName() + "</i></strong> has been created.", false);
                new RemoveAlertViewCommand({ delay: Setting.getRemovePopupDuration() }).execute();
                if (View.getDetailTreeView()) {
                    (<DetailTreeGraphicView>View.getDetailTreeView()).refreshTreeInfo();
                }
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
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

        private _mouseEnter(event: Event): void {
            var self: PostNoteView = this;
            EventHandler.handleMouseEnter($(event.currentTarget), self);
        }
        private _mouseClick(event: Event): void {
            var self: PostNoteView = this;
            EventHandler.handleMouseClick($(event.currentTarget), self);
        }

        public setVisible(): void {
            var self: PostNoteView = this;
            Setting.getPopWrapperElement().removeClass('hidden');
        }
        public setInvisible(): void {
            var self: PostNoteView = this;
            Setting.getPopWrapperElement().addClass('hidden');
        }
    }
}