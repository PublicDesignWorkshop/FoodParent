﻿module FoodParent {
    export class NavViewFractory {
        private static _instance: NavViewFractory = new NavViewFractory();
        private baseUrl: string;
        constructor(args?: any) {
            if (NavViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use NavViewFractory.getInstance() instead of new.");
            }
            NavViewFractory._instance = this;
        }
        public static getInstance(): NavViewFractory {
            return NavViewFractory._instance;
        }
        public static create(el: JQuery): NavView {
            var view: NavView = new NavView({ el: el });
            return view;
        }
    }

    export class NavView extends BaseView {
        private static TAG: string = "NavView - ";
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: NavView = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
        }
        public render(args?: any): any {
            if (this.bRendered) {
                this.update(args);
                return;
            }
            this.bRendered = true;
            ////
            var self: NavView = this;
            if (self.bDebug) console.log(NavView.TAG + "render()");
            var template: any;
            var data: any;
            if (args.viewStatus == VIEW_STATUS.HOME) {
                template = _.template(Template.getNavViewHomeTemplate());
                data = {

                }
            } else if (args.viewStatus == VIEW_STATUS.MANAGE_TREES) {
                template = _.template(Template.getNavViewManageTemplate());
                data = {

                }
            }

            
            self.$el.html(template(data));

            
            if (args.viewStatus == VIEW_STATUS.HOME) {
                self.urenderNavItems();
                self.$('#background-nav-left').css({ left: '-69%' });
            } else if (args.viewStatus == VIEW_STATUS.MANAGE_TREES) {
                self.renderNavManageItems();
                self.$('#background-nav-left').css({ left: '-40%' });
            }

            return self;
        }

        public update(args?: any): any {
            if (!this.bRendered) {
                this.render(args);
                return;
            }
            ////
            var self: NavView = this;
            if (self.bDebug) console.log(NavView.TAG + "update()");
            if (args.viewStatus == VIEW_STATUS.HOME) {
                self.urenderNavItems();
                self.$('#background-nav-left').animate({ left: '-69%' }, Setting.getNavAnimDuration());
            } else if (args.viewStatus == VIEW_STATUS.MANAGE_TREES) {
                self.renderNavManageItems();
                self.$('#background-nav-left').animate({ left: '-40%' }, Setting.getNavAnimDuration());
            }
            return self;
        }

        public focusOnLeft(): void {
            var self: NavView = this;
            self.$('#background-nav-left').animate({ left: '-65%' }, Setting.getNavAnimDuration());
        }

        public focusOnRight(): void {
            var self: NavView = this;
            self.$('#background-nav-left').animate({ left: '-70%' }, Setting.getNavAnimDuration());
        }

        public urenderNavItems(): void {
            var self: NavView = this;
            self.$('#list-nav').html("");
        }

        public renderNavManageItems(): void {
            var self: NavView = this;
            var template: any;
            var data: any;
            template = _.template(Template.getNavViewManageItemsTemplate());
            data = {

            }
            self.$('#list-nav').html(template(data));
        }

        public setActiveNavItem(viewStatus: VIEW_STATUS) {
            var self: NavView = this;
            switch (viewStatus) {
                case VIEW_STATUS.MANAGE_TREES:
                    self.$('.item-nav').removeClass('active');
                    self.$('.trees').addClass('active');
                    break;
            }
        }
    }
}