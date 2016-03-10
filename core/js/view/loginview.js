var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var LogInViewFactory = (function () {
        function LogInViewFactory(args) {
            if (LogInViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use LogInViewFactory.getInstance() instead of new.");
            }
            LogInViewFactory._instance = this;
        }
        LogInViewFactory.getInstance = function () {
            return LogInViewFactory._instance;
        };
        LogInViewFactory.create = function (el) {
            var view = new LogInView({ el: el });
            return view;
        };
        LogInViewFactory._instance = new LogInViewFactory();
        return LogInViewFactory;
    })();
    FoodParent.LogInViewFactory = LogInViewFactory;
    var LogInView = (function (_super) {
        __extends(LogInView, _super);
        function LogInView(options) {
            _super.call(this, options);
            var self = this;
            self.bDebug = true;
            self.events = {
                "click .evt-manager": "_toggleManagerLogIn",
                "click .evt-close": "_mouseClick",
                "click .evt-submit": "_loginSubmit",
                "keydown .input-contact": "_keyDown",
            };
            self.delegateEvents();
        }
        LogInView.prototype.render = function (args) {
            _super.prototype.render.call(this, args);
            var self = this;
            if (self.bDebug)
                console.log(LogInView.TAG + "render()");
            var template = _.template(FoodParent.Template.getLogInViewTemplate());
            self.$el.html(template({
                header: 'Parent Sign-In',
            }));
            self.setElement($('#wrapper-login'));
            self.setVisible();
            self.resize();
            return self;
        };
        LogInView.prototype._toggleManagerLogIn = function (event) {
            var self = this;
            if ($(event.target).find('input').prop('name') == 'manager') {
                setTimeout(function () {
                    if ($(event.target).find('input').prop('checked') == true) {
                        self.$('.input-password').closest('.info-group').removeClass('invisible');
                    }
                    else {
                        self.$('.input-password').closest('.info-group').addClass('invisible');
                        self.$('.input-password').val("");
                    }
                }, 1);
            }
        };
        LogInView.prototype._mouseClick = function (event) {
            var self = this;
            FoodParent.EventHandler.handleMouseClick($(event.currentTarget), self);
        };
        LogInView.prototype._keyDown = function (event) {
            var self = this;
            if (event.keyCode == 13) {
                self._loginSubmit();
            }
        };
        LogInView.prototype._loginSubmit = function (event) {
            var self = this;
            if ($('input[type="checkbox"][name="manager"]').prop('checked') == true) {
                if (!isValidEmailAddress($('.input-contact').val())) {
                    new FoodParent.RenderMessageViewCommand({ el: FoodParent.Setting.getMessageWrapperElement(), message: "Please put a valid <strong><i>e-mail address.", undoable: false }).execute();
                }
                else if (self.$('.input-password').val().trim() == '') {
                    new FoodParent.RenderMessageViewCommand({ el: FoodParent.Setting.getMessageWrapperElement(), message: "Please put a <strong>password</strong>, or uncheck <strong>manager option</strong>.", undoable: false }).execute();
                }
                else {
                    FoodParent.EventHandler.handleMouseClick(self.$('.evt-submit'), self, { contact: $('.input-contact').val().trim(), password: $('.input-password').val().trim() });
                }
            }
            else {
                if (!isValidEmailAddress($('.input-contact').val())) {
                    new FoodParent.RenderMessageViewCommand({ el: FoodParent.Setting.getMessageWrapperElement(), message: "Please put a valid <strong><i>e-mail address.", undoable: false }).execute();
                }
                else {
                    FoodParent.EventHandler.handleMouseClick(self.$('.evt-submit'), self, { contact: $('.input-contact').val().trim(), password: $('.input-contact').val().trim() });
                }
            }
        };
        LogInView.TAG = "LogInView - ";
        return LogInView;
    })(FoodParent.PopupView);
    FoodParent.LogInView = LogInView;
    var AccountViewFactory = (function () {
        function AccountViewFactory(args) {
            if (AccountViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use AccountViewFactory.getInstance() instead of new.");
            }
            AccountViewFactory._instance = this;
        }
        AccountViewFactory.getInstance = function () {
            return AccountViewFactory._instance;
        };
        AccountViewFactory.create = function (el) {
            var view = new AccountView({ el: el });
            return view;
        };
        AccountViewFactory._instance = new AccountViewFactory();
        return AccountViewFactory;
    })();
    FoodParent.AccountViewFactory = AccountViewFactory;
    var AccountView = (function (_super) {
        __extends(AccountView, _super);
        function AccountView(options) {
            _super.call(this, options);
            var self = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = {
                "click .evt-close": "_mouseClick",
                "click .evt-logout": "_mouseClick",
            };
            self.delegateEvents();
        }
        AccountView.prototype.render = function (args) {
            _super.prototype.render.call(this, args);
            var self = this;
            if (self.bDebug)
                console.log(AccountView.TAG + "render()");
            FoodParent.Controller.checkIsLoggedIn(function (response) {
                FoodParent.Controller.checkIsAdmin(function () {
                    var template = _.template(FoodParent.Template.getAccountViewTemplateForAdmin());
                    FoodParent.Setting.getPopWrapperElement().html(template({
                        header: 'Admin Info',
                        contact: response.contact,
                    }));
                    self.setElement($('#wrapper-login'));
                    FoodParent.Controller.fetchAllPersons(function () {
                        var person = FoodParent.Model.getPersons().findWhere({ id: parseInt(response.id) });
                        self.$('.input-name').val(person.getRealName());
                        self.$('.input-neighborhood').val(person.getNeighboorhood());
                    }, function () {
                        FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                }, function () {
                    var template = _.template(FoodParent.Template.getAccountViewTemplateForParent());
                    FoodParent.Setting.getPopWrapperElement().html(template({
                        header: 'Parent Info',
                        contact: response.contact,
                    }));
                    self.setElement($('#wrapper-login'));
                    FoodParent.Controller.fetchAllPersons(function () {
                        var person = FoodParent.Model.getPersons().findWhere({ id: parseInt(response.id) });
                        self.$('.input-name').val(person.getRealName());
                        self.$('.input-neighborhood').val(person.getNeighboorhood());
                    }, function () {
                        FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            }, function () {
                Backbone.history.loadUrl(Backbone.history.fragment);
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
            self.setVisible();
            self.resize();
            return self;
        };
        AccountView.prototype._mouseClick = function (event) {
            var self = this;
            FoodParent.EventHandler.handleMouseClick($(event.currentTarget), self);
        };
        AccountView.TAG = "AccountView - ";
        return AccountView;
    })(FoodParent.PopupView);
    FoodParent.AccountView = AccountView;
    var SignUpViewFactory = (function () {
        function SignUpViewFactory(args) {
            if (SignUpViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use SignUpViewFactory.getInstance() instead of new.");
            }
            SignUpViewFactory._instance = this;
        }
        SignUpViewFactory.getInstance = function () {
            return SignUpViewFactory._instance;
        };
        SignUpViewFactory.create = function (el) {
            var view = new SignUpView({ el: el });
            return view;
        };
        SignUpViewFactory._instance = new SignUpViewFactory();
        return SignUpViewFactory;
    })();
    FoodParent.SignUpViewFactory = SignUpViewFactory;
    var SignUpView = (function (_super) {
        __extends(SignUpView, _super);
        function SignUpView(options) {
            _super.call(this, options);
            this.bProcessing = false;
            var self = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = {
                "click .top-right-button": "_mouseClick",
                "click .signup-cancel": "_mouseClick",
                "click .signup-submit": "_signupSubmit",
            };
            self.delegateEvents();
        }
        SignUpView.prototype.render = function (args) {
            if (this.bRendered) {
                this.update(args);
                return;
            }
            this.bRendered = true;
            /////
            var self = this;
            if (self.bDebug)
                console.log(SignUpView.TAG + "render()");
            var template = _.template(FoodParent.Template.getSignUpViewTemplate());
            $('#wrapper-pop').html(template({}));
            self.setElement($('#wrapper-signup'));
            /*
            var place: Place = Model.getPlaces().findWhere({ id: self._donation.getPlaceId() });
            
            self.renderDonationInfo();
            */
            self.setVisible();
            self.resize();
            return self;
        };
        SignUpView.prototype.setVisible = function () {
            var self = this;
            FoodParent.Setting.getPopWrapperElement().removeClass('hidden');
        };
        SignUpView.prototype.setInvisible = function () {
            var self = this;
            FoodParent.Setting.getPopWrapperElement().addClass('hidden');
        };
        SignUpView.prototype._mouseClick = function (event) {
            var self = this;
            FoodParent.EventHandler.handleMouseClick($(event.currentTarget), self);
        };
        SignUpView.prototype._signupSubmit = function (event) {
            var self = this;
            if (!self.bProcessing) {
                self.bProcessing = true;
                if (!isValidEmailAddress($('.input-contact').val())) {
                    new FoodParent.RenderMessageViewCommand({ el: FoodParent.Setting.getMessageWrapperElement(), message: FoodParent.Setting.getErrorMessage(803), undoable: false }).execute();
                    self.bProcessing = false;
                }
                else if ($('.input-name').val().trim() == "") {
                    new FoodParent.RenderMessageViewCommand({ el: FoodParent.Setting.getMessageWrapperElement(), message: FoodParent.Setting.getErrorMessage(604), undoable: false }).execute();
                    self.bProcessing = false;
                }
                else if ($('.input-neighborhood').val().trim() == "") {
                    new FoodParent.RenderMessageViewCommand({ el: FoodParent.Setting.getMessageWrapperElement(), message: FoodParent.Setting.getErrorMessage(605), undoable: false }).execute();
                    self.bProcessing = false;
                }
                else {
                    FoodParent.Controller.processSignup($('.input-contact').val().trim(), $('.input-name').val().trim(), $('.input-neighborhood').val().trim(), function (data) {
                        Backbone.history.loadUrl(Backbone.history.fragment);
                        self.bProcessing = false;
                    }, function (data) {
                        new FoodParent.RenderMessageViewCommand({ el: FoodParent.Setting.getMessageWrapperElement(), message: FoodParent.Setting.getErrorMessage(data.error), undoable: false }).execute();
                        self.bProcessing = false;
                    });
                }
            }
        };
        SignUpView.TAG = "SignUpView - ";
        return SignUpView;
    })(FoodParent.PopupView);
    FoodParent.SignUpView = SignUpView;
})(FoodParent || (FoodParent = {}));
