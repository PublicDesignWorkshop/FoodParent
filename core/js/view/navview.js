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
        }
        NavView.prototype.render = function (args) {
            if (this.bRendered) {
                this.update(args);
                return;
            }
            this.bRendered = true;
            ////
            var self = this;
            if (self.bDebug)
                console.log(NavView.TAG + "render()");
            var template;
            var data;
            if (args.viewStatus == FoodParent.VIEW_STATUS.HOME) {
                template = _.template(FoodParent.Template.getNavViewHomeTemplate());
                data = {};
            }
            else if (args.viewStatus == FoodParent.VIEW_STATUS.MANAGE_TREES) {
                template = _.template(FoodParent.Template.getNavViewManageTemplate());
                data = {};
            }
            self.$el.html(template(data));
            if (args.viewStatus == FoodParent.VIEW_STATUS.HOME) {
                self.urenderNavItems();
                self.$('#background-nav-left').css({ left: '-69%' });
            }
            else if (args.viewStatus == FoodParent.VIEW_STATUS.MANAGE_TREES) {
                self.renderNavManageItems();
                self.$('#background-nav-left').css({ left: '-40%' });
            }
            return self;
        };
        NavView.prototype.update = function (args) {
            if (!this.bRendered) {
                this.render(args);
                return;
            }
            ////
            var self = this;
            if (self.bDebug)
                console.log(NavView.TAG + "update()");
            if (args.viewStatus == FoodParent.VIEW_STATUS.HOME) {
                self.urenderNavItems();
                self.$('#background-nav-left').animate({ left: '-69%' }, FoodParent.Setting.getNavAnimDuration());
            }
            else if (args.viewStatus == FoodParent.VIEW_STATUS.MANAGE_TREES) {
                self.renderNavManageItems();
                self.$('#background-nav-left').animate({ left: '-40%' }, FoodParent.Setting.getNavAnimDuration());
            }
            return self;
        };
        NavView.prototype.focusOnLeft = function () {
            var self = this;
            self.$('#background-nav-left').animate({ left: '-65%' }, FoodParent.Setting.getNavAnimDuration());
        };
        NavView.prototype.focusOnRight = function () {
            var self = this;
            self.$('#background-nav-left').animate({ left: '-70%' }, FoodParent.Setting.getNavAnimDuration());
        };
        NavView.prototype.urenderNavItems = function () {
            var self = this;
            self.$('#list-nav').html("");
        };
        NavView.prototype.renderNavManageItems = function () {
            var self = this;
            var template;
            var data;
            template = _.template(FoodParent.Template.getNavViewManageItemsTemplate());
            data = {};
            self.$('#list-nav').html(template(data));
        };
        NavView.prototype.setActiveNavItem = function (viewStatus) {
            var self = this;
            console.log(viewStatus);
            switch (viewStatus) {
                case FoodParent.VIEW_STATUS.MANAGE_TREES:
                    self.$('.item-nav').removeClass('active');
                    self.$('.trees').addClass('active');
                    break;
            }
        };
        NavView.TAG = "NavView - ";
        return NavView;
    })(FoodParent.BaseView);
    FoodParent.NavView = NavView;
})(FoodParent || (FoodParent = {}));
