module FoodParent {
    export class ChangePasswordViewFactory {
        private static _instance: ChangePasswordViewFactory = new ChangePasswordViewFactory();
        private baseUrl: string;
        constructor(args?: any) {
            if (ChangePasswordViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use ChangePasswordViewFactory.getInstance() instead of new.");
            }
            ChangePasswordViewFactory._instance = this;
        }
        public static getInstance(): ChangePasswordViewFactory {
            return ChangePasswordViewFactory._instance;
        }
        public static create(el: JQuery, person: Person): ChangePasswordView {
            var view: ChangePasswordView = new ChangePasswordView({ el: el });
            view.setPerson(person);
            return view;
        }
    }

    export class ChangePasswordView extends PopupView {
        private static TAG: string = "ChangePasswordView - ";
        private _person: Person;
        private bProcessing: boolean = false;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: ChangePasswordView = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = <any>{
                "click .top-right-button": "_mouseClick",
                "click .password-cancel": "_mouseClick",
                "click .password-submit": "_submitPassword",
            };
            self.delegateEvents();
        }
        public setPerson(person: Person): void {
            var self: ChangePasswordView = this;
            self._person = person;
        }

        public render(args?: any): any {
            if (this.bRendered) {
                this.update(args);
                return;
            }
            this.bRendered = true;
            /////
            var self: ChangePasswordView = this;
            if (self.bDebug) console.log(ChangePasswordView.TAG + "render()");

            //var food: Food = Model.getFoods().findWhere({ id: self._tree.getFoodId() });
            
            var template = _.template(Template.getChangePasswordViewTemplate());
            var data = {
                personname: self._person.getName(),
            }
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-change-password'));
            
            self.setVisible();
            self.resize();
            return self;
        }

        public update(args?: any): any {
            if (!this.bRendered) {
                this.render(args);
                return;
            }
            /////
            var self: ChangePasswordView = this;
            if (self.bDebug) console.log(ChangePasswordView.TAG + "update()");
            return self;
        }

        public resize(): any {
            var self: ChangePasswordView = this;
        }
        public setVisible(): void {
            var self: ChangePasswordView = this;
            Setting.getPopWrapperElement().removeClass('hidden');
        }
        public setInvisible(): void {
            var self: ChangePasswordView = this;
            Setting.getPopWrapperElement().addClass('hidden');
        }
        private _mouseClick(event: Event): void {
            var self: ChangePasswordView = this;
            EventHandler.handleMouseClick($(event.currentTarget), self);
        }

        private _submitPassword(event: Event): void {
            var self: ChangePasswordView = this;
            if (!self.bProcessing) {
                self.bProcessing = true;
                if (self.$('.input-password').val().trim() == "" && self.$('.input-password2').val().trim() == "") {
                    new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: "Please <strong>enter</strong> a new password.", undoable: false }).execute();
                    self.bProcessing = false;
                } else if (self.$('.input-password').val().trim().length < 6) {
                    new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: "The password should be longer than <strong>6 characters</strong>.", undoable: false }).execute();
                    self.bProcessing = false;
                } else if (self.$('.input-password').val().trim() == self.$('.input-password2').val().trim()) {
                    Controller.changePassword(self._person.getId(), self.$('.input-password').val().trim(), function (response) {
                        if (response.result == "true" || response.result == true) {
                            new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: "The <strong>password</strong> was changed successfully.", undoable: false }).execute();
                            new RemoveAlertViewCommand({ delay: Setting.getRemovePopupDuration() }).execute();
                            self.bProcessing = false;
                            Backbone.history.loadUrl(Backbone.history.fragment);
                        } else {
                            new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: Setting.getErrorMessage(response.code), undoable: false }).execute();
                            self.bProcessing = false;
                        }
                    }, function (response) {
                        EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        self.bProcessing = false;
                    });
                } else {
                    new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: "Please enter <strong>same</strong> passwords.", undoable: false }).execute();
                    self.bProcessing = false;
                }
            }
        }
    }
}
