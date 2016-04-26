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

        private _applyCoverPicture(event: Event) {
            var self: PostNoteView = this;
            $.each(self.$('.image-group img'), function (index: number, element: JQuery) {
                $(element).removeClass('selected');
            });
            $(event.target).addClass('selected');
            self._note.setCover(parseInt($(event.target).attr('data-target')));
            self.renderNoteImages();
        }

        private _submitNote(event: Event) {
            var self: PostNoteView = this;
            if (self.$('.input-contact').html() != "") {
                EventHandler.handleMouseClick($(event.currentTarget), self, { tree: self._tree, note: self._note });
            } else {
                if (!isValidEmailAddress(self.$('.input-contact').val().trim())) {
                    new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: "Please enter a valid <strong><i>e-mail address.", undoable: false }).execute(); //not a valid e-mail
                } else {
                    EventHandler.handleMouseClick($(event.currentTarget), self, { tree: self._tree, note: self._note, contact: self.$('.input-contact').val().trim() });
                }
            }
        }

        private _mouseClick(event: Event): void {
            var self: PostNoteView = this;
            EventHandler.handleMouseClick($(event.currentTarget), self);
        }
    }
}
