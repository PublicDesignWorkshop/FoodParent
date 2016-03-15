var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var PostNoteViewFactory = (function () {
        function PostNoteViewFactory(args) {
            if (PostNoteViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use PostNoteViewFactory.getInstance() instead of new.");
            }
            PostNoteViewFactory._instance = this;
        }
        PostNoteViewFactory.getInstance = function () {
            return PostNoteViewFactory._instance;
        };
        PostNoteViewFactory.create = function (el, tree, credential) {
            var view;
            if (credential == FoodParent.CREDENTIAL_MODE.GUEST) {
                view = new FoodParent.PostNoteViewForGuest({ el: el });
            }
            else if (credential == FoodParent.CREDENTIAL_MODE.PARENT) {
                view = new FoodParent.PostNoteViewForParent({ el: el });
            }
            else if (credential == FoodParent.CREDENTIAL_MODE.ADMIN) {
                view = new FoodParent.PostNoteViewForAdmin({ el: el });
            }
            view.setTree(tree);
            return view;
        };
        PostNoteViewFactory._instance = new PostNoteViewFactory();
        return PostNoteViewFactory;
    })();
    FoodParent.PostNoteViewFactory = PostNoteViewFactory;
    var PostNoteView = (function (_super) {
        __extends(PostNoteView, _super);
        function PostNoteView(options) {
            _super.call(this, options);
            var self = this;
            self.bDebug = true;
            self.events = {};
            self.delegateEvents();
        }
        PostNoteView.prototype.setTree = function (tree) {
            var self = this;
            self._tree = tree;
        };
        PostNoteView.prototype.render = function (args) {
            _super.prototype.render.call(this);
            var self = this;
            if (self.bDebug)
                console.log(PostNoteView.TAG + "render()");
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
        };
        PostNoteView.prototype.resize = function () {
            var self = this;
            self.$('.image-group').css({ height: self.$('.image-wrapper').innerHeight() - 60 });
        };
        PostNoteView.prototype.renderNoteInfo = function () {
            var self = this;
            self.$('.input-rating').replaceWith('<div class="input-rating"></div>');
            self.$('.input-rating').html(Math.ceil(self._note.getRate()).toFixed(2) + " / " + FoodParent.Setting.getMaxRating().toFixed(2));
            self.$('.input-rating-slider').html("");
            var rate = rating(self.$('.input-rating-slider')[0], (self._note.getRate() + 1).toFixed(2), FoodParent.Setting.getMaxRating() + 1, function (rate) {
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
                    var comment = self.$('.input-comment').val();
                    self._note.setComment(comment);
                    self.renderNoteInfo();
                });
            });
            var today = new Date();
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
        };
        PostNoteView.prototype.renderNoteImages = function () {
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
        PostNoteView.prototype._selectCoverImage = function (event) {
            var self = this;
            $.each(self.$('.image-group img'), function (index, element) {
                $(element).removeClass('selected');
            });
            $(event.target).addClass('selected');
            self._note.setCover(parseInt($(event.target).attr('data-target')));
            self.renderNoteImages();
        };
        PostNoteView.prototype._createNote = function (event) {
            var self = this;
            if (!self.bProcessing) {
                self.bProcessing = true;
                FoodParent.Controller.checkLogin(function (response1) {
                    if (response1.result == true || response1.result == 'true') {
                        var food = FoodParent.Model.getFoods().findWhere({ id: self._tree.getFoodId() });
                        self._note.setPersonId(parseInt(response1.id));
                        FoodParent.EventHandler.handleNoteData(self._note, FoodParent.DATA_MODE.CREATE, {}, function () {
                            FoodParent.EventHandler.handleDataChange("New note for <strong><i>" + food.getName() + " " + self._tree.getName() + "</i></strong> has been created.", false);
                            new RemoveAlertViewCommand({ delay: FoodParent.Setting.getRemovePopupDuration() }).execute();
                            if (FoodParent.View.getDetailTreeView()) {
                                FoodParent.View.getDetailTreeView().refreshTreeInfo();
                            }
                            self.bProcessing = false;
                        }, function () {
                            FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                            self.bProcessing = false;
                        });
                    }
                    else {
                        // Register user's e-mail address first & add data
                        if (!isValidEmailAddress($('.input-author').val())) {
                            new FoodParent.RenderMessageViewCommand({ el: FoodParent.Setting.getMessageWrapperElement(), message: "Please put a valid <strong><i>e-mail address.", undoable: false }).execute();
                            self.bProcessing = false;
                        }
                        else {
                            FoodParent.Controller.processSignup($('.input-author').val().trim(), '', '', function (response2) {
                                var food = FoodParent.Model.getFoods().findWhere({ id: self._tree.getFoodId() });
                                self._note.setPersonId(parseInt(response2.id));
                                FoodParent.EventHandler.handleNoteData(self._note, FoodParent.DATA_MODE.CREATE, {}, function () {
                                    FoodParent.EventHandler.handleDataChange("New note for <strong><i>" + food.getName() + " " + self._tree.getName() + "</i></strong> has been created.", false);
                                    new RemoveAlertViewCommand({ delay: FoodParent.Setting.getRemovePopupDuration() }).execute();
                                    if (FoodParent.View.getDetailTreeView()) {
                                        FoodParent.View.getDetailTreeView().refreshTreeInfo();
                                    }
                                    self.bProcessing = false;
                                }, function () {
                                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                                    self.bProcessing = false;
                                });
                                Backbone.history.loadUrl(Backbone.history.fragment);
                                self.bProcessing = false;
                            }, function (response2) {
                                new FoodParent.RenderMessageViewCommand({ el: FoodParent.Setting.getMessageWrapperElement(), message: FoodParent.Setting.getErrorMessage(response2.error), undoable: false }).execute();
                                self.bProcessing = false;
                            });
                        }
                    }
                }, function (response1) {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            }
        };
        PostNoteView.prototype.update = function (args) {
            if (!this.bRendered) {
                this.render(args);
                return self;
            }
            /////
            return self;
        };
        PostNoteView.prototype._mouseEnter = function (event) {
            var self = this;
            FoodParent.EventHandler.handleMouseEnter($(event.currentTarget), self);
        };
        PostNoteView.prototype._mouseClick = function (event) {
            var self = this;
            FoodParent.EventHandler.handleMouseClick($(event.currentTarget), self);
        };
        PostNoteView.prototype.setVisible = function () {
            var self = this;
            FoodParent.Setting.getPopWrapperElement().removeClass('hidden');
        };
        PostNoteView.prototype.setInvisible = function () {
            var self = this;
            FoodParent.Setting.getPopWrapperElement().addClass('hidden');
        };
        PostNoteView.TAG = "PostNoteView - ";
        return PostNoteView;
    })(FoodParent.PopupView);
    FoodParent.PostNoteView = PostNoteView;
})(FoodParent || (FoodParent = {}));
