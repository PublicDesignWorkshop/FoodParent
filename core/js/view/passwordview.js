var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var ChangePasswordViewFactory = (function () {
        function ChangePasswordViewFactory(args) {
            if (ChangePasswordViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use ChangePasswordViewFactory.getInstance() instead of new.");
            }
            ChangePasswordViewFactory._instance = this;
        }
        ChangePasswordViewFactory.getInstance = function () {
            return ChangePasswordViewFactory._instance;
        };
        ChangePasswordViewFactory.create = function (el, person) {
            var view = new ChangePasswordView({ el: el });
            view.setPerson(person);
            return view;
        };
        ChangePasswordViewFactory._instance = new ChangePasswordViewFactory();
        return ChangePasswordViewFactory;
    })();
    FoodParent.ChangePasswordViewFactory = ChangePasswordViewFactory;
    var ChangePasswordView = (function (_super) {
        __extends(ChangePasswordView, _super);
        function ChangePasswordView(options) {
            _super.call(this, options);
            this.bProcessing = false;
            var self = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = {
                "click .top-right-button": "_mouseClick",
                "click .password-cancel": "_mouseClick",
                "click .password-submit": "_submitPassword",
            };
            self.delegateEvents();
        }
        ChangePasswordView.prototype.setPerson = function (person) {
            var self = this;
            self._person = person;
        };
        ChangePasswordView.prototype.render = function (args) {
            if (this.bRendered) {
                this.update(args);
                return;
            }
            this.bRendered = true;
            /////
            var self = this;
            if (self.bDebug)
                console.log(ChangePasswordView.TAG + "render()");
            //var food: Food = Model.getFoods().findWhere({ id: self._tree.getFoodId() });
            var template = _.template(FoodParent.Template.getChangePasswordViewTemplate());
            var data = {
                personname: self._person.getName(),
            };
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-change-password'));
            self.setVisible();
            self.resize();
            return self;
        };
        ChangePasswordView.prototype.update = function (args) {
            if (!this.bRendered) {
                this.render(args);
                return;
            }
            /////
            var self = this;
            if (self.bDebug)
                console.log(ChangePasswordView.TAG + "update()");
            return self;
        };
        ChangePasswordView.prototype.resize = function () {
            var self = this;
        };
        ChangePasswordView.prototype.setVisible = function () {
            var self = this;
            FoodParent.Setting.getPopWrapperElement().removeClass('hidden');
        };
        ChangePasswordView.prototype.setInvisible = function () {
            var self = this;
            FoodParent.Setting.getPopWrapperElement().addClass('hidden');
        };
        ChangePasswordView.prototype._mouseClick = function (event) {
            var self = this;
            FoodParent.EventHandler.handleMouseClick($(event.currentTarget), self);
        };
        ChangePasswordView.prototype._submitPassword = function (event) {
            var self = this;
            if (!self.bProcessing) {
                self.bProcessing = true;
                if (self.$('.input-password').val().trim() == "" && self.$('.input-password2').val().trim() == "") {
                    new FoodParent.RenderMessageViewCommand({ el: FoodParent.Setting.getMessageWrapperElement(), message: "Please <strong>enter</strong> a new password.", undoable: false }).execute();
                    self.bProcessing = false;
                }
                else if (self.$('.input-password').val().trim().length < 6) {
                    new FoodParent.RenderMessageViewCommand({ el: FoodParent.Setting.getMessageWrapperElement(), message: "The password should be longer than <strong>6 characters</strong>.", undoable: false }).execute();
                    self.bProcessing = false;
                }
                else if (self.$('.input-password').val().trim() == self.$('.input-password2').val().trim()) {
                    FoodParent.Controller.changePassword(self._person.getId(), self.$('.input-password').val().trim(), function (response) {
                        if (response.result == "true" || response.result == true) {
                            new FoodParent.RenderMessageViewCommand({ el: FoodParent.Setting.getMessageWrapperElement(), message: "The <strong>password</strong> has changed successfully.", undoable: false }).execute();
                            new RemoveAlertViewCommand({ delay: FoodParent.Setting.getRemovePopupDuration() }).execute();
                            self.bProcessing = false;
                            Backbone.history.loadUrl(Backbone.history.fragment);
                        }
                        else {
                            new FoodParent.RenderMessageViewCommand({ el: FoodParent.Setting.getMessageWrapperElement(), message: FoodParent.Setting.getErrorMessage(response.code), undoable: false }).execute();
                            self.bProcessing = false;
                        }
                    }, function (response) {
                        FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                        self.bProcessing = false;
                    });
                }
                else {
                    new FoodParent.RenderMessageViewCommand({ el: FoodParent.Setting.getMessageWrapperElement(), message: "Please enter <strong>same</strong> passwords.", undoable: false }).execute();
                    self.bProcessing = false;
                }
            }
        };
        ChangePasswordView.TAG = "ChangePasswordView - ";
        return ChangePasswordView;
    })(FoodParent.PopupView);
    FoodParent.ChangePasswordView = ChangePasswordView;
})(FoodParent || (FoodParent = {}));
