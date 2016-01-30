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
            self.events = <any>{
                "click .item-nav": "_mouseClick",
            };
            self.delegateEvents();
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
            } else if (args.viewStatus == VIEW_STATUS.MANAGE_TREES || args.viewStatus == VIEW_STATUS.MANAGE_PEOPLE || args.viewStatus == VIEW_STATUS.DETAIL_TREE || args.viewStatus == VIEW_STATUS.MANAGE_DONATIONS || args.viewStatus == VIEW_STATUS.DETAIL_DONATION) {
                template = _.template(Template.getNavViewManageTemplate());
                data = {

                }
            }

            
            self.$el.html(template(data));
            if (args.viewStatus == VIEW_STATUS.HOME) {
                self.urenderNavItems();
                self.$('#background-nav-left').css({ left: '-76%' });
                self.$('#background-nav-left').css({ transform: 'skew(-10deg, 0)' });
            } else if (args.viewStatus == VIEW_STATUS.MANAGE_TREES || args.viewStatus == VIEW_STATUS.MANAGE_PEOPLE || args.viewStatus == VIEW_STATUS.DETAIL_TREE || args.viewStatus == VIEW_STATUS.MANAGE_DONATIONS || args.viewStatus == VIEW_STATUS.DETAIL_DONATION) {
                self.renderNavManageItems();
                self.$('#background-nav-left').css({ left: '-30%' });
                self.$('#background-nav-left').css({ transform: 'skew(-0deg, 0)' });
            }

            self.resize();
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
            console.log(args.viewStatus);
            if (args.viewStatus == VIEW_STATUS.HOME) {
                self.urenderNavItems();
                self.$('#background-nav-left').animate({ left: '-76%' }, Setting.getNavAnimDuration());
                self.$('#background-nav-left').css({ transform: 'skew(-10deg, 0)' });
            } else if (args.viewStatus == VIEW_STATUS.MANAGE_TREES || args.viewStatus == VIEW_STATUS.MANAGE_PEOPLE || args.viewStatus == VIEW_STATUS.DETAIL_TREE || args.viewStatus == VIEW_STATUS.MANAGE_DONATIONS || args.viewStatus == VIEW_STATUS.DETAIL_DONATION) {
                self.renderNavManageItems();
                self.$('#background-nav-left').animate({ left: '-30%' }, Setting.getNavAnimDuration());
                self.$('#background-nav-left').css({ transform: 'skew(-0deg, 0)' });
            }

            self.resize();
            return self;
        }

        public resize(): any {
            var self: NavView = this;
        }

        public focusOnLeft(): void {
            var self: NavView = this;
            self.$('#background-nav-left').animate({ left: '-72%' }, Setting.getNavAnimDuration());
        }

        public focusOnRight(): void {
            var self: NavView = this;
            self.$('#background-nav-left').animate({ left: '-76%' }, Setting.getNavAnimDuration());
        }

        public urenderNavItems(): void {
            var self: NavView = this;
            self.$('#list-nav').html("");
        }

        public renderNavManageItems(): void {
            var self: NavView = this;
            var template: any;
            var data: any;

            Controller.checkLogin(function (data) {
                if (data.result == true || data.result == 'true') {   // Already logged in
                    console.log(data);
                    Controller.checkAdmin(function (data2) {
                        console.log(data2);
                        if (data2.result == true || data2.result == 'true') {   // Already logged in
                            template = _.template(Template.getNavViewManageItemsTemplate2());
                            self.$('#list-nav').html(template({
                                contact: data2.contact,
                            }));
                        } else if (data2.result == false || data2.result == 'false') {   // Not logged in
                            template = _.template(Template.getNavViewManageItemsTemplate3());
                            self.$('#list-nav').html(template({
                                contact: data.contact,
                            }));
                        }
                    }, function () {

                    });
                } else if (data.result == false || data.result == 'false') {   // Not logged in
                    template = _.template(Template.getNavViewManageItemsTemplate());
                    data = {

                    }
                    self.$('#list-nav').html(template(data));
                }
            }, function () {

            });
            
        }

        public setActiveNavItem(viewStatus: VIEW_STATUS) {
            var self: NavView = this;
            switch (viewStatus) {
                case VIEW_STATUS.MANAGE_TREES:
                case VIEW_STATUS.DETAIL_TREE:
                    self.$('.item-nav').removeClass('active');
                    self.$('.trees').addClass('active');
                    break;
                case VIEW_STATUS.MANAGE_PEOPLE:
                    self.$('.item-nav').removeClass('active');
                    self.$('.people').addClass('active');
                    break;
            }
        }

        private _mouseClick(event: Event): void {
            var self: NavView = this;
            EventHandler.handleMouseClick($(event.currentTarget), self);
        }
    }
}