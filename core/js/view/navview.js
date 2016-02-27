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
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = {
                "click .item-nav": "_mouseClick",
            };
            self.delegateEvents();
        }
        NavView.prototype.render = function (args) {
            if (this.bRendered) {
                this.update(args);
                return;
            }
            this.bRendered = true;
            //////////////// Execute ////////////////
            var self = this;
            if (self.bDebug)
                console.log(NavView.TAG + "render()");
            var template = _.template(FoodParent.Template.getNavViewTemplate());
            self.$el.html(template({}));
            self.setElement(FoodParent.Setting.getNavWrapperElement());
            self.renderNavManageItems(); //decides which view is shown
            self.resize();
            return self;
        };
        NavView.prototype.update = function (args) {
            if (!this.bRendered) {
                this.render(args);
                return;
            }
            //////////////// Execute ////////////////
            var self = this;
            self.renderNavManageItems(); //which view
            if (self.bDebug)
                console.log(NavView.TAG + "update()");
            self.renderNavManageItems();
            self.setActiveNavItem(args.viewStatus);
            self.resize();
            return self;
        };
        NavView.prototype.resize = function () {
            var self = this;
        };
        NavView.prototype.renderNavManageItems = function () {
            var self = this;
            var template;
            FoodParent.Controller.checkLogin(function (data) {
                if (data.result == true || data.result == 'true') {
                    FoodParent.Controller.checkAdmin(function (data2) {
                        if (data2.result == true || data2.result == 'true') {
                            template = _.template(FoodParent.Template.getNavViewManageItemsTemplate2());
                            self.$('#list-nav').html(template({
                                contact: data2.contact,
                            }));
                        }
                        else if (data2.result == false || data2.result == 'false') {
                            template = _.template(FoodParent.Template.getNavViewManageItemsTemplate3());
                            self.$('#list-nav').html(template({
                                contact: data.contact,
                            }));
                        }
                        self.setActiveNavItem(FoodParent.View.getViewStatus());
                    }, function () {
                    });
                }
                else if (data.result == false || data.result == 'false') {
                    template = _.template(FoodParent.Template.getNavViewManageItemsTemplate());
                    self.$('#list-nav').html(template({}));
                    self.setActiveNavItem(FoodParent.View.getViewStatus());
                }
            }, function () {
            });
        };
        NavView.prototype.setActiveNavItem = function (viewStatus) {
            var self = this;
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
                case FoodParent.VIEW_STATUS.MANAGE_TREES:
                case FoodParent.VIEW_STATUS.DETAIL_TREE:
                    self.$el.removeClass('hidden');
                    self.$('.item-nav').removeClass('active');
                    self.$('.trees').addClass('active');
                    break;
                case FoodParent.VIEW_STATUS.MANAGE_PEOPLE:
                    self.$el.removeClass('hidden');
                    self.$('.item-nav').removeClass('active');
                    self.$('.people').addClass('active');
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
