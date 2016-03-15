var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var NavViewFractory = (function () {
        function NavViewFractory(args) {
            if (NavViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use NavViewFractory.getInstance() instead of new.");
            }
            NavViewFractory._instance = this;
        }
        NavViewFractory.getInstance = function () {
            return NavViewFractory._instance;
        };
        NavViewFractory.create = function (el) {
            var view = new NavView({ el: el });
            return view;
        };
        NavViewFractory._instance = new NavViewFractory();
        return NavViewFractory;
    })();
    FoodParent.NavViewFractory = NavViewFractory;
    var NavView = (function (_super) {
        __extends(NavView, _super);
        function NavView(options) {
            _super.call(this, options);
            var self = this;
            self.bDebug = true;
            self._contact = "";
            self.events = {
                "click .item-nav": "_mouseClick",
            };
            self.delegateEvents();
        }
        NavView.prototype.render = function (args) {
            _super.prototype.render.call(this, args);
            var self = this;
            if (self.bDebug)
                console.log(NavView.TAG + "render()");
            var template = _.template(FoodParent.Template.getNavViewTemplate());
            self.$el.html(template({}));
            self.setElement(FoodParent.Setting.getNavWrapperElement());
            self.renderNavItems();
            return self;
        };
        NavView.prototype.update = function (args) {
            _super.prototype.update.call(this, args);
            var self = this;
            if (self.bDebug)
                console.log(NavView.TAG + "update()");
            self.renderNavItems();
            return self;
        };
        NavView.prototype.resize = function () {
            var self = this;
            if (self.bDebug)
                console.log(NavView.TAG + "resize()");
            self.$('.text-contact').html('');
            $.each(self.$('#content-nav .item-nav'), function () {
                $(this).removeAttr('style');
            });
            $.each(self.$('#content-nav .item-nav'), function () {
                $(this).css({
                    width: $(this).outerWidth(),
                });
            });
            self.$('.text-contact').html('<span>' + self._contact + '</span>');
            self.$('.text-contact').textfill({ maxFontPixels: 16 });
        };
        /**
         * Render navigation menu items based on login / admin status
         */
        NavView.prototype.renderNavItems = function () {
            var self = this;
            var template;
            FoodParent.Controller.checkIsLoggedIn(function (response) {
                self._contact = response.contact;
                FoodParent.Controller.checkIsAdmin(function () {
                    if (self.bDebug)
                        console.log(NavView.TAG + "Logged in as admin");
                    template = _.template(FoodParent.Template.getNavViewTemplateForAdmin());
                    self.$('#content-nav').html(template({
                        contact: "",
                    }));
                    self.resize();
                    self.setActiveNavItem(FoodParent.View.getViewStatus());
                }, function () {
                    if (self.bDebug)
                        console.log(NavView.TAG + "Logged in as parent");
                    template = _.template(FoodParent.Template.getNavViewTemplateForParent());
                    self.$('#content-nav').html(template({
                        contact: "",
                    }));
                    self.resize();
                    self.setActiveNavItem(FoodParent.View.getViewStatus());
                }, function () {
                    if (self.bDebug)
                        console.log(NavView.TAG + "Error occured");
                });
            }, function () {
                if (self.bDebug)
                    console.log(NavView.TAG + "Not logged in");
                template = _.template(FoodParent.Template.getNavViewTemplateForGuest());
                self.$('#content-nav').html(template({}));
                self.resize();
                self.setActiveNavItem(FoodParent.View.getViewStatus());
            }, function () {
                if (self.bDebug)
                    console.log(NavView.TAG + "Error occured");
            });
        };
        NavView.prototype.setActiveNavItem = function (viewStatus) {
            var self = this;
            if (self.bDebug)
                console.log(NavView.TAG + "setActiveNavItem()");
            if (viewStatus) {
                var _viewStatus = viewStatus;
            }
            else {
                var _viewStatus = FoodParent.View.getViewStatus();
            }
            switch (_viewStatus) {
                case FoodParent.VIEW_STATUS.HOME:
                    self.$el.addClass('hidden');
                    break;
                case FoodParent.VIEW_STATUS.TREES:
                case FoodParent.VIEW_STATUS.TREE:
                    self.$el.removeClass('hidden');
                    self.$('.item-nav').removeClass('active');
                    self.$('.evt-trees').addClass('active');
                    break;
                case FoodParent.VIEW_STATUS.MANAGE_PEOPLE:
                    self.$el.removeClass('hidden');
                    self.$('.item-nav').removeClass('active');
                    self.$('.people').addClass('active');
                    break;
                case FoodParent.VIEW_STATUS.LOGIN:
                    self.$el.removeClass('hidden');
                    self.$('.item-nav').removeClass('active');
                    self.$('.evt-login').addClass('active');
                    break;
            }
        };
        NavView.prototype._mouseClick = function (event) {
            var self = this;
            FoodParent.EventHandler.handleMouseClick($(event.currentTarget), self);
        };
        NavView.TAG = "NavView - ";
        return NavView;
    })(FoodParent.BaseView);
    FoodParent.NavView = NavView;
})(FoodParent || (FoodParent = {}));
