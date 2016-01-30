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
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = <any>{
                "click .alert-confirm": "_mouseClick",
                "click .filter-manager": "_managerLogIn",
                "click .top-right-button": "_mouseClick",
                "click .login-cancel": "_mouseClick",
                "click .login-submit": "_loginSubmit",
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
            var self: LogInView = this;
            if (self.bDebug) console.log(LogInView.TAG + "render()");

            var template = _.template(Template.getLogInViewTemplate());
            var data = {

            }
            $('#wrapper-pop').html(template(data));
            self.setElement($('#wrapper-login'));

            /*
            var place: Place = Model.getPlaces().findWhere({ id: self._donation.getPlaceId() });
            
            self.renderDonationInfo();
            */
            self.setVisible();
            self.resize();
            return self;
        }

        public setVisible(): void {
            var self: LogInView = this;
            Setting.getPopWrapperElement().removeClass('hidden');
        }
        public setInvisible(): void {
            var self: LogInView = this;
            Setting.getPopWrapperElement().addClass('hidden');
        }

        private _managerLogIn(event: Event): void {
            var self: LogInView = this;
            if ($(event.target).find('input').prop('name') == 'manager') {
                setTimeout(function () {
                    if ($(event.target).find('input').prop('checked') == true) {
                        self.$('.input-password').closest('.info-group').removeClass('hidden');
                    } else {
                        self.$('.input-password').closest('.info-group').addClass('hidden');
                        self.$('.input-password').val("");
                    }
                }, 1);
            }
        }

        private _mouseClick(event: Event): void {
            var self: LogInView = this;
            EventHandler.handleMouseClick($(event.currentTarget), self);
        }

        private _loginSubmit(event: Event): void {
            var self: LogInView = this;
            if ($('input[type="checkbox"][name="manager"]').prop('checked') == true) {
                if (!isValidEmailAddress($('.input-contact').val())) {
                    new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: "Please put a valid <strong><i>e-mail address.", undoable: false }).execute();
                } else if (self.$('.input-password').val().trim() == '') {
                    new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: "Please put a <strong>password</strong>, or uncheck <strong>manager option</strong>.", undoable: false }).execute();
                } else {
                    EventHandler.handleMouseClick($(event.currentTarget), self, { contact: $('.input-contact').val().trim(), password: $('.input-password').val().trim() });
                }
            } else {
                if (!isValidEmailAddress($('.input-contact').val())) {
                    new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: "Please put a valid <strong><i>e-mail address.", undoable: false }).execute();
                } else {
                    EventHandler.handleMouseClick($(event.currentTarget), self, { contact: $('.input-contact').val().trim(), password: $('.input-contact').val().trim() });
                }
            }

            //
        }
    }

    export class LoggedInViewFactory {
        private static _instance: LoggedInViewFactory = new LoggedInViewFactory();
        private baseUrl: string;
        constructor(args?: any) {
            if (LoggedInViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use LoggedInViewFactory.getInstance() instead of new.");
            }
            LoggedInViewFactory._instance = this;
        }
        public static getInstance(): LoggedInViewFactory {
            return LoggedInViewFactory._instance;
        }
        public static create(el: JQuery): LoggedInView {
            var view: LoggedInView = new LoggedInView({ el: el });
            return view;
        }
    }

    export class LoggedInView extends PopupView {
        private static TAG: string = "LoggedInView - ";
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: LoggedInView = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = <any>{
                "click .logged-logout": "_mouseClick",
                "click .top-right-button": "_mouseClick",
                "click .logged-cancel": "_mouseClick",
                "click .logged-submit": "_loggedSubmit",
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
            var self: LoggedInView = this;
            if (self.bDebug) console.log(LoggedInView.TAG + "render()");

            Controller.checkLogin(function (data) {
                if (data.result == true || data.result == 'true') {   // Already logged in
                    var template = _.template(Template.getLoggedInViewTemplate());
                    $('#wrapper-pop').html(template({
                        'contact': data.contact,
                        'auth': parseInt(data.auth),
                    }));
                    self.setElement($('#wrapper-login'));
                }
            }, function () {

            });

            

            /*
            var place: Place = Model.getPlaces().findWhere({ id: self._donation.getPlaceId() });
            
            self.renderDonationInfo();
            */
            self.setVisible();
            self.resize();
            return self;
        }

        public setVisible(): void {
            var self: LoggedInView = this;
            Setting.getPopWrapperElement().removeClass('hidden');
        }
        public setInvisible(): void {
            var self: LoggedInView = this;
            Setting.getPopWrapperElement().addClass('hidden');
        }

        private _managerLogIn(event: Event): void {
            var self: LoggedInView = this;
            if ($(event.target).find('input').prop('name') == 'manager') {
                setTimeout(function () {
                    if ($(event.target).find('input').prop('checked') == true) {
                        self.$('.input-password').closest('.info-group').removeClass('hidden');
                    } else {
                        self.$('.input-password').closest('.info-group').addClass('hidden');
                        self.$('.input-password').val("");
                    }
                }, 1);
            }
        }

        private _mouseClick(event: Event): void {
            var self: LoggedInView = this;
            EventHandler.handleMouseClick($(event.currentTarget), self);
        }

        private _loginSubmit(event: Event): void {
            var self: LoggedInView = this;
            if ($('input[type="checkbox"][name="manager"]').prop('checked') == true) {
                if (!isValidEmailAddress($('.input-contact').val())) {
                    new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: "Please put a valid <strong><i>e-mail address.", undoable: false }).execute();
                } else if (self.$('.input-password').val().trim() == '') {
                    new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: "Please put a <strong>password</strong>, or uncheck <strong>manager option</strong>.", undoable: false }).execute();
                } else {
                    EventHandler.handleMouseClick($(event.currentTarget), self, { contact: $('.input-contact').val().trim(), password: $('.input-password').val().trim() });
                }
            } else {
                if (!isValidEmailAddress($('.input-contact').val())) {
                    new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: "Please put a valid <strong><i>e-mail address.", undoable: false }).execute();
                } else {
                    EventHandler.handleMouseClick($(event.currentTarget), self, { contact: $('.input-contact').val().trim(), password: $('.input-contact').val().trim() });
                }
            }

            //
        }
    }
}