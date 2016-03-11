module FoodParent {
    export class LogInViewFactory {
        private static _instance: LogInViewFactory = new LogInViewFactory();
        private baseUrl: string;
        constructor(args?: any) {
            if (LogInViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use LogInViewFactory.getInstance() instead of new.");
            }
            LogInViewFactory._instance = this;
        }
        public static getInstance(): LogInViewFactory {
            return LogInViewFactory._instance;
        }
        public static create(el: JQuery): LogInView {
            var view: LogInView = new LogInView({ el: el });
            return view;
        }
    }

    export class LogInView extends PopupView {
        private static TAG: string = "LogInView - ";
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: LogInView = this;
            self.bDebug = true;
            self.events = <any>{
                "click .evt-manager": "_toggleManagerLogIn",
                "click .evt-close": "_mouseClick",
                "click .evt-submit": "_loginSubmit",
                "keydown .input-contact": "_keyDown",
            };
            self.delegateEvents();
        }
        public render(args?: any): any {
            super.render(args);
            var self: LogInView = this;
            if (self.bDebug) console.log(LogInView.TAG + "render()");
            var template = _.template(Template.getLogInViewTemplate());
            self.$el.html(template({
                header: 'Parent Sign-In',
            }));
            self.setElement($('#wrapper-login'));
            self.setVisible();
            self.resize();
            return self;
        }

        private _toggleManagerLogIn(event: Event): void {
            var self: LogInView = this;
            if ($(event.target).find('input').prop('name') == 'manager') {
                setTimeout(function () {
                    if ($(event.target).find('input').prop('checked') == true) {
                        self.$('.input-password').closest('.info-group').removeClass('invisible');
                    } else {
                        self.$('.input-password').closest('.info-group').addClass('invisible');
                        self.$('.input-password').val("");
                    }
                }, 1);
            }
        }

        private _mouseClick(event: Event): void {
            var self: LogInView = this;
            EventHandler.handleMouseClick($(event.currentTarget), self);
        }

        private _keyDown(event: any): void {
            var self: LogInView = this;
            if (event.keyCode == 13) {  // keydown enter
                self._loginSubmit();
            }
        }

        private _loginSubmit(event?: Event): void {
            var self: LogInView = this;
            if ($('input[type="checkbox"][name="manager"]').prop('checked') == true) {
                if (!isValidEmailAddress($('.input-contact').val())) {
                    new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: "Please put a valid <strong><i>e-mail address.", undoable: false }).execute();
                } else if (self.$('.input-password').val().trim() == '') {
                    new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: "Please put a <strong>password</strong>, or uncheck <strong>manager option</strong>.", undoable: false }).execute();
                } else {
                    EventHandler.handleMouseClick(self.$('.evt-submit'), self, { contact: $('.input-contact').val().trim(), password: $('.input-password').val().trim() });
                }
            } else {
                if (!isValidEmailAddress($('.input-contact').val())) {
                    new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: "Please put a valid <strong><i>e-mail address.", undoable: false }).execute();
                } else {
                    EventHandler.handleMouseClick(self.$('.evt-submit'), self, { contact: $('.input-contact').val().trim(), password: $('.input-contact').val().trim() });
                }
            }
        }
    }

    export class AccountViewFactory {
        private static _instance: AccountViewFactory = new AccountViewFactory();
        private baseUrl: string;
        constructor(args?: any) {
            if (AccountViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use AccountViewFactory.getInstance() instead of new.");
            }
            AccountViewFactory._instance = this;
        }
        public static getInstance(): AccountViewFactory {
            return AccountViewFactory._instance;
        }
        public static create(el: JQuery): AccountView {
            var view: AccountView = new AccountView({ el: el });
            return view;
        }
    }

    export class AccountView extends PopupView {
        private static TAG: string = "AccountView - ";
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: AccountView = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = <any>{
                "click .evt-close": "_mouseClick",
                "click .evt-logout": "_mouseClick",
            };
            self.delegateEvents();
        }
        public render(args?: any): any {
            super.render(args);
            var self: AccountView = this;
            if (self.bDebug) console.log(AccountView.TAG + "render()");

            Controller.checkIsLoggedIn(function (response) {
                Controller.checkIsAdmin(function () {
                    var template = _.template(Template.getAccountViewTemplateForAdmin());
                    Setting.getPopWrapperElement().append(template({
                        header: 'Admin Info',
                        contact: response.contact,
                    }));
                    self.setElement($('#wrapper-login'));
                    Controller.fetchAllPersons(function () {
                        var person: Person = Model.getPersons().findWhere({ id: parseInt(response.id) });
                        self.$('.input-name').val(person.getRealName());
                        self.$('.input-neighborhood').val(person.getNeighboorhood());
                    }, function () {
                        EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                }, function () {
                    var template = _.template(Template.getAccountViewTemplateForParent());
                    Setting.getPopWrapperElement().append(template({
                        header: 'Parent Info',
                        contact: response.contact,
                    }));
                    self.setElement($('#wrapper-login'));
                    Controller.fetchAllPersons(function () {
                        var person: Person = Model.getPersons().findWhere({ id: parseInt(response.id) });
                        self.$('.input-name').val(person.getRealName());
                        self.$('.input-neighborhood').val(person.getNeighboorhood());
                    }, function () {
                        EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                }, function () {
                    EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            }, function () {
                Backbone.history.loadUrl(Backbone.history.fragment);
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
            
            self.setVisible();
            self.resize();
            return self;
        }

        private _mouseClick(event: Event): void {
            var self: AccountView = this;
            EventHandler.handleMouseClick($(event.currentTarget), self);
        }
    }

    export class SignUpViewFactory {
        private static _instance: SignUpViewFactory = new SignUpViewFactory();
        private baseUrl: string;
        constructor(args?: any) {
            if (SignUpViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use SignUpViewFactory.getInstance() instead of new.");
            }
            SignUpViewFactory._instance = this;
        }
        public static getInstance(): SignUpViewFactory {
            return SignUpViewFactory._instance;
        }
        public static create(el: JQuery): SignUpView {
            var view: SignUpView = new SignUpView({ el: el });
            return view;
        }
    }
    export class SignUpView extends PopupView {
        private static TAG: string = "SignUpView - ";
        private bProcessing: boolean = false;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: SignUpView = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = <any>{
                "click .top-right-button": "_mouseClick",
                "click .signup-cancel": "_mouseClick",
                "click .signup-submit": "_signupSubmit",
            };
            self.delegateEvents();
        }
        public render(args?: any): any {
            if (this.bRendered) {
                this.update(args);
                return;
            }
            this.bRendered = true;
            /////
            var self: SignUpView = this;
            if (self.bDebug) console.log(SignUpView.TAG + "render()");

            var template = _.template(Template.getSignUpViewTemplate());
            $('#wrapper-pop').html(template({

            }));
            self.setElement($('#wrapper-signup'));

            

            /*
            var place: Place = Model.getPlaces().findWhere({ id: self._donation.getPlaceId() });
            
            self.renderDonationInfo();
            */
            self.setVisible();
            self.resize();
            return self;
        }

        public setVisible(): void {
            var self: SignUpView = this;
            Setting.getPopWrapperElement().removeClass('hidden');
        }
        public setInvisible(): void {
            var self: SignUpView = this;
            Setting.getPopWrapperElement().addClass('hidden');
        }

        private _mouseClick(event: Event): void {
            var self: SignUpView = this;
            EventHandler.handleMouseClick($(event.currentTarget), self);
        }

        private _signupSubmit(event: Event): void {
            var self: SignUpView = this;
            if (!self.bProcessing) {
                self.bProcessing = true;
                if (!isValidEmailAddress($('.input-contact').val())) {
                    new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: Setting.getErrorMessage(803), undoable: false }).execute();
                    self.bProcessing = false;
                } else if ($('.input-name').val().trim() == "") {
                    new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: Setting.getErrorMessage(604), undoable: false }).execute();
                    self.bProcessing = false;
                } else if ($('.input-neighborhood').val().trim() == "") {
                    new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: Setting.getErrorMessage(605), undoable: false }).execute();
                    self.bProcessing = false;
                } else {
                    Controller.processSignup($('.input-contact').val().trim(), $('.input-name').val().trim(), $('.input-neighborhood').val().trim(), function (data) {
                        Backbone.history.loadUrl(Backbone.history.fragment);
                        self.bProcessing = false;
                    }, function (data) {
                        new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: Setting.getErrorMessage(data.error), undoable: false }).execute();
                        self.bProcessing = false;
                    });
                }
            }
            
        }
    }
}