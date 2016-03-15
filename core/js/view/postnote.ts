module FoodParent {
    export class PostNoteViewFactory {
        private static _instance: PostNoteViewFactory = new PostNoteViewFactory();
        private baseUrl: string;
        constructor(args?: any) {
            if (PostNoteViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use PostNoteViewFactory.getInstance() instead of new.");
            }
            PostNoteViewFactory._instance = this;
        }
        public static getInstance(): PostNoteViewFactory {
            return PostNoteViewFactory._instance;
        }
        public static create(el: JQuery, tree: Tree, credential: CREDENTIAL_MODE): PostNoteView {
            var view: PostNoteView;
            if (credential == CREDENTIAL_MODE.GUEST) {
                view = new PostNoteViewForGuest({ el: el });
            } else if (credential == CREDENTIAL_MODE.PARENT) {
                view = new PostNoteViewForParent({ el: el });
            } else if (credential == CREDENTIAL_MODE.ADMIN) {
                view = new PostNoteViewForAdmin({ el: el });
            }
            view.setTree(tree);
            return view;
        }
    }

    export class PostNoteView extends PopupView {
        protected static TAG: string = "PostNoteView - ";
        protected _tree: Tree;
        protected _note: Note;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: PostNoteView = this;
            self.bDebug = true;
            self.events = <any>{
            };
            self.delegateEvents();
        }
        public setTree(tree: Tree): void {
            var self: PostNoteView = this;
            self._tree = tree;
        }
        public render(args?: any): any {
            super.render();
            var self: PostNoteView = this;
            if (self.bDebug) console.log(PostNoteView.TAG + "render()");
            


            /*
            Controller.checkLogin(function (response1) {
                var bLogin: boolean = false;
                if (response1.result == true || response1.result == 'true') {   // Logged in
                    bLogin = true;
                }

                var food: Food = Model.getFoods().findWhere({ id: self._tree.getFoodId() });
                if (bLogin) {
                    var person: Person = Model.getPersons().findWhere({ id: parseInt(response1.id) });
                    var template = _.template(Template.getPostNoteViewTemplate());
                    self.$el.html(template({
                        name: food.getName() + " " + self._tree.getName(),
                        author: person.getName(),
                    }));
                } else {
                    var template = _.template(Template.getPostNoteViewTemplate2());
                    self.$el.html(template({
                        name: food.getName() + " " + self._tree.getName(),
                    }));
                }
                self.setElement(self.$('#wrapper-note'));
                self.setVisible();

                // Create a new note.
                self._note = new Note({ type: NoteType.IMAGE, tree: self._tree.getId(), person: parseInt(response1.id), comment: "", picture: "", rate: 0, date: moment(new Date()).format(Setting.getDateTimeFormat()) });

                // Event listener for uploading a file.
                self.$('input[type=file]').off('change');
                self.$('input[type=file]').on('change', function (event: Event) {
                    self.$('.wrapper-input-upload-picture').addClass('hidden');
                    self.$('.wrapper-uploading-picture').removeClass('hidden');
                    var files = (<any>event.target).files;
                    if (files.length > 0) {
                        Controller.uploadNotePictureFile(files[0], food.getName() + "_" + self._tree.getId(), function (fileName: string) {
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
            }, function (response1) {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });

            */
            return self;
        }

        public resize(): any {
            var self: PostNoteView = this;
        }
        
        /**
         * Event listener for uploading files
         */
        protected addFileUploadEventListener(): void {
            var self: PostNoteView = this;
            var food: Food = Model.getFoods().findWhere({ id: self._tree.getFoodId() });
            self.$('input[type=file]').off('change');
            self.$('input[type=file]').on('change', function (event: Event) {
                self.$('.wrapper-input-upload-picture').addClass('hidden');
                self.$('.wrapper-uploading-picture').removeClass('hidden');
                var files = (<any>event.target).files;
                if (files.length > 0) {
                    Controller.uploadNotePictureFile(files[0], food.getName() + "_" + self._tree.getId(), function (fileName: string) {
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
                        EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                }
            });
        }

        public renderNoteInfo() {
            var self: PostNoteView = this;
            if (self.bDebug) console.log(PostNoteView.TAG + "renderNoteInfo()");
            self.$('.input-rating').replaceWith('<div class="input-rating"></div>');
            self.$('.input-rating').html(Math.ceil(self._note.getRate()).toFixed(2) + " / " + Setting.getMaxRating().toFixed(2));

            self.$('.input-rating-slider').html("");
            var rate = rating(self.$('.input-rating-slider')[0], (self._note.getRate() + 1).toFixed(2), Setting.getMaxRating() + 1, function (rate) {
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

        private renderNoteImages() {
            var self: PostNoteView = this;
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

        private _selectCoverImage(event: Event) {
            var self: PostNoteView = this;
            $.each(self.$('.image-group img'), function (index: number, element: JQuery) {
                $(element).removeClass('selected');
            });
            $(event.target).addClass('selected');
            self._note.setCover(parseInt($(event.target).attr('data-target')));
            self.renderNoteImages();
        }

        private _createNote(event: Event) {
            var self: PostNoteView = this;
            if (!self.bProcessing) {
                self.bProcessing = true;
                Controller.checkLogin(function (response1) {
                    if (response1.result == true || response1.result == 'true') {   // Logged in
                        var food: Food = Model.getFoods().findWhere({ id: self._tree.getFoodId() });
                        self._note.setPersonId(parseInt(response1.id));
                        EventHandler.handleNoteData(self._note, DATA_MODE.CREATE, {}, function () {
                            EventHandler.handleDataChange("New note for <strong><i>" + food.getName() + " " + self._tree.getName() + "</i></strong> has been created.", false);
                            new RemoveAlertViewCommand({ delay: Setting.getRemovePopupDuration() }).execute();
                            if (View.getDetailTreeView()) {
                                (<DetailTreeGraphicView>View.getDetailTreeView()).refreshTreeInfo();
                            }
                            self.bProcessing = false;
                        }, function () {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                            self.bProcessing = false;
                        });
                    } else {
                        // Register user's e-mail address first & add data
                        if (!isValidEmailAddress($('.input-author').val())) {
                            new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: "Please put a valid <strong><i>e-mail address.", undoable: false }).execute();
                            self.bProcessing = false;
                        } else {
                            Controller.processSignup($('.input-author').val().trim(), '', '', function (response2) {
                                var food: Food = Model.getFoods().findWhere({ id: self._tree.getFoodId() });
                                self._note.setPersonId(parseInt(response2.id));
                                EventHandler.handleNoteData(self._note, DATA_MODE.CREATE, {}, function () {
                                    EventHandler.handleDataChange("New note for <strong><i>" + food.getName() + " " + self._tree.getName() + "</i></strong> has been created.", false);
                                    new RemoveAlertViewCommand({ delay: Setting.getRemovePopupDuration() }).execute();
                                    if (View.getDetailTreeView()) {
                                        (<DetailTreeGraphicView>View.getDetailTreeView()).refreshTreeInfo();
                                    }
                                    self.bProcessing = false;
                                }, function () {
                                    EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                                    self.bProcessing = false;
                                });
                                Backbone.history.loadUrl(Backbone.history.fragment);
                                self.bProcessing = false;
                            }, function (response2) {
                                new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: Setting.getErrorMessage(response2.error), undoable: false }).execute();
                                self.bProcessing = false;
                            });
                        }
                    }
                }, function (response1) {
                    EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            }
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