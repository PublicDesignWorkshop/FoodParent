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
            else if (args.viewStatus == FoodParent.VIEW_STATUS.MANAGE_TREES || args.viewStatus == FoodParent.VIEW_STATUS.MANAGE_PEOPLE || args.viewStatus == FoodParent.VIEW_STATUS.DETAIL_TREE || args.viewStatus == FoodParent.VIEW_STATUS.MANAGE_DONATIONS || args.viewStatus == FoodParent.VIEW_STATUS.DETAIL_DONATION) {
                template = _.template(FoodParent.Template.getNavViewManageTemplate());
                data = {};
            }
            self.$el.html(template(data));
            if (args.viewStatus == FoodParent.VIEW_STATUS.HOME) {
                self.urenderNavItems();
                self.$('#background-nav-left').css({ left: '-76%' });
                self.$('#background-nav-left').css({ transform: 'skew(-10deg, 0)' });
            }
            else if (args.viewStatus == FoodParent.VIEW_STATUS.MANAGE_TREES || args.viewStatus == FoodParent.VIEW_STATUS.MANAGE_PEOPLE || args.viewStatus == FoodParent.VIEW_STATUS.DETAIL_TREE || args.viewStatus == FoodParent.VIEW_STATUS.MANAGE_DONATIONS || args.viewStatus == FoodParent.VIEW_STATUS.DETAIL_DONATION) {
                self.renderNavManageItems();
                self.$('#background-nav-left').css({ left: '-30%' });
                self.$('#background-nav-left').css({ transform: 'skew(-0deg, 0)' });
            }
            self.resize();
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
                self.$('#background-nav-left').animate({ left: '-76%' }, FoodParent.Setting.getNavAnimDuration());
                self.$('#background-nav-left').css({ transform: 'skew(-10deg, 0)' });
            }
            else if (args.viewStatus == FoodParent.VIEW_STATUS.MANAGE_TREES || args.viewStatus == FoodParent.VIEW_STATUS.MANAGE_PEOPLE || args.viewStatus == FoodParent.VIEW_STATUS.DETAIL_TREE || args.viewStatus == FoodParent.VIEW_STATUS.MANAGE_DONATIONS) {
                self.renderNavManageItems();
                self.$('#background-nav-left').animate({ left: '-30%' }, FoodParent.Setting.getNavAnimDuration());
                self.$('#background-nav-left').css({ transform: 'skew(-0deg, 0)' });
            }
            self.resize();
            return self;
        };
        NavView.prototype.resize = function () {
            var self = this;
        };
        NavView.prototype.focusOnLeft = function () {
            var self = this;
            self.$('#background-nav-left').animate({ left: '-72%' }, FoodParent.Setting.getNavAnimDuration());
        };
        NavView.prototype.focusOnRight = function () {
            var self = this;
            self.$('#background-nav-left').animate({ left: '-76%' }, FoodParent.Setting.getNavAnimDuration());
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
            switch (viewStatus) {
                case FoodParent.VIEW_STATUS.MANAGE_TREES:
                case FoodParent.VIEW_STATUS.DETAIL_TREE:
                    self.$('.item-nav').removeClass('active');
                    self.$('.trees').addClass('active');
                    break;
                case FoodParent.VIEW_STATUS.MANAGE_PEOPLE:
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
